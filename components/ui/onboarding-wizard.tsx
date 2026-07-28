import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, ArrowRight, ArrowLeft, Check, Loader2, Globe, Store,
  Scissors, Palette, GraduationCap, Building2, AlertCircle, CheckCircle2, FileText,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getLegalPagesForBusiness, dashboardModeToCategory } from '@/lib/legal-templates';
import type { DashboardMode } from '@/components/app-shell';

export interface SiteRecord {
  id: string;
  owner_id: string;
  business_name: string;
  subdomain: string;
  published: boolean;
  theme: Record<string, any>;
  created_at?: string;
}

interface OnboardingWizardProps {
  onComplete: (site: SiteRecord) => void;
}

type ProjectType = { id: DashboardMode; label: string; desc: string; icon: React.ComponentType<any>; pages: string[] };

const PROJECT_TYPES: ProjectType[] = [
  { id: 'store', label: 'E-Commerce Store', desc: 'Online shop, product catalog & instant checkout', icon: Store, pages: ['Home', 'Shop', 'Cart', 'Policies'] },
  { id: 'business', label: 'Business / Service', desc: 'Agencies, consultants, local services', icon: Building2, pages: ['Home', 'About', 'Services', 'Contact'] },
  { id: 'salon', label: 'Salon / Wellness', desc: 'Salons, spas, clinics, studios', icon: Scissors, pages: ['Home', 'Services', 'Bookings', 'Contact'] },
  { id: 'creator', label: 'Creator / Portfolio', desc: 'Artists, freelancers, personal brands', icon: Palette, pages: ['Home', 'Work', 'About', 'Contact'] },
  { id: 'student', label: 'Student / Simple', desc: 'Resume, project, or a single landing page', icon: GraduationCap, pages: ['Home', 'About'] },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>(PROJECT_TYPES[0]);
  const [selectedPages, setSelectedPages] = useState<string[]>(PROJECT_TYPES[0].pages);
  const [subdomain, setSubdomain] = useState('');
  const [subEdited, setSubEdited] = useState(false);
  const [includeLegal, setIncludeLegal] = useState(true);

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-suggest a subdomain from the business name until the user edits it.
  useEffect(() => {
    if (!subEdited) setSubdomain(slugify(businessName));
  }, [businessName, subEdited]);

  // Debounced availability check against the safe RPC.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setAvailable(null);
    if (!subdomain || subdomain.length < 3) return;
    setChecking(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const { data, error: rpcError } = await supabase.rpc('subdomain_available', { candidate: subdomain });
      setChecking(false);
      if (rpcError) { setAvailable(null); return; }
      setAvailable(data === true);
    }, 450);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [subdomain]);

  const pickType = (t: ProjectType) => {
    setProjectType(t);
    setSelectedPages(t.pages);
  };

  const togglePage = (name: string) => {
    setSelectedPages((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const canNext =
    (step === 1 && businessName.trim().length >= 2) ||
    (step === 2 && selectedPages.length >= 1) ||
    (step === 3 && subdomain.length >= 3 && available === true);

  const handleFinish = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error('Your session expired. Please sign in again.');

      // Persist business details on the profile.
      await supabase
        .from('profiles')
        .update({ business_name: businessName, full_name: user.user_metadata?.full_name ?? null })
        .eq('id', user.id);

      // Create the site (subdomain is unique; a race would surface as an error here).
      const { data: site, error: siteError } = await supabase
        .from('sites')
        .insert({
          owner_id: user.id,
          business_name: businessName,
          subdomain,
          theme: { mode: projectType.id, phone },
        })
        .select()
        .single();
      if (siteError) {
        if (siteError.code === '23505') throw new Error('That subdomain was just taken. Try another.');
        throw siteError;
      }

      // Seed the chosen starter pages.
      const allPages = [...selectedPages];
      if (includeLegal) {
        const category = dashboardModeToCategory(projectType.id);
        const legalPages = getLegalPagesForBusiness(businessName, category);
        for (const lp of legalPages) {
          // Only add if not already selected
          if (!allPages.some(p => p.toLowerCase() === lp.slug.toLowerCase())) {
            allPages.push(lp.title);
          }
        }
      }
      if (allPages.length) {
        const rows = allPages.map((name, i) => ({
          site_id: site.id,
          name,
          slug: i === 0 ? 'home' : slugify(name),
          position: i,
        }));
        await supabase.from('pages').insert(rows);
      }

      // Also store the legal content as page blocks in the theme
      if (includeLegal) {
        const category = dashboardModeToCategory(projectType.id);
        const legalPages = getLegalPagesForBusiness(businessName, category);
        const legalContent: Record<string, string> = {};
        for (const lp of legalPages) {
          legalContent[lp.slug] = lp.content;
        }
        // Store legal content in site theme so CMS can display them
        await supabase
          .from('sites')
          .update({ theme: { ...site.theme, legalPages: legalContent } })
          .eq('id', site.id);
      }

      onComplete(site as SiteRecord);
    } catch (err: any) {
      setError(err?.message ?? 'Could not finish setup. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Progress header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step > s ? 'bg-emerald-500 text-white' : step === s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/50 p-8 sm:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto"><Sparkles size={22} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">Welcome! Let's set up your page</h2>
                  <p className="text-sm text-slate-500 font-medium">Tell us about your business and what you're building.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Business / Display name</label>
                    <input autoFocus value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Bloom Studio"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-semibold text-slate-800" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone (optional)</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-semibold text-slate-800" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-2 block">What kind of project?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PROJECT_TYPES.map((t) => {
                        const Icon = t.icon;
                        const active = projectType.id === t.id;
                        return (
                          <button key={t.id} type="button" onClick={() => pickType(t)}
                            className={`text-left p-3.5 rounded-xl border transition-all flex gap-3 items-start cursor-pointer ${
                              active ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
                            }`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800">{t.label}</p>
                              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{t.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto"><Store size={22} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">Pick your starter pages</h2>
                  <p className="text-sm text-slate-500 font-medium">We'll create these for you. You can add or remove pages anytime.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Array.from(new Set([...projectType.pages, 'Home', 'About', 'Services', 'Work', 'Bookings', 'Gallery', 'Pricing', 'Contact', 'Blog'])).map((name) => {
                    const active = selectedPages.includes(name);
                    const isHome = name === 'Home';
                    return (
                      <button key={name} type="button" disabled={isHome} onClick={() => togglePage(name)}
                        className={`p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-between gap-2 ${
                          active ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        } ${isHome ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <span>{name}</span>
                        {active && <Check size={14} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 font-semibold text-center">{selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected · Home is always included</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto"><Globe size={22} /></div>
                  <h2 className="text-2xl font-bold text-slate-900">Claim your address</h2>
                  <p className="text-sm text-slate-500 font-medium">This is where your page will live.</p>
                </div>

                {/* Legal pages toggle */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLegal}
                        onChange={(e) => setIncludeLegal(e.target.checked)}
                        className="accent-indigo-600 rounded"
                      />
                      <span className="text-xs font-extrabold text-slate-800">Auto-add legal pages</span>
                    </label>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">
                      We'll create ready-to-use Terms &amp; Conditions and Privacy Policy pages. 
                      {projectType.id === 'store' && ' For ecommerce, we also add Shipping and Refund policies (required by Indian law).'}
                      {projectType.id === 'salon' || projectType.id === 'business' ? ' We also add a Cancellation/Refund policy.' : ''}
                      You can edit them anytime.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-stretch rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 overflow-hidden">
                    <input autoFocus value={subdomain}
                      onChange={(e) => { setSubEdited(true); setSubdomain(slugify(e.target.value)); }}
                      placeholder="yourname"
                      className="flex-1 h-12 px-4 outline-none text-sm font-bold text-slate-800 min-w-0" />
                    <span className="flex items-center px-4 bg-slate-50 border-l border-slate-200 text-sm font-bold text-slate-500 shrink-0">.onlypage.in</span>
                  </div>
                  <div className="h-6 mt-2 flex items-center gap-1.5 text-xs font-semibold">
                    {checking && <span className="text-slate-400 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Checking availability…</span>}
                    {!checking && available === true && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={13} /> {subdomain}.onlypage.in is available</span>}
                    {!checking && available === false && <span className="text-rose-600 flex items-center gap-1"><AlertCircle size={13} /> That subdomain is taken</span>}
                    {!checking && subdomain.length > 0 && subdomain.length < 3 && <span className="text-slate-400">At least 3 characters</span>}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-1.5 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Summary</p>
                  <p className="text-sm text-slate-700 font-semibold">{businessName} · {projectType.label}</p>
                  <p className="text-xs text-slate-500 font-medium">{selectedPages.length} pages · {subdomain || '—'}.onlypage.in</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" /><span>{error}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8">
            <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1 || submitting}
              className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 cursor-pointer'
              }`}>
              <ArrowLeft size={15} /> Back
            </button>

            {step < 3 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer">
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button type="button" onClick={handleFinish} disabled={!canNext || submitting}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer">
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Creating…</> : <>Launch dashboard <ArrowRight size={15} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
