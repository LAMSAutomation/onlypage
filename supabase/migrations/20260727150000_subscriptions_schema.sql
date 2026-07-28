-- OnlyPage subscriptions & plan gating schema
-- Plans are seeded; user_subscriptions tracks each user's current plan.
-- Feature flags are checked at the application layer via the lib/subscriptions.ts helper.

-- ============================================================
-- plans: seed data for Free / Starter / Business
-- ============================================================
create table public.plans (
  id text primary key,                              -- 'free', 'starter', 'business'
  name text not null,
  price_monthly numeric not null,
  price_annual numeric not null,
  max_pages int not null default 1,
  max_leads int not null default 10,
  max_products int not null default 0,
  max_team_members int not null default 1,
  has_custom_domain boolean not null default false,
  has_whatsapp boolean not null default false,
  has_booking boolean not null default false,
  has_payments boolean not null default false,
  has_crm boolean not null default false,
  has_ai_writer boolean not null default false,
  has_ecommerce boolean not null default false,
  has_full_analytics boolean not null default false,
  branding_removed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Seed the three plans
insert into public.plans (id, name, price_monthly, price_annual, max_pages, max_leads, max_products, max_team_members, has_custom_domain, has_whatsapp, has_booking, has_payments, has_crm, has_ai_writer, has_ecommerce, has_full_analytics, branding_removed) values
  ('free',     'Free',     0,   0,   1,   10,    0, 1, false, false, false, false, false, false, false, false, false),
  ('starter',  'Starter',  399, 299, 999, 1000,  0, 1, true,  true,  true,  false, true,  true,  false, true,  true),
  ('business', 'Business', 799, 599, 999, 999999, 10, 3, true,  true,  true,  true,  true,  true,  true,  true,  true);

-- ============================================================
-- user_subscriptions: 1:1 with auth.users, tracks current plan
-- ============================================================
create table public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null references public.plans (id) default 'free',
  status text not null default 'active' check (status in ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz,
  trial_end timestamptz,
  razorpay_subscription_id text,
  razorpay_order_id text,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);
create index user_subscriptions_user_id_idx on public.user_subscriptions (user_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
create trigger user_subscriptions_set_updated_at before update on public.user_subscriptions
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS: users manage their own subscription row; plans are public-read
-- ============================================================
alter table public.plans               enable row level security;
alter table public.user_subscriptions  enable row level security;

create policy "plans public read" on public.plans
  for select using (true);

create policy "user_subscriptions self read" on public.user_subscriptions
  for select using (user_id = auth.uid());

create policy "user_subscriptions self update" on public.user_subscriptions
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user_subscriptions self insert" on public.user_subscriptions
  for insert with check (user_id = auth.uid());

-- ============================================================
-- Auto-create a free subscription on user signup
-- ============================================================
create or replace function public.handle_new_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_subscriptions (user_id, plan_id, status, current_period_start)
  values (new.id, 'free', 'active', now());
  return new;
end;
$$;

create trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row execute function public.handle_new_subscription();

-- ============================================================
-- Helper: returns plan_id for a user (fast, no joins needed)
-- ============================================================
create or replace function public.get_user_plan(target_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select plan_id from public.user_subscriptions where user_id = target_user_id),
    'free'
  );
$$;
