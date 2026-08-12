import React, { useState } from 'react';
import { LayoutDashboard, BarChart3, Settings, Bell, Search, Moon, Sun, Shield, LogOut, ChevronDown } from 'lucide-react';

export interface HorizonSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  styles?: any;
  block?: any;
}

export const HorizonAdminSidebar: React.FC<HorizonSidebarProps> = ({
  activeTab = 'dashboard',
  onTabChange,
  isDarkMode = true,
  onToggleDarkMode,
  styles = {},
  block
}) => {
  const menuItems = block?.menuItems?.length ? block.menuItems : [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'security', label: 'Access & Security', icon: Shield },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <aside className="flex h-full w-64 shrink-0 select-none flex-col justify-between border-r p-6"
      style={{ backgroundColor: styles.sidebarBgColor || '#111C44', borderColor: styles.cardBorderColor || 'rgba(30, 41, 59, 0.8)', color: styles.textColor || '#ffffff' }}
    >
      <div>
        <div className="mb-10 flex items-center gap-3">
          {block?.logo ? (
            <img src={block.logo} alt="Logo" className="h-10 w-10 rounded-2xl object-cover" />
          ) : (
            <div className="text-xl font-bold flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg ring-2 ring-white/10"
              style={{ background: styles.accentColor ? `linear-gradient(to top right, ${styles.accentColor}, #43CBFF)` : 'linear-gradient(to top right, #7551FF, #43CBFF, #F6B03C)' }}
            >
              {(block?.brandName || 'H').charAt(0)}
            </div>
          )}
          <div>
            <span className="block text-lg font-black leading-tight tracking-tight text-white">
              {block?.brandName ? block.brandName.split(' ')[0] : 'HORIZON'} <span className="font-medium" style={{ color: styles.highlightColor || '#43CBFF' }}>{block?.brandName ? block.brandName.split(' ')[1] : 'PRO'}</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: styles.subtitleColor || '#94a3b8' }}>
              {block?.version || 'UI System v4.0'}
            </span>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item: any, idx: number) => {
            const Icon = item.icon || LayoutDashboard;
            const isActive = activeTab === (item.id || item.label.toLowerCase());
            return (
              <button
                key={item.id || item.label || idx}
                onClick={() => onTabChange?.(item.id || item.label.toLowerCase())}
                className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                  isActive ? 'text-white shadow-xl ring-1 ring-white/20' : 'hover:bg-white/5 hover:text-white'
                }`}
                style={isActive ? {
                  background: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #6035FF)` : 'linear-gradient(to right, #7551FF, #6035FF)'
                } : { color: styles.subtitleColor || '#94a3b8' }}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: styles.subtitleColor || '#94a3b8' } : {}} />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="h-1.5 w-1.5 rounded-full shadow-xs" style={{ backgroundColor: styles.highlightColor || '#43CBFF' }} />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 border-t pt-6" style={{ borderColor: styles.cardBorderColor || 'rgba(30, 41, 59, 0.8)' }}>
        <button
          onClick={onToggleDarkMode}
          className="flex w-full cursor-pointer items-center justify-between rounded-2xl border bg-white/5 px-4 py-3 text-xs font-bold transition-all hover:bg-white/10"
          style={{ borderColor: styles.cardBorderColor || 'rgba(255, 255, 255, 0.1)', color: styles.textColor || '#e2e8f0' }}
        >
          <span className="flex items-center gap-2.5">
            {isDarkMode ? <Moon className="h-4 w-4" style={{ color: styles.highlightColor || '#43CBFF' }} /> : <Sun className="h-4 w-4 text-amber-400" />}
            {isDarkMode ? 'Dark Theme' : 'Light Theme'}
          </span>
          <span className="rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
            style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}33` : 'rgba(117, 81, 255, 0.2)', color: styles.highlightColor || '#43CBFF', borderColor: styles.accentColor ? `${styles.accentColor}4D` : 'rgba(117, 81, 255, 0.3)' }}
          >
            PRO
          </span>
        </button>
      </div>
    </aside>
  );
};

export interface HorizonNavbarProps {
  pageTitle?: string;
  userName?: string;
  userAvatar?: string;
  styles?: any;
  block?: any;
}

export const HorizonAdminNavbar: React.FC<HorizonNavbarProps> = ({
  pageTitle = 'Main Dashboard',
  userName = 'Rathna Kumar',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  styles = {},
  block
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b px-8 backdrop-blur-xl"
      style={{ backgroundColor: styles.headerBgColor || 'rgba(17, 28, 68, 0.9)', borderColor: styles.cardBorderColor || 'rgba(30, 41, 59, 0.8)', color: styles.textColor || '#ffffff' }}
    >
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[10px]" style={{ color: styles.subtitleColor || '#94a3b8' }}>Pages / {block?.pageTitle || pageTitle}</span>
        <h1 className="text-4xl @sm:text-5xl @lg:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: styles.textColor || '#ffffff' }}>{block?.pageTitle || pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-64 @sm:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: styles.subtitleColor || '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full rounded-full border py-2.5 pl-10 pr-4 text-xs transition-all focus:outline-none"
            style={{
              backgroundColor: styles.inputBgColor || '#0B1437',
              borderColor: styles.inputBorderColor || '#1e293b',
              color: styles.textColor || '#ffffff',
              '--tw-placeholder-color': styles.subtitleColor || '#64748b'
            } as any}
          />
        </div>

        <button className="relative cursor-pointer rounded-full border p-2.5 transition-colors"
          style={{ backgroundColor: styles.inputBgColor || '#0B1437', borderColor: styles.inputBorderColor || '#1e293b', color: styles.textColor || '#cbd5e1' }}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full ring-2" style={{ backgroundColor: styles.highlightColor || '#43CBFF', borderColor: styles.headerBgColor || '#111C44' }} />
        </button>

        <div className="flex items-center gap-3 border-l pl-3" style={{ borderColor: styles.inputBorderColor || '#1e293b' }}>
          <img src={block?.userAvatar || userAvatar} alt={block?.userName || userName} className="h-9 w-9 rounded-full object-cover ring-2" style={{ borderColor: styles.accentColor || '#7551FF' }} />
          <div className="hidden text-left @md:block">
            <span className="block text-xs font-extrabold leading-tight" style={{ color: styles.textColor || '#ffffff' }}>{block?.userName || userName}</span>
            <span className="block text-[9px] font-bold" style={{ color: styles.highlightColor || '#43CBFF' }}>{block?.userRole || 'Super Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
