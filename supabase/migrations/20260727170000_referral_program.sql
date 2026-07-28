-- OnlyPage Referral Program
-- Tracks referrals: who invited whom, rewards status

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_email text,
  referred_id uuid references auth.users (id) on delete set null,
  referral_code text not null unique,
  status text not null default 'pending' check (status in ('pending', 'signed_up', 'converted', 'rewarded', 'expired')),
  reward_months int not null default 1,
  reward_given boolean not null default false,
  reward_claimed_at timestamptz,
  created_at timestamptz not null default now(),
  converted_at timestamptz
);

create index referrals_referrer_idx on public.referrals (referrer_id);
create index referrals_code_idx on public.referrals (referral_code);

alter table public.referrals enable row level security;

create policy "referrals self read" on public.referrals
  for select using (referrer_id = auth.uid());

create policy "referrals self insert" on public.referrals
  for insert with check (referrer_id = auth.uid());

-- Helper: generate a unique referral code
create or replace function public.generate_referral_code()
returns text
language sql
stable
as $$
  select upper(substring(md5(random()::text) from 1 for 8));
$$;

-- Auto-create referral for new user if they came via a referral code
create or replace function public.handle_referral_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  -- Check if user metadata has a referral_code
  v_code := new.raw_user_meta_data ->> 'referral_code';
  if v_code is not null then
    update public.referrals
    set status = 'signed_up',
        referred_id = new.id,
        converted_at = now()
    where referral_code = v_code
      and referred_email = new.email
      and status = 'pending';
  end if;
  return new;
end;
$$;

create trigger on_auth_user_referral
  after insert on auth.users
  for each row execute function public.handle_referral_signup();
