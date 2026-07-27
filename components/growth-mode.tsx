import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, CheckCircle2, Clipboard, Eye, Languages, MessageCircle, RefreshCw, Sparkles, TrendingUp, UsersRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteRecord } from '@/components/ui/onboarding-wizard';

type Lead = { id: string; name: string | null; phone: string | null; status: string | null; created_at: string };
type Booking = { id: string; name: string; status: string | null; slot_at: string | null; created_at: string };

interface GrowthModeProps {
  site: SiteRecord;
  onNavigate: (tab: string) => void;
}

const followUpCopy: Record<string, string> = {
  English: 'Hi {{name}}, thank you for contacting {{business}}. How can we help you today?',
  Hindi: 'नमस्ते {{name}}, {{business}} से संपर्क करने के लिए धन्यवाद। हम आपकी कैसे मदद कर सकते हैं?',
  Tamil: 'வணக்கம் {{name}}, {{business}}-ஐ தொடர்புகொண்டதற்கு நன்றி. இன்று உங்களுக்கு எவ்வாறு உதவலாம்?',
  Kannada: 'ನಮಸ್ಕಾರ {{name}}, {{business}} ಅನ್ನು ಸಂಪರ್ಕಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಇಂದು ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
  Telugu: 'నమస్కారం {{name}}, {{business}}ను సంప్రదించినందుకు ధన్యవాదాలు. మేము మీకు ఎలా సహాయం చేయగలం?',
  Malayalam: 'നമസ്കാരം {{name}}, {{business}}-നെ ബന്ധപ്പെട്ടതിന് നന്ദി. ഇന്ന് ഞങ്ങൾ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?',
};

type WhatsAppStatus = 'checking' | 'connected' | 'not_configured' | 'unreachable' | 'unknown';

