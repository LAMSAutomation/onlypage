import React, { useMemo, useState } from 'react';
import {
  ArrowRight, CalendarCheck, Check, CheckCircle2, Globe2, Languages,
  MessageCircle, ReceiptIndianRupee, Save, Sparkles, UsersRound, Wand2, Gift, Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteRecord } from '@/components/ui/onboarding-wizard';
import { createLaunchPages, type LaunchKitConfig } from '@/lib/launch-generator';

type LaunchKit = LaunchKitConfig;

const TOOL_OPTIONS = [
  { id: 'leads', label: 'Lead inbox', detail: 'Capture enquiries in one place', icon: UsersRound, tab: 'crm' },
  { id: 'whatsapp', label: 'WhatsApp follow-up', detail: 'Prepare reply and follow-up workflows', icon: MessageCircle, tab: 'whatsapp' },
  { id: 'bookings', label: 'Bookings', detail: 'Let customers request an appointment', icon: CalendarCheck, tab: 'bookings' },
  { id: 'payments', label: 'UPI & payments', detail: 'Set up products and payment details', icon: ReceiptIndianRupee, tab: 'store' },
  { id: 'offers', label: 'Offers', detail: 'Prepare a time-bound campaign and offer page', icon: Gift, tab: 'marketing' },
  { id: 'reviews', label: 'Reviews', detail: 'Set up a proof section and review workflow', icon: Star, tab: 'reviews' },
];

const DEFAULT_KIT: LaunchKit = {
  businessType: 'local-service',
  locale: 'English',
  goal: 'Get more enquiries',
  services: [],
  style: 'Modern',
  tools: ['leads', 'whatsapp'],
};

interface LaunchModeProps {
  site: SiteRecord;
  onOpenStudio: () => void;
  onNavigate: (tab: string) => void;
  onUpdateSite?: (site: SiteRecord) => void;
}

