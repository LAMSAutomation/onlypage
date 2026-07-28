/**
 * OnlyPage subscription & gating helpers
 *
 * These functions check a user's plan_id against the plans table
 * to decide whether a feature is available or a limit is exceeded.
 */

import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlanRow {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  max_pages: number;
  max_leads: number;
  max_products: number;
  max_team_members: number;
  has_custom_domain: boolean;
  has_whatsapp: boolean;
  has_booking: boolean;
  has_payments: boolean;
  has_crm: boolean;
  has_ai_writer: boolean;
  has_ecommerce: boolean;
  has_full_analytics: boolean;
  branding_removed: boolean;
}

export interface UserSubscriptionRow {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string | null;
  trial_end: string | null;
  razorpay_subscription_id: string | null;
  cancelled_at: string | null;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

/** Get the full plan row for a plan_id. Results are cached per session. */
const planCache = new Map<string, PlanRow>();

export async function getPlan(planId: string): Promise<PlanRow | null> {
  if (planCache.has(planId)) return planCache.get(planId)!;
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planId)
    .single();
  if (error || !data) return null;
  planCache.set(planId, data as PlanRow);
  return data as PlanRow;
}

/** Fetch the current subscription for the given user (or the logged-in user). */
export async function getUserSubscription(userId?: string): Promise<UserSubscriptionRow | null> {
  const uid = userId || (await supabase.auth.getUser()).data.user?.id;
  if (!uid) return null;

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', uid)
    .maybeSingle();
  if (error || !data) return null;
  return data as UserSubscriptionRow;
}

/** Convenience: get the plan_id for the current user. */
export async function getUserPlanId(): Promise<string> {
  const sub = await getUserSubscription();
  return sub?.plan_id ?? 'free';
}

/** Convenience: get the full PlanRow for the current user. */
export async function getUserPlan(): Promise<PlanRow | null> {
  const planId = await getUserPlanId();
  return getPlan(planId);
}

// ---------------------------------------------------------------------------
// Boolean feature checks
// ---------------------------------------------------------------------------

export type FeatureFlag =
  | 'custom_domain'
  | 'whatsapp'
  | 'booking'
  | 'payments'
  | 'crm'
  | 'ai_writer'
  | 'ecommerce'
  | 'full_analytics'
  | 'branding_removed';

const FEATURE_MAP: Record<FeatureFlag, keyof PlanRow> = {
  custom_domain: 'has_custom_domain',
  whatsapp: 'has_whatsapp',
  booking: 'has_booking',
  payments: 'has_payments',
  crm: 'has_crm',
  ai_writer: 'has_ai_writer',
  ecommerce: 'has_ecommerce',
  full_analytics: 'has_full_analytics',
  branding_removed: 'branding_removed',
};

/** Check if the current user's plan includes a specific boolean feature. */
export async function hasFeature(feature: FeatureFlag): Promise<boolean> {
  const plan = await getUserPlan();
  if (!plan) return false;
  const col = FEATURE_MAP[feature];
  return plan[col] === true;
}

// ---------------------------------------------------------------------------
// Numeric limit checks
// ---------------------------------------------------------------------------

export type NumericLimit = 'max_pages' | 'max_leads' | 'max_products' | 'max_team_members';

const LIMIT_MAP: Record<NumericLimit, keyof PlanRow> = {
  max_pages: 'max_pages',
  max_leads: 'max_leads',
  max_products: 'max_products',
  max_team_members: 'max_team_members',
};

/** Get the numeric limit for a given resource on the current user's plan. */
export async function getLimit(limit: NumericLimit): Promise<number> {
  const plan = await getUserPlan();
  if (!plan) return 0;
  return (plan[LIMIT_MAP[limit]] as number) ?? 0;
}

/** Check if the user can perform an action given current usage. Returns { allowed, limit, upgrade }. */
export async function checkLimit(
  limit: NumericLimit,
  currentUsage: number,
): Promise<{ allowed: boolean; limit: number; upgrade: boolean }> {
  const max = await getLimit(limit);
  return {
    allowed: currentUsage < max,
    limit: max,
    upgrade: max <= currentUsage,
  };
}

// ---------------------------------------------------------------------------
// Trial period helpers
// ---------------------------------------------------------------------------

export interface TrialInfo {
  isTrialing: boolean;
  daysRemaining: number;
  trialEnd: string | null;
  isExpired: boolean;
}

/** Get trial status for the current user. */
export async function getTrialInfo(userId?: string): Promise<TrialInfo> {
  const sub = await getUserSubscription(userId);
  if (!sub) return { isTrialing: false, daysRemaining: 0, trialEnd: null, isExpired: false };

  const isTrialing = sub.status === 'trialing';
  let daysRemaining = 0;
  let isExpired = false;

  if (isTrialing && sub.trial_end) {
    const end = new Date(sub.trial_end);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    isExpired = daysRemaining <= 0;
  }

  return { isTrialing, daysRemaining, trialEnd: sub.trial_end, isExpired };
}

/** Get the invoice amount string based on plan */
export function getPlanInvoiceAmount(planId: string): string {
  switch (planId) {
    case 'free': return '₹0';
    case 'starter': return '₹399';
    case 'business': return '₹799';
    default: return '₹0';
  }
}

// ---------------------------------------------------------------------------
// Upgrade URL helper
// ---------------------------------------------------------------------------

/** Returns the plan name a user should upgrade to for a given feature. */
export function suggestedPlan(feature: FeatureFlag): string {
  if (feature === 'ecommerce' || feature === 'payments') return 'Business';
  return 'Starter';
}

/** Returns a Razorpay order / payment link for the suggested plan. */
export function getUpgradeUrl(planId: string, billing: 'monthly' | 'annual' = 'monthly'): string {
  const base = '/#pricing';
  const planParam = planId === 'business' ? 'business' : 'starter';
  return `${base}?plan=${planParam}&billing=${billing}`;
}
