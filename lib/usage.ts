/**
 * OnlyPage usage tracking — real data for the billing usage bars.
 *
 * Each function returns { label, used, limit, display } for the progress bars.
 */

import { supabase } from './supabase';

export interface UsageMetric {
  label: string;
  used: number;
  limit: number;
  display: string;
}

// ---------------------------------------------------------------------------
// Site-level usage queries
// ---------------------------------------------------------------------------

/** Number of published + draft pages for a site */
export async function getPageUsage(siteId: string): Promise<UsageMetric> {
  const { count, error } = await supabase
    .from('pages')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', siteId);
  const used = error ? 0 : (count ?? 0);
  return {
    label: 'Pages',
    used,
    limit: 10,
    display: `${used} / 10 pages`,
  };
}

/** Number of leads captured for a site */
export async function getLeadUsage(siteId: string): Promise<UsageMetric> {
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', siteId);
  const used = error ? 0 : (count ?? 0);
  return {
    label: 'Leads Captured',
    used,
    limit: 1000,
    display: `${used} / 1,000 leads`,
  };
}

/** Number of bookings for a site */
export async function getBookingUsage(siteId: string): Promise<UsageMetric> {
  const { count, error } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', siteId);
  const used = error ? 0 : (count ?? 0);
  return {
    label: 'Bookings',
    used,
    limit: 100,
    display: `${used} / 100 bookings`,
  };
}

/** Storage used — estimate from theme JSON size + lead data */
export async function getStorageUsage(siteId: string): Promise<UsageMetric> {
  // Rough estimate: theme JSON + pages + leads
  const { data: siteData } = await supabase
    .from('sites')
    .select('theme')
    .eq('id', siteId)
    .single();

  const themeSize = siteData?.theme ? new Blob([JSON.stringify(siteData.theme)]).size : 0;

  const { count: leadCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', siteId);

  // Estimate ~500 bytes per lead
  const estimatedMb = Math.round((themeSize + (leadCount ?? 0) * 500) / (1024 * 1024));
  const displayMb = Math.max(estimatedMb, 1); // always show at least 1MB

  return {
    label: 'Storage',
    used: displayMb,
    limit: 500,
    display: `${displayMb}MB / 500MB`,
  };
}

// ---------------------------------------------------------------------------
// Combined loader
// ---------------------------------------------------------------------------

export interface SiteUsage {
  pages: UsageMetric;
  leads: UsageMetric;
  bookings: UsageMetric;
  storage: UsageMetric;
}

/** Load all usage metrics for a site in parallel */
export async function getSiteUsage(siteId: string): Promise<SiteUsage> {
  const [pages, leads, bookings, storage] = await Promise.all([
    getPageUsage(siteId),
    getLeadUsage(siteId),
    getBookingUsage(siteId),
    getStorageUsage(siteId),
  ]);
  return { pages, leads, bookings, storage };
}
