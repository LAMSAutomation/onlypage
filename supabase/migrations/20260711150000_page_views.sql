-- Create page_views table to capture visitor traffic and local analytics
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  page_slug text not null,
  referrer text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.page_views enable row level security;

-- Allow anyone (public visitors) to insert page views
create policy "Allow public inserts on page_views" on public.page_views
  for insert with check (true);

-- Allow site owners to read their site page_views
create policy "Allow site owners to read page_views" on public.page_views
  for select using (public.owns_site(site_id));

-- Add indices for query optimization
create index if not exists page_views_site_id_idx on public.page_views (site_id);
create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_page_slug_idx on public.page_views (page_slug);
