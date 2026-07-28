import React, { useState, useCallback, createContext, useContext } from 'react';

export type SupportedLanguage = 'en' | 'ta' | 'hi';

interface I18nContextType {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  availableLangs: { code: SupportedLanguage; label: string; native: string }[];
}

export const AVAILABLE_LANGS = [
  { code: 'en' as SupportedLanguage, label: 'English', native: 'English' },
  { code: 'ta' as SupportedLanguage, label: 'Tamil', native: 'Tamil' },
  { code: 'hi' as SupportedLanguage, label: 'Hindi', native: 'Hindi' },
];

type TranslationMap = Partial<Record<SupportedLanguage, string>>;

const TRANSLATIONS: Record<string, TranslationMap> = {
  'nav.dashboard': { en: 'Dashboard', ta: 'Dashboard', hi: 'Dashboard' },
  'nav.pages': { en: 'Pages', ta: 'Pages', hi: 'Pages' },
  'nav.leads': { en: 'Leads', ta: 'Leads', hi: 'Leads' },
  'nav.bookings': { en: 'Bookings', ta: 'Bookings', hi: 'Bookings' },
  'nav.products': { en: 'Products', ta: 'Products', hi: 'Products' },
  'nav.analytics': { en: 'Analytics', ta: 'Analytics', hi: 'Analytics' },
  'nav.billing': { en: 'Billing', ta: 'Billing', hi: 'Billing' },
  'nav.settings': { en: 'Settings', ta: 'Settings', hi: 'Settings' },
  'nav.crm': { en: 'CRM', ta: 'CRM', hi: 'CRM' },
  'nav.ai': { en: 'AI Assistant', ta: 'AI Assistant', hi: 'AI Assistant' },
  'nav.broadcast': { en: 'Broadcast', ta: 'Broadcast', hi: 'Broadcast' },
  'nav.email': { en: 'Email Drip', ta: 'Email Drip', hi: 'Email Drip' },
  'action.create': { en: 'Create', ta: 'Create', hi: 'Create' },
  'action.save': { en: 'Save', ta: 'Save', hi: 'Save' },
  'action.delete': { en: 'Delete', ta: 'Delete', hi: 'Delete' },
  'action.edit': { en: 'Edit', ta: 'Edit', hi: 'Edit' },
  'action.cancel': { en: 'Cancel', ta: 'Cancel', hi: 'Cancel' },
  'action.confirm': { en: 'Confirm', ta: 'Confirm', hi: 'Confirm' },
  'action.search': { en: 'Search', ta: 'Search', hi: 'Search' },
  'action.upload': { en: 'Upload', ta: 'Upload', hi: 'Upload' },
  'action.share': { en: 'Share', ta: 'Share', hi: 'Share' },
  'action.download': { en: 'Download', ta: 'Download', hi: 'Download' },
  'action.publish': { en: 'Publish', ta: 'Publish', hi: 'Publish' },
  'action.copy': { en: 'Copy', ta: 'Copy', hi: 'Copy' },
  'action.close': { en: 'Close', ta: 'Close', hi: 'Close' },
  'label.name': { en: 'Name', ta: 'Name', hi: 'Name' },
  'label.email': { en: 'Email', ta: 'Email', hi: 'Email' },
  'label.phone': { en: 'Phone', ta: 'Phone', hi: 'Phone' },
  'label.status': { en: 'Status', ta: 'Status', hi: 'Status' },
  'label.date': { en: 'Date', ta: 'Date', hi: 'Date' },
  'label.amount': { en: 'Amount', ta: 'Amount', hi: 'Amount' },
  'label.price': { en: 'Price', ta: 'Price', hi: 'Price' },
  'label.description': { en: 'Description', ta: 'Description', hi: 'Description' },
  'label.website': { en: 'Website', ta: 'Website', hi: 'Website' },
  'label.address': { en: 'Address', ta: 'Address', hi: 'Address' },
  'label.city': { en: 'City', ta: 'City', hi: 'City' },
  'label.state': { en: 'State', ta: 'State', hi: 'State' },
  'label.pincode': { en: 'Pincode', ta: 'Pincode', hi: 'Pincode' },
  'label.language': { en: 'Language', ta: 'Language', hi: 'Language' },
  'plan.free': { en: 'Free Plan', ta: 'Free Plan', hi: 'Free Plan' },
  'plan.pro': { en: 'Pro Plan', ta: 'Pro Plan', hi: 'Pro Plan' },
  'plan.business': { en: 'Business Plan', ta: 'Business Plan', hi: 'Business Plan' },
  'plan.current': { en: 'Current Plan', ta: 'Current Plan', hi: 'Current Plan' },
  'plan.upgrade': { en: 'Upgrade', ta: 'Upgrade', hi: 'Upgrade' },
  'empty.leads.title': { en: 'No leads yet', ta: 'No leads yet', hi: 'No leads yet' },
  'empty.pages.title': { en: 'No pages yet', ta: 'No pages yet', hi: 'No pages yet' },
  'empty.products.title': { en: 'No products yet', ta: 'No products yet', hi: 'No products yet' },
  'empty.bookings.title': { en: 'No bookings yet', ta: 'No bookings yet', hi: 'No bookings yet' },
  'settings.general': { en: 'General', ta: 'General', hi: 'General' },
  'settings.profile': { en: 'Profile', ta: 'Profile', hi: 'Profile' },
  'settings.notifications': { en: 'Notifications', ta: 'Notifications', hi: 'Notifications' },
  'settings.integrations': { en: 'Integrations', ta: 'Integrations', hi: 'Integrations' },
  'settings.domain': { en: 'Custom Domain', ta: 'Custom Domain', hi: 'Custom Domain' },
  'settings.seo': { en: 'SEO', ta: 'SEO', hi: 'SEO' },
  'settings.team': { en: 'Team', ta: 'Team', hi: 'Team' },
  'settings.language': { en: 'Language', ta: 'Language', hi: 'Language' },
  'misc.loading': { en: 'Loading...', ta: 'Loading...', hi: 'Loading...' },
  'misc.saving': { en: 'Saving...', ta: 'Saving...', hi: 'Saving...' },
  'misc.success': { en: 'Success!', ta: 'Success!', hi: 'Success!' },
  'misc.error': { en: 'Error', ta: 'Error', hi: 'Error' },
  'misc.welcome': { en: 'Welcome back', ta: 'Welcome back', hi: 'Welcome back' },
  'misc.noData': { en: 'No data available', ta: 'No data available', hi: 'No data available' },
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
  availableLangs: AVAILABLE_LANGS,
});

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('onlypage_lang') as SupportedLanguage) || 'en';
  });
  const setLang = useCallback((newLang: SupportedLanguage) => {
    setLangState(newLang);
    localStorage.setItem('onlypage_lang', newLang);
  }, []);
  const t = useCallback((key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[lang] || entry['en'] || key;
  }, [lang]);
  return (
    <I18nContext.Provider value={{ lang, setLang, t, availableLangs: AVAILABLE_LANGS }}>
      {children}
    </I18nContext.Provider>
  );
}

export function LanguageSwitcher() {
  const { lang, setLang, availableLangs } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer"
      >
        <span>{availableLangs.find(l => l.code === lang)?.native || 'English'}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[130px]">
            {availableLangs.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={'w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold transition-colors cursor-pointer ' + (lang === l.code ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50')}
              >
                <span className={lang === l.code ? '' : 'text-slate-300'}>{l.native}</span>
                <span className="text-[9px] text-slate-400">{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default I18nProvider;
