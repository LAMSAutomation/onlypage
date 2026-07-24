-- OnlyPage E-Commerce Module Migration v2
-- Multi-tenant schema for store configuration, product catalog with tags/categories, orders, welcome emails & WhatsApp automations

-- 1. ecom_stores: Store settings, payment gateway routing, welcome email templates, and WhatsApp automations
CREATE TABLE IF NOT EXISTS public.ecom_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  currency_symbol TEXT NOT NULL DEFAULT '₹',
  tax_rate NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  razorpay_key_id TEXT,
  razorpay_key_secret TEXT,
  stripe_account_id TEXT,
  upi_vpa TEXT,
  -- Storefront Automations & Branded Communication
  welcome_email_subject TEXT NOT NULL DEFAULT 'Welcome to {{store_name}}! 🎉 Here is your 10% discount code',
  welcome_email_body TEXT NOT NULL DEFAULT 'Hi {{customer_name}},\n\nThank you for signing up with {{store_name}}! We are thrilled to have you with us.\n\nUse coupon code WELCOME10 at checkout to get 10% off your first order.\n\nHappy shopping!\n{{store_name}} Team',
  whatsapp_phone TEXT,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT true,
  whatsapp_welcome_msg TEXT NOT NULL DEFAULT 'Hi {{customer_name}}! 👋 Welcome to {{store_name}}. Thank you for registering on our store. Let us know if you have any questions!',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id)
);
CREATE INDEX IF NOT EXISTS ecom_stores_site_id_idx ON public.ecom_stores(site_id);

-- 2. ecom_products: Product catalog per site with category, tags, offer badges, and SEO alt parameters
CREATE TABLE IF NOT EXISTS public.ecom_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  compare_at_price NUMERIC(10, 2),
  images JSONB DEFAULT '[]'::jsonb, -- Array of { url: string, alt: string }
  stock INT NOT NULL DEFAULT 10,
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}', -- e.g. ['Featured', 'OnSale', 'BestSeller']
  offer_badge TEXT, -- e.g. '20% OFF' or 'Special Offer'
  status TEXT NOT NULL DEFAULT 'active', -- active, draft
  seo_title TEXT,
  seo_desc TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ecom_products_site_id_idx ON public.ecom_products(site_id);

-- 3. ecom_orders: Customer orders tracking
CREATE TABLE IF NOT EXISTS public.ecom_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed
  order_status TEXT NOT NULL DEFAULT 'processing', -- processing, shipped, delivered, cancelled
  payment_gateway TEXT NOT NULL DEFAULT 'razorpay', -- razorpay, stripe, upi
  payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ecom_orders_site_id_idx ON public.ecom_orders(site_id);

-- 4. vendor_payout_profiles: Bank details & KYC verification
CREATE TABLE IF NOT EXISTS public.vendor_payout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  legal_name TEXT NOT NULL,
  business_type TEXT NOT NULL DEFAULT 'individual',
  tax_id TEXT, -- GST, PAN, or Tax Registration
  bank_account_number TEXT NOT NULL,
  bank_ifsc_code TEXT NOT NULL,
  bank_holder_name TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, rejected
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id)
);
CREATE INDEX IF NOT EXISTS vendor_payout_profiles_site_id_idx ON public.vendor_payout_profiles(site_id);

-- Enable RLS
ALTER TABLE public.ecom_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecom_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payout_profiles ENABLE ROW LEVEL SECURITY;

-- Owner access policies (Store owners manage their own rows)
CREATE POLICY "Owners manage ecom_stores" ON public.ecom_stores
  FOR ALL USING (site_id IN (SELECT id FROM public.sites WHERE owner_id = auth.uid()));

CREATE POLICY "Owners manage ecom_products" ON public.ecom_products
  FOR ALL USING (site_id IN (SELECT id FROM public.sites WHERE owner_id = auth.uid()));

CREATE POLICY "Owners manage ecom_orders" ON public.ecom_orders
  FOR ALL USING (site_id IN (SELECT id FROM public.sites WHERE owner_id = auth.uid()));

CREATE POLICY "Owners manage vendor_payout_profiles" ON public.vendor_payout_profiles
  FOR ALL USING (site_id IN (SELECT id FROM public.sites WHERE owner_id = auth.uid()));

-- Public read access for published products (storefront visitors)
CREATE POLICY "Public view active products" ON public.ecom_products
  FOR SELECT USING (
    status = 'active' AND 
    site_id IN (SELECT id FROM public.sites WHERE published = true)
  );

-- Public insert policy for order creation on checkout
CREATE POLICY "Public insert ecom_orders" ON public.ecom_orders
  FOR INSERT WITH CHECK (
    site_id IN (SELECT id FROM public.sites WHERE published = true)
  );
