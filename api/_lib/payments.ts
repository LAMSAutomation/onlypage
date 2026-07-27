import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

type CheckoutItem = { product_id?: string; id?: string; quantity?: number; qty?: number };

const getServerClient = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });
};

const asMoney = (value: unknown) => Number(Number(value).toFixed(2));

export async function createPaymentOrder(body: any) {
  const siteId = typeof body?.site_id === 'string' ? body.site_id : '';
  const gateway = body?.gateway === 'upi' ? 'upi' : 'razorpay';
  const customer = body?.customer || {};
  const items = Array.isArray(body?.items) ? body.items as CheckoutItem[] : [];
  if (!siteId || !customer?.name || !customer?.email || !customer?.phone || items.length === 0) {
    return { status: 400, body: { error: 'site_id, customer name/email/phone, and at least one product are required.' } };
  }

  const quantities = new Map<string, number>();
  for (const item of items) {
    const productId = item.product_id || item.id;
    const quantity = Number(item.quantity ?? item.qty ?? 0);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { status: 400, body: { error: 'Each item must contain a product_id and a quantity between 1 and 20.' } };
    }
    quantities.set(productId, (quantities.get(productId) || 0) + quantity);
  }

  const supabase = getServerClient();
  if (!supabase) return { status: 503, body: { error: 'Payments are not configured on this deployment.' } };

  const [{ data: site, error: siteError }, { data: store, error: storeError }] = await Promise.all([
    supabase.from('sites').select('id, published').eq('id', siteId).maybeSingle(),
    supabase.from('ecom_stores').select('store_name, currency, tax_rate, shipping_fee, upi_vpa').eq('site_id', siteId).maybeSingle(),
  ]);
  if (siteError || storeError) return { status: 500, body: { error: 'Could not prepare checkout. Please try again.' } };
  if (!site?.published) return { status: 404, body: { error: 'This store is not available for checkout.' } };
  if (!store) return { status: 409, body: { error: 'This store has not completed payment setup.' } };

  const productIds = [...quantities.keys()];
  const { data: products, error: productsError } = await supabase
    .from('ecom_products').select('id, title, price, stock, status').eq('site_id', siteId).eq('status', 'active').in('id', productIds);
  if (productsError || !products || products.length !== productIds.length) return { status: 400, body: { error: 'One or more products are unavailable.' } };

  const catalog = new Map(products.map((product: any) => [product.id, product]));
  let subtotal = 0;
  const orderItems: Array<{ product_id: string; title: string; price: number; quantity: number }> = [];
  for (const productId of productIds) {
    const product: any = catalog.get(productId);
    const quantity = quantities.get(productId)!;
    if (product.stock < quantity) return { status: 409, body: { error: `${product.title} does not have enough stock.` } };
    const price = asMoney(product.price);
    subtotal += price * quantity;
    orderItems.push({ product_id: product.id, title: product.title, price, quantity });
  }

  const tax = asMoney(subtotal * Math.max(0, Number(store.tax_rate || 0)) / 100);
  const shipping = asMoney(Math.max(0, Number(store.shipping_fee || 0)));
  const total = asMoney(subtotal + tax + shipping);
  if (total <= 0) return { status: 400, body: { error: 'The calculated order total must be greater than zero.' } };

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  // Do this before creating a local order so an unconfigured checkout cannot
  // leave behind an order that a customer has no way to pay for.
  if (gateway === 'razorpay' && (!keyId || !keySecret)) {
    return { status: 503, body: { error: 'Razorpay is not configured on this deployment.' } };
  }

  const { data: order, error: orderError } = await supabase.from('ecom_orders').insert({
    site_id: siteId, customer_name: customer.name.trim(), customer_email: customer.email.trim().toLowerCase(), customer_phone: customer.phone.trim(),
    shipping_address: customer.shipping_address || {}, items: orderItems, total_amount: total, payment_status: 'pending', order_status: 'processing', payment_gateway: gateway,
  }).select().single();
  if (orderError) return { status: 500, body: { error: 'Could not create your order. Please try again.' } };

  if (gateway === 'upi') {
    if (!store.upi_vpa) return { status: 409, body: { error: 'UPI is not configured for this store.' } };
    const upiLink = `upi://pay?pa=${encodeURIComponent(store.upi_vpa)}&pn=${encodeURIComponent(store.store_name)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${order.order_number}`)}`;
    return { status: 200, body: { success: true, gateway: 'upi', order_id: order.id, order_number: order.order_number, amount: total, currency: 'INR', upi_link: upiLink, payment_status: 'pending' } };
  }

  const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}` },
    body: JSON.stringify({ amount: Math.round(total * 100), currency: store.currency || 'INR', receipt: `op_${order.id.slice(0, 18)}`, notes: { onlypage_order_id: order.id, site_id: siteId } }),
  });
  const razorpayOrder = await razorpayResponse.json();
  if (!razorpayResponse.ok || !razorpayOrder?.id) {
    await supabase.from('ecom_orders').update({ payment_status: 'failed', order_status: 'payment_failed' }).eq('id', order.id);
    return { status: 502, body: { error: 'Razorpay could not create a payment order. Please try again.' } };
  }
  await supabase.from('ecom_orders').update({ gateway_order_id: razorpayOrder.id }).eq('id', order.id);
  return { status: 200, body: { success: true, gateway: 'razorpay', order_id: razorpayOrder.id, local_order_id: order.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, key_id: keyId } };
}

export const verifyRazorpaySignature = (rawBody: string, signature?: string) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
};

export async function processRazorpayWebhook(payload: any) {
  if (payload?.event !== 'payment.captured') return { status: 200, body: { received: true, ignored: true } };
  const payment = payload?.payload?.payment?.entity;
  const gatewayOrderId = payment?.order_id;
  if (!gatewayOrderId || !payment?.id) return { status: 400, body: { error: 'Missing Razorpay payment details.' } };
  const supabase = getServerClient();
  if (!supabase) return { status: 503, body: { error: 'Payments are not configured on this deployment.' } };
  const { data: order, error } = await supabase.from('ecom_orders').select('*').eq('gateway_order_id', gatewayOrderId).maybeSingle();
  if (error || !order) return { status: 404, body: { error: 'Order not found.' } };
  if (order.payment_status === 'paid') return { status: 200, body: { received: true, duplicate: true } };
  if (Math.round(Number(order.total_amount) * 100) !== Number(payment.amount) || payment.currency !== 'INR') return { status: 400, body: { error: 'Payment amount or currency does not match the order.' } };

  const { error: updateError } = await supabase.from('ecom_orders').update({ payment_status: 'paid', order_status: 'processing', payment_id: payment.id, paid_at: new Date().toISOString() }).eq('id', order.id);
  if (updateError) return { status: 500, body: { error: 'Could not update payment status.' } };
  await supabase.from('leads').insert({ site_id: order.site_id, name: order.customer_name, email: order.customer_email, phone: order.customer_phone, status: 'Customer', amount: order.total_amount, source: 'Store purchase' });
  return { status: 200, body: { received: true, order_id: order.id } };
}