export function LaunchMode({ site, onOpenStudio, onNavigate, onUpdateSite }: LaunchModeProps) {
  const savedKit = site.theme?.launchKit as Partial<LaunchKit> | undefined;
  const [kit, setKit] = useState<LaunchKit>({ ...DEFAULT_KIT, ...savedKit, tools: savedKit?.tools ?? DEFAULT_KIT.tools });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);

  const completion = useMemo(() => {
    const completed = [Boolean(site.business_name), Boolean(site.subdomain), Boolean(kit.businessType), Boolean(kit.goal), kit.tools.length > 0, Boolean(kit.locale), Boolean(kit.style)].filter(Boolean).length;
    return Math.round((completed / 7) * 100);
  }, [kit, site.business_name, site.subdomain]);

  const toggleTool = (id: string) => {
    setSaved(false);
    setKit((current) => ({
      ...current,
      tools: current.tools.includes(id) ? current.tools.filter((tool) => tool !== id) : [...current.tools, id],
    }));
  };

  const saveLaunchKit = async () => {
    setSaving(true);
    setSaved(false);
    const theme = { ...site.theme, launchKit: kit };
    try {
      const { data, error } = await supabase.from('sites').update({ theme }).eq('id', site.id).select().single();
      if (error) throw error;
      onUpdateSite?.((data ?? { ...site, theme }) as SiteRecord);
      setSaved(true);
    } catch (error) {
      console.error('Unable to save launch setup', error);
    } finally {
      setSaving(false);
    }
  };

  const updateKit = (patch: Partial<LaunchKit>) => {
    setKit((current) => ({ ...current, ...patch }));
    setSaved(false);
    setGenerationMessage(null);
  };

  const generateStarterSite = async () => {
    setGenerating(true);
    setGenerationMessage(null);
    try {
      const seeds = createLaunchPages(site.business_name, kit);
      const { data: existingPages, error: pageReadError } = await supabase.from('pages').select('id, name, slug').eq('site_id', site.id);
      if (pageReadError) throw pageReadError;

      const existingPageIds = (existingPages || []).map((page) => page.id);
      if (existingPageIds.length) {
        const { count, error: blockCheckError } = await supabase.from('blocks').select('id', { count: 'exact', head: true }).in('page_id', existingPageIds);
        if (blockCheckError) throw blockCheckError;
        if ((count || 0) > 0) {
          throw new Error('Your site already has content. Open Studio Mode to safely refine it instead of replacing it.');
        }
      }

      const pageBySlug = new Map((existingPages || []).map((page) => [page.slug, page]));
      for (let position = 0; position < seeds.length; position += 1) {
        const seed = seeds[position];
        let page = pageBySlug.get(seed.slug);
        if (!page) {
          const { data, error } = await supabase.from('pages').insert({
            site_id: site.id, name: seed.name, slug: seed.slug, position, seo_title: seed.seoTitle, seo_desc: seed.seoDesc,
          }).select().single();
          if (error) throw error;
          page = data;
        } else {
          const { error } = await supabase.from('pages').update({ name: seed.name, position, seo_title: seed.seoTitle, seo_desc: seed.seoDesc }).eq('id', page.id);
          if (error) throw error;
        }

        const rows = seed.blocks.map((block, blockPosition) => {
          const { type, ...config } = block;
          return { page_id: page.id, type, position: blockPosition, config };
        });
        if (rows.length) {
          const { error } = await supabase.from('blocks').insert(rows);
          if (error) throw error;
        }
      }

      const theme = { ...site.theme, launchKit: { ...kit, generatedAt: new Date().toISOString() } };
      const { data, error } = await supabase.from('sites').update({ theme }).eq('id', site.id).select().single();
      if (error) throw error;
      onUpdateSite?.((data ?? { ...site, theme }) as SiteRecord);
      setSaved(true);
      setGenerationMessage('Your starter site is ready. Open Studio Mode to preview, personalise, and publish it.');
    } catch (error: any) {
      setGenerationMessage(error?.message ?? 'We could not generate the starter site. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-7">
      <section className="rounded-3xl bg-slate-950 overflow-hidden text-white relative p-6 sm:p-9 shadow-xl shadow-indigo-100">
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute right-12 bottom-0 size-44 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1 text-[11px] font-bold text-indigo-200">
            <Sparkles size={13} /> Guided Launch
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">Launch a business page that brings work in.</h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">Set up the essentials your customers use: a clear offer, enquiries, bookings, WhatsApp follow-up, and payments. You can open Studio Mode whenever you need pixel-level control.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onOpenStudio} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-slate-900 hover:bg-slate-100">
              Open Studio Mode <ArrowRight size={15} />
            </button>
            <button onClick={() => onNavigate('home')} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10">Open command centre</button>
          </div>
        </div>
      </section>

      <div className="grid xl:grid-cols-[1fr_340px] gap-6 items-start">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-indigo-600">Your launch plan</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">Configure the outcomes, not the complexity.</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><CheckCircle2 size={14} /> {completion}% ready</span>
          </div>

          <div className="mt-7 space-y-6">
            <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Globe2 size={16} /></span>
                <div><h3 className="text-sm font-extrabold text-slate-900">Your business address</h3><p className="mt-1 text-xs leading-relaxed text-slate-500">{site.business_name} will be prepared for <span className="font-mono font-bold text-slate-700">{site.subdomain}.onlypage.in</span>. Domain routing is configured when your site is published.</p></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block rounded-2xl border border-slate-200 p-4">
                <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Globe2 size={15} className="text-indigo-600" /> Business type</span>
                <select value={kit.businessType} onChange={(event) => updateKit({ businessType: event.target.value as LaunchKit['businessType'] })} className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option value="local-service">Local service</option><option value="salon">Salon & wellness</option><option value="clinic">Clinic & practitioner</option><option value="creator">Creator & portfolio</option><option value="real-estate">Real estate</option>
                </select>
              </label>
              <label className="block rounded-2xl border border-slate-200 p-4">
                <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Wand2 size={15} className="text-indigo-600" /> Primary goal</span>
                <select value={kit.goal} onChange={(event) => updateKit({ goal: event.target.value })} className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>Get more enquiries</option><option>Take bookings</option><option>Sell products</option><option>Build trust locally</option>
                </select>
              </label>
              <label className="block rounded-2xl border border-slate-200 p-4">
                <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Languages size={15} className="text-indigo-600" /> Customer language</span>
                <select value={kit.locale} onChange={(event) => updateKit({ locale: event.target.value })} className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                  <option>English</option><option>Hindi</option><option>Tamil</option><option>Kannada</option><option>Telugu</option><option>Malayalam</option>
                </select>
              </label>
            </div>

            <div className="grid md:grid-cols-[1fr_auto] gap-4 rounded-2xl border border-slate-200 p-4">
              <label className="block min-w-0">
                <span className="text-sm font-extrabold text-slate-900">Services to put on your site</span>
                <input value={kit.services.join(', ')} onChange={(event) => updateKit({ services: event.target.value.split(',').map((service) => service.trim()).filter(Boolean).slice(0, 6) })} placeholder="e.g. Hair spa, Bridal makeup, Home visits" className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <span className="mt-1.5 block text-[11px] text-slate-500">Separate services with commas. We will turn the first three into your service section.</span>
              </label>
              <div>
                <span className="text-sm font-extrabold text-slate-900">Visual style</span>
                <div className="mt-3 flex gap-2">
                  {(['Modern', 'Warm', 'Bold'] as const).map((style) => <button key={style} type="button" onClick={() => updateKit({ style })} className={`rounded-xl border px-3 py-2 text-xs font-extrabold transition ${kit.style === style ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{style}</button>)}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between gap-3"><div><h3 className="text-sm font-extrabold text-slate-900">Choose your customer tools</h3><p className="mt-1 text-xs text-slate-500">We will keep the right workspace shortcuts ready. Configure each tool when you are ready.</p></div><span className="text-xs font-bold text-slate-400">{kit.tools.length} selected</span></div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {TOOL_OPTIONS.map(({ id, label, detail, icon: Icon, tab }) => {
                  const active = kit.tools.includes(id);
                  return <button key={id} type="button" onClick={() => toggleTool(id)} className={`rounded-2xl border p-4 text-left transition ${active ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                    <div className="flex items-start justify-between gap-3"><span className={`flex size-9 items-center justify-center rounded-xl ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Icon size={17} /></span>{active && <Check size={16} className="text-indigo-600" />}</div>
                    <p className="mt-3 text-sm font-extrabold text-slate-900">{label}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
                    <span onClick={(event) => { event.stopPropagation(); onNavigate(tab); }} className="mt-3 inline-block text-[11px] font-bold text-indigo-600 hover:underline">Configure now</span>
                  </button>;
                })}
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5">
            {generationMessage && <p className={`rounded-xl px-3 py-2.5 text-xs font-semibold ${generationMessage.startsWith('Your starter') ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{generationMessage}</p>}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-slate-500">{saved ? 'Launch settings saved.' : 'Save your setup before generating your starter site.'}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={saveLaunchKit} disabled={saving || generating} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"><Save size={15} /> {saving ? 'Saving…' : 'Save setup'}</button>
                <button onClick={generateStarterSite} disabled={saving || generating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60"><Sparkles size={15} /> {generating ? 'Generating…' : 'Generate my starter site'}</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">What happens next</p>
          <div className="mt-5 space-y-4">
            {[
              ['1', 'Generate your starter pages', 'We create Home, Services, and Contact pages plus Booking or Shop when selected.'],
              ['2', 'Connect the customer journey', 'Open the selected tools to configure forms, bookings, WhatsApp, offers, reviews, or products.'],
              ['3', 'Review before you publish', 'Use Studio Mode to personalise the page and preview desktop and mobile layouts.'],
            ].map(([number, title, detail]) => <div key={number} className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-500">{number}</span><div><p className="text-xs font-extrabold text-slate-800">{title}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p></div></div>)}
          </div>
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-900"><strong>Built for India:</strong> language and customer-flow choices are saved here; messaging, payment, and domain providers must still be connected in their respective setup screens.</div>
        </aside>
      </div>
    </div>
  );
}

export default LaunchMode;
