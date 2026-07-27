-- Phase 3: auditable, tenant-isolated WhatsApp follow-up delivery records.
-- All writes are performed by the server using the service role; browser users
-- may only read delivery history for sites they own.

create table public.whatsapp_deliveries (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  booking_id uuid references public.bookings (id) on delete set null,
  phone text not null,
  message text not null check (char_length(message) between 1 and 4096),
  locale text not null default 'English',
  trigger text not null default 'manual_follow_up',
  status text not null default 'draft' check (status in ('draft', 'queued', 'sending', 'sent', 'failed', 'needs_configuration')),
  provider_message_id text,
  provider_response jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index whatsapp_deliveries_site_created_idx
  on public.whatsapp_deliveries (site_id, created_at desc);
create index whatsapp_deliveries_lead_created_idx
  on public.whatsapp_deliveries (lead_id, created_at desc);
create unique index whatsapp_deliveries_one_new_lead_follow_up_idx
  on public.whatsapp_deliveries (lead_id, trigger)
  where trigger = 'new_lead_follow_up';

alter table public.whatsapp_deliveries enable row level security;

create policy "whatsapp deliveries owner read" on public.whatsapp_deliveries
  for select using (public.owns_site(site_id));
