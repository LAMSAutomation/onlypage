-- Safe subdomain availability check.
-- Returns only a boolean so callers can validate uniqueness during onboarding
-- without being able to read other users' unpublished site rows (which RLS hides).
-- SECURITY DEFINER lets it see all rows; it never returns row data.

create or replace function public.subdomain_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.sites s
    where lower(s.subdomain) = lower(candidate)
  );
$$;

grant execute on function public.subdomain_available(text) to anon, authenticated;
