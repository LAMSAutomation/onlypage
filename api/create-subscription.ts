/**
 * OnlyPage Subscription API
 *
 * Creates a Razorpay subscription order when a user upgrades to Starter or Business.
 * POST /api/create-subscription
 *
 * Body: { plan_id: 'starter' | 'business', billing: 'monthly' | 'annual' }
 *
 * Flow:
 *   1. Validate the user is authenticated
 *   2. Look up the plan's price
 *   3. Create a Razorpay order (or subscription) via server API
 *   4. Return the Razorpay order ID so the frontend can open the checkout
 *   5. Webhook at /api/ecom/webhook handles payment.success → updates user_subscriptions
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Service role for admin DB updates
);

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authenticate via Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // 2. Validate body
  const { plan_id, billing = 'monthly' } = req.body || {};
  if (!plan_id || !['starter', 'business'].includes(plan_id)) {
    return res.status(400).json({ error: 'Invalid plan_id. Must be "starter" or "business".' });
  }
  if (!['monthly', 'annual'].includes(billing)) {
    return res.status(400).json({ error: 'Invalid billing. Must be "monthly" or "annual".' });
  }

  // 3. Get plan price
  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('id', plan_id)
    .single();

  if (!plan) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const amount = billing === 'annual' ? plan.price_annual : plan.price_monthly;
  const amountInPaise = Math.round(amount * 100); // Razorpay uses paise

  // 4. Create Razorpay order
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    // DEV MODE: Skip actual Razorpay call, just update DB directly
    const { error: upsertError } = await supabase
      .from('user_subscriptions')
      .upsert(
        {
          user_id: user.id,
          plan_id,
          status: 'active',
          current_period_start: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
    if (upsertError) {
      return res.status(500).json({ error: 'Failed to update subscription' });
    }
    return res.status(200).json({
      success: true,
      plan_id,
      message: 'DEV MODE: Subscription activated without payment',
      dev_mode: true,
    });
  }

  try {
    // Create a Razorpay order (not subscription — simpler for MVP)
    const basicAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `sub_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          user_id: user.id,
          plan_id,
          billing,
        },
      }),
    });

    const order = await razorpayRes.json();

    if (!razorpayRes.ok || !order.id) {
      console.error('Razorpay order creation failed', order);
      return res.status(502).json({ error: 'Payment gateway error. Please try again.' });
    }

    // Store the Razorpay order ID on the subscription
    await supabase
      .from('user_subscriptions')
      .upsert(
        {
          user_id: user.id,
          plan_id,
          status: 'trialing',
          razorpay_order_id: order.id,
          current_period_start: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: RAZORPAY_KEY_ID,
      plan_id,
    });
  } catch (err: any) {
    console.error('Razorpay API error', err);
    return res.status(502).json({ error: 'Payment gateway error' });
  }
}
