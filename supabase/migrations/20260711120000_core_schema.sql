-- OnlyPage core schema
-- Multi-tenant: auth.users -> profiles, sites -> pages -> blocks
-- Per-site data: leads (+ lead_events), bookings, forms
-- RLS model: owners manage their own rows; anonymous visitors may INSERT
-- leads/bookings against a PUBLISHED site (public lead capture), never read.

create extension if not exists "pgcrypto";

-- ============================================================
-- profiles: 1:1 with auth.users
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  business_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- sites: a business's one-page website (owner-scoped, unique subdomain)
-- ============================================================
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  business_name text not null,
  subdomain text not null unique,
  published boolean not null default false,
  theme jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sites_owner_id_idx on public.sites (owner_id);
create index sites_subdomain_idx on public.sites (subdomain);

-- ============================================================
-- pages: SEO-addressable pages within a site
-- ============================================================
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  name text not null,
  slug text not null,
  seo_title text,
  seo_desc text,
  seo_keywords text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug)
);
create index pages_site_id_idx on public.pages (site_id);

-- ============================================================
-- blocks: ordered visual sections on a page (config stored as jsonb)
-- mirrors WebBlock: type, title, styles, services[], reviews[], etc.
-- ============================================================
create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  type text not null,
  position int not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index blocks_page_id_idx on public.blocks (page_id);

-- ============================================================
-- forms: form definitions attached to a site (fields as jsonb)
-- ============================================================
create table public.forms (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  name text not null,
  fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index forms_site_id_idx on public.forms (site_id);

-- ============================================================
-- leads: captured CRM contacts (anonymous visitors may insert)
-- ============================================================
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  name text,
  email text,
  phone text,
  status text not null default 'New',
  amount numeric,
  source text,
  created_at timestamptz not null default now()
);
create index leads_site_id_idx on public.leads (site_id);

-- ============================================================
-- lead_events: activity timeline per lead
-- ============================================================
create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  event text not null,
  created_at timestamptz not null default now()
);
create index lead_events_lead_id_idx on public.lead_events (lead_id);

-- ============================================================
-- bookings: reserved slots (anonymous visitors may insert)
-- ============================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  name text not null,
  service text,
  staff text,
  slot_at timestamptz,
  status text not null default 'Confirmed',
  created_at timestamptz not null default now()
);
create index bookings_site_id_idx on public.bookings (site_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger sites_set_updated_at before update on public.sites
  for each row execute function public.set_updated_at();
create trigger pages_set_updated_at before update on public.pages
  for each row execute function public.set_updated_at();
create trigger blocks_set_updated_at before update on public.blocks
  for each row execute function public.set_updated_at();
create trigger forms_set_updated_at before update on public.forms
  for each row execute function public.set_updated_at();

-- ============================================================
-- auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ownership helper: does the current user own this site?
-- ============================================================
create or replace function public.owns_site(target_site_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.sites s
    where s.id = target_site_id and s.owner_id = auth.uid()
  );
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles   enable row level security;
alter table public.sites      enable row level security;
alter table public.pages      enable row level security;
alter table public.blocks     enable row level security;
alter table public.forms      enable row level security;
alter table public.leads      enable row level security;
alter table public.lead_events enable row level security;
alter table public.bookings   enable row level security;

-- profiles: self-only
create policy "profiles self read" on public.profiles
  for select using (id = auth.uid());
create policy "profiles self update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- sites: owner full control; anyone may read a PUBLISHED site
create policy "sites owner all" on public.sites
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "sites public read published" on public.sites
  for select using (published = true);

-- pages: owner full control; public read when parent site published
create policy "pages owner all" on public.pages
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "pages public read published" on public.pages
  for select using (exists (
    select 1 from public.sites s where s.id = site_id and s.published = true
  ));

-- blocks: owner full control; public read when the page's site is published
create policy "blocks owner all" on public.blocks
  for all using (exists (
    select 1 from public.pages p where p.id = page_id and public.owns_site(p.site_id)
  )) with check (exists (
    select 1 from public.pages p where p.id = page_id and public.owns_site(p.site_id)
  ));
create policy "blocks public read published" on public.blocks
  for select using (exists (
    select 1 from public.pages p
    join public.sites s on s.id = p.site_id
    where p.id = page_id and s.published = true
  ));

-- forms: owner full control; public read when site published
create policy "forms owner all" on public.forms
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "forms public read published" on public.forms
  for select using (exists (
    select 1 from public.sites s where s.id = site_id and s.published = true
  ));

-- leads: owner reads/manages; anonymous visitors may INSERT on a published site
create policy "leads owner read" on public.leads
  for select using (public.owns_site(site_id));
create policy "leads owner update" on public.leads
  for update using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "leads owner delete" on public.leads
  for delete using (public.owns_site(site_id));
create policy "leads public insert on published" on public.leads
  for insert with check (exists (
    select 1 from public.sites s where s.id = site_id and s.published = true
  ));

-- lead_events: owner reads/inserts via lead ownership
create policy "lead_events owner read" on public.lead_events
  for select using (exists (
    select 1 from public.leads l where l.id = lead_id and public.owns_site(l.site_id)
  ));
create policy "lead_events owner insert" on public.lead_events
  for insert with check (exists (
    select 1 from public.leads l where l.id = lead_id and public.owns_site(l.site_id)
  ));

-- bookings: owner reads/manages; anonymous visitors may INSERT on a published site
create policy "bookings owner read" on public.bookings
  for select using (public.owns_site(site_id));
create policy "bookings owner update" on public.bookings
  for update using (public.owns_site(site_id)) with check (public.owns_site(site_id));
create policy "bookings owner delete" on public.bookings
  for delete using (public.owns_site(site_id));
create policy "bookings public insert on published" on public.bookings
  for insert with check (exists (
    select 1 from public.sites s where s.id = site_id and s.published = true
  ));
