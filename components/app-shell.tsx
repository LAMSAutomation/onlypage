import React, { useState } from 'react';
import { 
  Home, Layers, Files, Database, ClipboardList, Inbox, Users, MessageSquare, 
  Calendar, BarChart3, Search, Megaphone, Sparkles, Cpu, Folder, Star, Plug, 
  Settings, CreditCard, Menu, X, Bell, User, ExternalLink, ShoppingBag, Rocket, TrendingUp,
  Send, Mail
} from 'lucide-react';
import { DarkModeToggle } from '@/hooks/use-dark-mode';
import { LanguageSwitcher } from '@/hooks/use-i18n';
import { motion, AnimatePresence } from 'motion/react';
import type { SiteRecord } from './ui/onboarding-wizard';

// Define the sidebar items with metadata
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeColor?: string;
  modes?: string[]; // If specific to some dashboard modes, otherwise all
}

const SIDEBAR_ITEMS: NavigationItem[] = [
  { id: 'launch', label: 'Guided Launch', icon: Rocket, badge: 'Start', badgeColor: 'bg-indigo-500 text-white' },
  { id: 'growth', label: 'Local Growth', icon: TrendingUp, badge: 'Today', badgeColor: 'bg-emerald-500 text-white' },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'builder', label: 'Website Builder', icon: Layers },
  { id: 'pages', label: 'Pages', icon: Files },
  { id: 'cms', label: 'CMS', icon: Database },
  { id: 'store', label: 'Store & Products', icon: ShoppingBag, badge: 'ECom', badgeColor: 'bg-emerald-500 text-white' },
  { id: 'forms', label: 'Forms Center', icon: ClipboardList },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'crm', label: 'Contacts CRM', icon: Users },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'broadcast', label: 'WhatsApp Broadcast', icon: Send },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'seo', label: 'SEO Manager', icon: Search },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'email-drip', label: 'Email Drip', icon: Mail },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'automations', label: 'Automations', icon: Cpu },
  { id: 'files', label: 'Files', icon: Folder },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'integrations', label: 'App Marketplace', icon: Plug },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'billing', label: 'Billing', icon: CreditCard }
];

export type DashboardMode = 'store' | 'business' | 'student' | 'salon' | 'creator';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  dashboardMode: DashboardMode;
  onLogout?: () => void;
  site: SiteRecord;
}

