import { supabase } from './supabase';

// ==========================================
// E-Commerce Supabase CRUD helpers
// ==========================================

// --- Products ---

export async function fetchProducts(siteId: string) {
  const { data, error } = await supabase
    .from('ecom_products')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });
  if (error) console.error('fetchProducts error:', error.message);
  return data || [];
}

export async function upsertProduct(product: {
  id?: string;
  site_id: string;
  title: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  images?: any[];
  stock?: number;
  category?: string;
  tags?: string[];
  offer_badge?: string;
  status?: string;
  seo_title?: string;
  seo_desc?: string;
}) {
  const { data, error } = await supabase
    .from('ecom_products')
    .upsert(product, { onConflict: 'id' })
    .select()
    .single();
  if (error) console.error('upsertProduct error:', error.message);
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('ecom_products')
    .delete()
    .eq('id', id);
  if (error) console.error('deleteProduct error:', error.message);
  return !error;
}

// --- Orders ---

export async function fetchOrders(siteId: string) {
  const { data, error } = await supabase
    .from('ecom_orders')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false });
  if (error) console.error('fetchOrders error:', error.message);
  return data || [];
}

// --- Store settings ---

export async function fetchStore(siteId: string) {
  const { data, error } = await supabase
    .from('ecom_stores')
    .select('id, site_id, store_name, currency, currency_symbol, tax_rate, shipping_fee, stripe_account_id, upi_vpa, welcome_email_subject, welcome_email_body, whatsapp_phone, whatsapp_enabled, whatsapp_welcome_msg, created_at, updated_at')
    .eq('site_id', siteId)
    .maybeSingle();
  if (error) console.error('fetchStore error:', error.message);
  return data;
}

export async function upsertStore(store: {
  site_id: string;
  store_name: string;
  currency?: string;
  currency_symbol?: string;
  tax_rate?: number;
  shipping_fee?: number;
  stripe_account_id?: string;
  upi_vpa?: string;
  welcome_email_subject?: string;
  welcome_email_body?: string;
  whatsapp_phone?: string;
  whatsapp_enabled?: boolean;
  whatsapp_welcome_msg?: string;
}) {
  // Credentials are deployment secrets. Do not persist browser-provided keys.
  const { razorpay_key_id: _ignoredKeyId, razorpay_key_secret: _ignoredKeySecret, ...safeStore } = store as typeof store & Record<string, unknown>;
  const { data, error } = await supabase
    .from('ecom_stores')
    .upsert(safeStore, { onConflict: 'site_id' })
    .select()
    .single();
  if (error) console.error('upsertStore error:', error.message);
  return data;
}

// --- Payout profiles ---

export async function fetchPayoutProfile(siteId: string) {
  const { data, error } = await supabase
    .from('vendor_payout_profiles')
    .select('*')
    .eq('site_id', siteId)
    .maybeSingle();
  if (error) console.error('fetchPayoutProfile error:', error.message);
  return data;
}

export async function upsertPayoutProfile(profile: {
  site_id: string;
  legal_name: string;
  business_type?: string;
  tax_id?: string;
  bank_account_number: string;
  bank_ifsc_code: string;
  bank_holder_name: string;
  verification_status?: string;
}) {
  const { data, error } = await supabase
    .from('vendor_payout_profiles')
    .upsert(profile, { onConflict: 'site_id' })
    .select()
    .single();
  if (error) console.error('upsertPayoutProfile error:', error.message);
  return data;
}

// --- Public storefront product fetch (for published sites) ---

export async function fetchPublicProducts(siteId: string) {
  const { data, error } = await supabase
    .from('ecom_products')
    .select('*')
    .eq('site_id', siteId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) console.error('fetchPublicProducts error:', error.message);
  return data || [];
}
