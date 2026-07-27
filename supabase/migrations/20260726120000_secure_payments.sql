-- Server-created orders only. Public clients must never be able to set paid status,
-- totals, or payment identifiers directly.
drop policy if exists "Public insert ecom_orders" on public.ecom_orders;

alter table public.ecom_orders
  add column if not exists gateway_order_id text unique,
  add column if not exists paid_at timestamptz;

create index if not exists ecom_orders_gateway_order_id_idx
  on public.ecom_orders (gateway_order_id);

-- The service-role payment API writes checkout orders; browser users retain owner-only
-- access through the existing policy and cannot forge a payment status.

-- Rotate legacy browser-stored Razorpay values out of the database. Add fresh
-- credentials to deployment environment variables after applying this migration.
update public.ecom_stores
set razorpay_key_id = null,
    razorpay_key_secret = null
where razorpay_key_id is not null
   or razorpay_key_secret is not null;
