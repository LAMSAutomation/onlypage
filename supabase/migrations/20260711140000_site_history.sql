-- Create site_history table to store list of changes and visual builder revisions
create table if not exists public.site_history (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  page_id uuid references public.pages (id) on delete cascade,
  blocks jsonb not null default '[]'::jsonb,
  header jsonb,
  footer jsonb,
  seo_title text,
  seo_desc text,
  created_at timestamptz not null default now()
);

-- Enable RLS and add ownership policy
alter table public.site_history enable row level security;

create policy "site_history owner all" on public.site_history
  for all using (public.owns_site(site_id)) with check (public.owns_site(site_id));

-- Add index for query optimization
create index if not exists site_history_site_id_idx on public.site_history (site_id);
create index if not exists site_history_created_at_idx on public.site_history (created_at desc);