export function AppShell({ 
  children, 
  activeTab,
  setActiveTab,
  dashboardMode,
  onLogout,
  site
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const getVisibleItems = () => {
    // Dynamically re-order or highlight tabs based on chosen mode
    return SIDEBAR_ITEMS;
  };

  const items = getVisibleItems();
  const initials = site.business_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'OP';

  return (
    <div className="flex h-screen w-full bg-[#f7f7f4] font-sans text-[#18201d] antialiased overflow-hidden selection:bg-[#e3f0bb] selection:text-[#18201d]">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#18201d]/10 bg-white h-full shrink-0 shadow-2xs">
        {/* Brand Header */}
        <div className="h-16 border-b border-[#18201d]/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-[10px] bg-[#18201d] text-sm font-black text-[#bef264] shadow-xs select-none">
              O
            </div>
            <div>
              <span className="font-black text-sm tracking-[-0.03em] text-[#18201d] block">OnlyPage</span>
              <span className="text-[9px] font-black text-[#718078] uppercase tracking-widest block">DASHBOARD</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-[#4c7005] bg-[#e3f0bb] px-2 py-0.5 rounded-full select-none">
            v2.4
          </span>
        </div>

        {/* Navigation Items Link List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin select-none">
          {items.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isSelected 
                    ? 'bg-[#18201d] text-white shadow-sm border border-[#18201d]/10'
                    : 'text-[#53605a] hover:text-[#18201d] hover:bg-[#18201d]/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isSelected ? 'text-[#bef264]' : 'text-[#718078]'} />
                  <span className={isSelected ? 'font-black' : 'font-semibold'}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                    isSelected 
                      ? 'bg-[#e3f0bb] text-[#4c7005]'
                      : item.badge === 'Live' || item.badge === '87'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#e3f0bb] text-[#4c7005]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile footer section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 border border-indigo-200 select-none shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{site.business_name}</h4>
              <span className="text-[10px] font-medium text-slate-400 block truncate">Business workspace</span>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-[10px] font-extrabold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer shrink-0"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* --- MOBILE DRAWERS SIDEBAR --- */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col h-full border-r border-slate-200 shadow-2xl lg:hidden"
            >
              {/* Header inside mobile sidebar */}
              <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xs select-none">
                    O
                  </div>
                  <div>
                    <span className="font-extrabold text-sm tracking-tight text-slate-900 block">OnlyPage</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dashboard</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav links list on Mobile */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 select-none">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={isSelected ? 'text-white' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-150 flex items-center justify-center font-bold text-xs text-indigo-600 border border-indigo-200 shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{site.business_name}</h4>
                    <span className="text-[10px] text-slate-400">Business workspace</span>
                  </div>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-[10px] font-extrabold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer shrink-0"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- CONTENT AREA & HEADER BAR --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#18201d]/10 bg-[#f7f7f4]/90 backdrop-blur-xl px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white text-[#18201d] cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#718078]">Address:</span>
              <a 
                href={`https://${site.subdomain}.onlypage.in`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-black text-[#18201d] hover:text-[#4c7005] hover:underline transition-colors"
              >
                <span>{site.subdomain}.onlypage.in</span>
                <ExternalLink size={11} />
              </a>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#e3f0bb] text-[#4c7005] border border-[#70a10d]/20 text-[10px] font-black rounded-full select-none ml-1">
                <span className="w-1.5 h-1.5 bg-[#70a10d] rounded-full animate-pulse" />
                <span>{site.published ? 'Published' : 'Draft'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 select-none">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Dark mode toggle */}
            <DarkModeToggle />

            {/* Quick Helper Badge */}
            <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-[#18201d]/10 text-[10px] font-bold text-[#53605a]">
              <span>View Mode:</span>
              <span className="text-[#18201d] font-black uppercase">{dashboardMode}</span>
            </div>

            {/* Notification Indicator Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-[#53605a] hover:text-[#18201d] hover:bg-white rounded-full transition-colors cursor-pointer relative"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#70a10d] rounded-full ring-2 ring-white" />
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-80 bg-white border border-[#18201d]/10 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
                    <div className="px-4 py-2.5 border-b border-[#18201d]/10 flex items-center justify-between bg-[#f7f7f4]">
                      <span className="text-xs font-extrabold text-[#18201d]">Notifications</span>
                      <span className="text-[10px] font-bold text-[#4c7005] cursor-pointer">Mark all as read</span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      <div className="p-3 hover:bg-[#f7f7f4] transition-colors">
                        <p className="text-[11px] font-bold text-[#18201d]">Hot Lead Added 🔥</p>
                        <p className="text-[10px] text-[#718078] mt-0.5">Ravi Kumar filled out the "Appointment Form" for Haircut.</p>
                        <span className="text-[8px] font-medium text-slate-400 mt-1 block">2 minutes ago</span>
                      </div>
                      <div className="p-3 hover:bg-[#f7f7f4] transition-colors">
                        <p className="text-[11px] font-bold text-[#18201d]">New WhatsApp Inquiry 💬</p>
                        <p className="text-[10px] text-[#718078] mt-0.5">Contact is interested in Hair Spa pricing.</p>
                        <span className="text-[8px] font-medium text-slate-400 mt-1 block">20 minutes ago</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile dropdown */}
            <div className="flex items-center space-x-2 border-l border-[#18201d]/10 pl-3">
              <div className="w-8 h-8 rounded-full bg-[#18201d] text-white flex items-center justify-center font-black border border-[#18201d]/20 text-xs shadow-3xs">
                {initials}
              </div>
              <span className="hidden sm:inline-block text-xs font-black text-[#18201d]">{site.business_name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Content */}
        <main className="flex-1 overflow-y-auto relative bg-[#f7f7f4]">
          {children}
        </main>
      </div>
    </div>
  );
}