export function GrowthMode({ site, onNavigate }: GrowthModeProps) {
  const launchKit = site.theme?.launchKit || {};
  const locale = launchKit.locale || 'English';
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [sending, setSending] = useState(false);
  const [whatsAppStatus, setWhatsAppStatus] = useState<WhatsAppStatus>('checking');

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {};
  };

  const loadGrowthData = async () => {
    setLoading(true);
    setNotice(null);
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [leadResult, bookingResult, viewResult] = await Promise.all([
      supabase.from('leads').select('id, name, phone, status, created_at').eq('site_id', site.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('bookings').select('id, name, status, slot_at, created_at').eq('site_id', site.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('page_views').select('id', { count: 'exact', head: true }).eq('site_id', site.id).gte('created_at', since),
    ]);
    if (leadResult.error || bookingResult.error || viewResult.error) {
      setNotice('Some growth data is unavailable. Check your database setup, then refresh.');
    }
    const nextLeads = (leadResult.data || []) as Lead[];
    setLeads(nextLeads);
    setSelectedLeadId((current) => nextLeads.some((lead) => lead.id === current) ? current : (nextLeads.find((lead) => Boolean(lead.phone))?.id || ''));
    setBookings((bookingResult.data || []) as Booking[]);
    setViews(viewResult.count || 0);
    setLoading(false);
  };

  const loadWhatsAppStatus = async () => {
    try {
      const headers = await getAuthHeaders();
      const result = await fetch(`/api/whatsapp/status?site_id=${encodeURIComponent(site.id)}`, { headers });
      const payload = await result.json();
      setWhatsAppStatus(payload.connected ? 'connected' : (payload.status === 'not_configured' ? 'not_configured' : payload.status === 'unreachable' ? 'unreachable' : 'unknown'));
    } catch {
      setWhatsAppStatus('unreachable');
    }
  };

  useEffect(() => {
    loadGrowthData();
    loadWhatsAppStatus();
  }, [site.id]);

  const openLeads = useMemo(() => leads.filter((lead) => ['new', 'open', 'unread'].includes((lead.status || 'new').toLowerCase())), [leads]);
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId);
  const template = (followUpCopy[locale] || followUpCopy.English).replace('{{business}}', site.business_name);
  const personalisedTemplate = template.replace('{{name}}', selectedLead?.name || 'there');

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(personalisedTemplate);
      setNotice('Follow-up copied. Review the wording before pasting it elsewhere.');
    } catch {
      setNotice('Copy is unavailable in this browser. Select the template text manually.');
    }
  };

  const sendFollowUp = async () => {
    if (!selectedLead) {
      setNotice('Choose a lead with a WhatsApp number before sending a follow-up.');
      return;
    }
    setSending(true);
    try {
      const headers = await getAuthHeaders();
      const result = await fetch('/api/whatsapp/send-follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ siteId: site.id, leadId: selectedLead.id, message: personalisedTemplate, locale }),
      });
      const payload = await result.json();
      if (!result.ok) throw new Error(payload.error || 'Could not send the follow-up.');
      setNotice(`Follow-up sent to ${selectedLead.name || 'the lead'} and recorded in CRM activity.`);
      await loadGrowthData();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not send the follow-up.');
      await loadWhatsAppStatus();
    } finally {
      setSending(false);
    }
  };

  const priorities = [
    openLeads.length > 0 ? { title: `Reply to ${openLeads.length} new lead${openLeads.length === 1 ? '' : 's'}`, detail: 'Fast replies are the strongest way to turn an enquiry into a conversation.', action: 'Open inbox', tab: 'crm', icon: UsersRound, tone: 'indigo' } : { title: 'Your lead inbox is clear', detail: 'Keep your enquiry form prominent and share your page to generate the next conversation.', action: 'View lead tools', tab: 'forms', icon: CheckCircle2, tone: 'emerald' },
    bookings.length > 0 ? { title: `Review ${bookings.length} booking request${bookings.length === 1 ? '' : 's'}`, detail: 'Confirm a time, then send the customer a clear next step.', action: 'Open bookings', tab: 'bookings', icon: CalendarClock, tone: 'amber' } : { title: 'Make booking your next conversion path', detail: 'Add a booking block when appointments are central to your business.', action: 'Set up bookings', tab: 'bookings', icon: CalendarClock, tone: 'amber' },
    views === 0 ? { title: 'Start measuring real visits', detail: 'Your page needs published traffic before we can identify low-converting sections.', action: 'Open analytics', tab: 'analytics', icon: Eye, tone: 'slate' } : { title: `${views} page view${views === 1 ? '' : 's'} in the last 7 days`, detail: 'Compare this with enquiries and bookings before changing your offer or call-to-action.', action: 'Review analytics', tab: 'analytics', icon: TrendingUp, tone: 'indigo' },
  ];

  const connectionLabel = whatsAppStatus === 'connected' ? 'Evolution connected' : whatsAppStatus === 'checking' ? 'Checking connection' : 'Setup required';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-6">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div><span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-extrabold text-white"><Sparkles size={13} /> Local Growth</span><h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">What your business should improve today.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">A focused daily view of customer replies, booking requests, and real traffic—not a generic marketing dashboard.</p></div>
          <button onClick={() => { loadGrowthData(); loadWhatsAppStatus(); }} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh data</button>
        </div>
      </section>

      {notice && <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600">{notice}</div>}

      <section className="grid lg:grid-cols-3 gap-4">
        {priorities.map(({ title, detail, action, tab, icon: Icon, tone }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`flex size-9 items-center justify-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : tone === 'amber' ? 'bg-amber-50 text-amber-600' : tone === 'slate' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-600'}`}><Icon size={18} /></span><h2 className="mt-4 text-sm font-black text-slate-900">{title}</h2><p className="mt-2 text-xs leading-relaxed text-slate-500">{detail}</p><button onClick={() => onNavigate(tab)} className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-700">{action} <ArrowRight size={13} /></button></article>)}
      </section>

      <section className="grid xl:grid-cols-[1.25fr_0.75fr] gap-6">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-slate-400">WhatsApp follow-up</p><h2 className="mt-1 text-lg font-black text-slate-900">Reply in your customer’s preferred language.</h2></div><div className="flex gap-2"><span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><Languages size={13} /> {locale}</span><span className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-bold ${whatsAppStatus === 'connected' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{connectionLabel}</span></div></div>
          <label className="mt-5 block text-xs font-bold text-slate-600">Send to a lead with a valid Indian WhatsApp number<select value={selectedLeadId} onChange={(event) => setSelectedLeadId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500"><option value="">Choose a lead</option>{leads.filter((lead) => lead.phone).map((lead) => <option key={lead.id} value={lead.id}>{lead.name || 'Unnamed lead'} — {lead.phone}</option>)}</select></label>
          <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-100">{personalisedTemplate}</div>
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={sendFollowUp} disabled={!selectedLead || sending} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"><MessageCircle size={14} /> {sending ? 'Sending…' : 'Send follow-up'}</button><button onClick={copyTemplate} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-indigo-500"><Clipboard size={14} /> Copy</button><button onClick={() => onNavigate('whatsapp')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50">Configure WhatsApp</button></div>
          <p className="mt-3 text-[11px] text-slate-500">Every send is recorded against the lead. Only an authenticated owner can send; messages stay blocked until the Evolution instance is connected.</p>
        </article>
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-slate-400">Growth snapshot</p><div className="mt-5 space-y-4"><div className="flex items-center justify-between border-b border-slate-100 pb-3"><span className="text-sm font-bold text-slate-600">Open leads</span><strong className="text-2xl font-black text-slate-900">{openLeads.length}</strong></div><div className="flex items-center justify-between border-b border-slate-100 pb-3"><span className="text-sm font-bold text-slate-600">Booking requests</span><strong className="text-2xl font-black text-slate-900">{bookings.length}</strong></div><div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-600">Views, 7 days</span><strong className="text-2xl font-black text-slate-900">{views}</strong></div></div><button onClick={() => onNavigate('launch')} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-slate-800">Review launch setup</button></aside>
      </section>
    </div>
  );
}

export default GrowthMode;
