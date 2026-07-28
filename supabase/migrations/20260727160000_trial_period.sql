-- OnlyPage 7-day free trial on signup
-- Updates the existing handle_new_subscription trigger to set trial period

create or replace function public.handle_new_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_subscriptions (
    user_id,
    plan_id,
    status,
    current_period_start,
    current_period_end,
    trial_end
  )
  values (
    new.id,
    'free',
    'trialing',
    now(),
    now() + interval '7 days',
    now() + interval '7 days'
  );
  return new;
end;
$$;

-- ============================================================
-- Helper: returns trial days remaining for a user (0 if expired/not trialing)
-- ============================================================
create or replace function public.get_trial_days_remaining(target_user_id uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select
    case
      when status = 'trialing' and trial_end is not null
        then greatest(0, extract(day from trial_end - now())::int)
      else 0
    end
  from public.user_subscriptions
  where user_id = target_user_id;
$$;
