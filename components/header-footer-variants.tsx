import React, { useState } from 'react';
import {
  ArrowRight, ArrowUp, ChevronDown, CreditCard, Github, Globe, Instagram,
  Lock, MapPin, MessageCircle, Phone, Rocket, Search, ShoppingCart,
  Sparkles, Twitter,
} from 'lucide-react';
import type { WebBlock, BlockCSSStyles } from './builder-types';

// =====================================================================
// HEADER / FOOTER LAYOUT LIBRARY
// Every variant is a real React component bound to the site's actual
// navigation links, block content, and the editor's Selectable system.
// =====================================================================

export interface ChromeLink {
  id: string;
  label: string;
  url?: string;
}

export interface ChromeLayoutProps {
  block: WebBlock & Record<string, any>;
  links: ChromeLink[];
  styles: BlockCSSStyles;
  buttonStyle: React.CSSProperties;
  /** Editor-aware wrapper. Pass elementId + children; no-ops when not editing. */
  Selectable: (props: { elementId: string; className?: string; children?: React.ReactNode }) => React.ReactNode;
  onNavigate: (url?: string) => void;
  runAction: () => void;
  site?: any;
}

type NavFC = React.FC<ChromeLayoutProps>;
type FooterFC = React.FC<ChromeLayoutProps>;

const logo = (p: ChromeLayoutProps, imgClass = 'h-6 max-w-[200px] object-contain') =>
  p.block.imageUrl ? (
    <img src={p.block.imageUrl} className={imgClass} alt="Brand logo" referrerPolicy="no-referrer" />
  ) : (
    <span className="font-black uppercase tracking-widest" style={{ color: p.styles.accentColor }}>
      {p.block.title || 'OnlyPage'}
    </span>
  );

const linkRow = (p: ChromeLayoutProps, className: string, itemClass = 'hover:text-white cursor-pointer transition') => (
  <div className={className}>
    {p.links.slice(0, 5).map((link) => (
      <button
        key={link.id}
        type="button"
        data-navigation-link="true"
        onClick={(e) => {
          e.stopPropagation();
          p.onNavigate(link.url);
        }}
        className={`text-left ${itemClass}`}
      >
        {link.label}
      </button>
    ))}
  </div>
);

// =====================================================================
// NAVIGATION LAYOUTS (21)
// =====================================================================

export const NAV_LAYOUTS: Record<string, NavFC> = {
  /** 01 · Minimal — brand left, real links center, CTA right */
  'nav-minimal': (p) => (
    <div
      className="flex items-center justify-between p-4"
      style={{
        backgroundColor: p.styles.cardBgColor,
        border: `1px solid ${p.styles.cardBorderColor || 'rgba(255,255,255,0.05)'}`,
        borderRadius: `${p.styles.cardBorderRadius}px`,
      }}
    >
      <p.Selectable elementId="title">{logo(p)}</p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {linkRow(p, 'flex items-center gap-6')}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" className="font-extrabold cursor-pointer transition" style={{ ...p.buttonStyle, padding: '9px 18px', fontSize: '11px' }}>
          {p.block.btnText || 'Sign In'}
        </button>
      </p.Selectable>
    </div>
  ),

  /** 02 · Glass — frosted floating pill, real links */
  'nav-glass': (p) => (
    <div className="flex items-center justify-between p-3 px-6 backdrop-blur-xl bg-slate-900/40 border border-slate-100/10 shadow-2xl rounded-full">
      <p.Selectable elementId="title" className="flex items-center gap-1.5">
        {p.block.imageUrl ? (
          <img src={p.block.imageUrl} className="h-5 max-w-[150px] object-contain" alt="Brand logo" referrerPolicy="no-referrer" />
        ) : (
          <>
            <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[10px] text-blue-400 font-bold">
              {(p.block.title || 'O').charAt(0).toUpperCase()}
            </span>
            <span className="font-black text-xs tracking-tight text-white">{p.block.title || 'Glass'}</span>
          </>
        )}
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-6 text-xs text-slate-300 font-medium">
        {linkRow(p, 'flex items-center gap-6', 'hover:text-blue-400 cursor-pointer transition')}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" onClick={p.runAction} className="px-4 py-1.5 bg-white text-slate-950 font-bold rounded-full text-[10px] hover:bg-slate-100 transition shadow">
          {p.block.btnText || 'Launch Console'}
        </button>
      </p.Selectable>
    </div>
  ),

  /** 03 · Centered logo — brand centered, links split left/right */
  'nav-centered-logo': (p) => (
    <div
      className="grid grid-cols-3 items-center p-4"
      style={{ backgroundColor: p.styles.cardBgColor, borderBottom: `1.5px solid ${p.styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}
    >
      <p.Selectable elementId="subtitle" className="flex gap-4 text-xs font-semibold text-slate-400">
        {p.links.slice(0, 2).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="title" className="text-center">
        <span className="font-black text-sm tracking-widest uppercase border-b-2 pb-0.5" style={{ color: p.styles.textColor, borderColor: p.styles.accentColor }}>
          {p.block.title || 'BrandCentred'}
        </span>
      </p.Selectable>
      <div className="flex justify-end gap-5">
        {p.links.slice(2, 4).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">
            {link.label}
          </button>
        ))}
        <p.Selectable elementId="button">
          <button type="button" className="text-xs font-bold hover:underline" style={{ color: p.styles.accentColor }}>
            {p.block.btnText || 'Join Today'}
          </button>
        </p.Selectable>
      </div>
    </div>
  ),

  /** 04 · Sidebar toggle — brand + minimal burger */
  'nav-sidebar-toggle': (p) => (
    <div className="flex items-center justify-between p-4" style={{ backgroundColor: p.styles.cardBgColor }}>
      <p.Selectable elementId="title">
        <span className="font-extrabold text-sm" style={{ color: p.styles.textColor }}>{p.block.title || 'Minimalist'}</span>
      </p.Selectable>
      <div className="flex items-center gap-4">
        <span className="hidden @sm:block text-[10px] font-bold tracking-widest text-slate-500">{p.links[0]?.label?.toUpperCase() || 'MENU'}</span>
        <button type="button" aria-label="Open menu" className="w-8 h-8 rounded-lg bg-slate-800 flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-slate-700 transition">
          <span className="w-4 h-0.5 bg-white" />
          <span className="w-4 h-0.5 bg-white" />
          <span className="w-4 h-0.5 bg-white" />
        </button>
      </div>
    </div>
  ),

  /** 05 · Mega menu — hover dropdown with real links */
  'nav-mega-menu': (p) => {
    const [open, setOpen] = useState(false);
    const primary = p.links.slice(0, 2);
    return (
      <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
        <p.Selectable elementId="title">
          <span className="font-black text-sm text-white">{p.block.title || 'ApexSaaS'}</span>
        </p.Selectable>
        <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-6 text-xs text-slate-400 font-bold">
          <div
            className="relative py-2 cursor-pointer hover:text-white flex items-center gap-1"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <span>Explore</span> <ChevronDown size={12} />
            {open && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl z-50 text-left grid grid-cols-2 gap-3">
                {p.links.slice(0, 4).map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    data-navigation-link="true"
                    onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }}
                    className="text-left font-extrabold text-[10px] text-slate-300 hover:text-white uppercase tracking-wider"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {primary.slice(1).map((link) => (
            <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer transition">
              {link.label}
            </button>
          ))}
        </p.Selectable>
        <p.Selectable elementId="button">
          <button type="button" onClick={p.runAction} className="font-extrabold text-xs px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition">
            {p.block.btnText || 'Start Free Trial'}
          </button>
        </p.Selectable>
      </div>
    );
  },

  /** 06 · Search bar — embedded search input */
  'nav-search-bar': (p) => (
    <div className="flex items-center justify-between p-3.5 gap-4" style={{ backgroundColor: p.styles.cardBgColor, borderBottom: `1px solid ${p.styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
      <p.Selectable elementId="title">
        <span className="font-black text-sm" style={{ color: p.styles.textColor }}>{p.block.title || 'Lookup'}</span>
      </p.Selectable>
      <div className="flex-1 max-w-sm hidden @sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
        <Search size={14} className="text-slate-500" />
        <input type="text" aria-label="Search pages" placeholder={`Search ${p.links.length} pages...`} className="bg-transparent text-[11px] outline-none text-slate-300 w-full" />
      </div>
      <div className="flex items-center gap-4">
        {p.links.slice(0, 2).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hidden @md:block text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
        <p.Selectable elementId="button">
          <button type="button" className="px-4 py-1.5 text-xs font-bold rounded bg-slate-800 text-white hover:bg-slate-700 transition">{p.block.btnText || 'Console'}</button>
        </p.Selectable>
      </div>
    </div>
  ),

  /** 07 · Social icons left, real links right */
  'nav-social-icons': (p) => (
    <div className="flex items-center justify-between p-4" style={{ backgroundColor: p.styles.cardBgColor }}>
      <div className="flex items-center gap-2">
        {[Twitter, Instagram, Github].map((Icon, i) => (
          <span key={i} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer transition">
            <Icon size={14} />
          </span>
        ))}
      </div>
      <p.Selectable elementId="title">
        <span className="font-extrabold text-xs uppercase tracking-widest text-slate-500">{p.block.title || 'Social.Corp'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-4 text-xs text-slate-400 font-semibold">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" className="px-3 py-1.5 border border-slate-700 rounded-md font-bold text-[10px] text-slate-300 hover:text-white transition">{p.block.btnText || 'Contact Us'}</button>
      </p.Selectable>
    </div>
  ),

  /** 08 · Double deck — announcement bar + main row */
  'nav-double-header': (p) => (
    <div className="w-full flex flex-col border-b border-slate-800">
      <div className="bg-blue-600 text-white text-[10px] font-black tracking-wider uppercase py-2 px-3 text-center flex items-center justify-center gap-1.5">
        <Rocket size={11} />
        <span>{p.block.badge || 'New — the latest collection is live'}</span>
        <span className="underline hover:opacity-85 cursor-pointer ml-1 flex items-center gap-0.5">EXPLORE <ArrowRight size={10} /></span>
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-950">
        <p.Selectable elementId="title">
          <span className="font-extrabold text-sm">{p.block.title || 'DoubleDeck'}</span>
        </p.Selectable>
        <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-400">
          {linkRow(p, 'flex items-center gap-5')}
        </p.Selectable>
        <p.Selectable elementId="button">
          <button type="button" onClick={p.runAction} className="px-3.5 py-1.5 bg-white text-slate-950 rounded-lg font-black text-[10px] hover:opacity-90 transition">
            {p.block.btnText || 'Explore'}
          </button>
        </p.Selectable>
      </div>
    </div>
  ),

  /** 09 · Retro mono — brutalist wireframe */
  'nav-retro-mono': (p) => (
    <div className="flex items-center justify-between p-3 border-4 border-black bg-white text-black font-mono">
      <p.Selectable elementId="title">
        <span className="font-black text-sm uppercase tracking-tight">[ {p.block.title || 'BRUTAL_MONO'} ]</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-4 text-xs font-bold uppercase">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:underline cursor-pointer">
            _{link.label.toUpperCase().replace(/\s+/g, '_')}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" className="px-4 py-2 border-2 border-black font-bold text-xs bg-[#ffff00] active:translate-y-0.5 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {p.block.btnText || 'GO_LIVE'}
        </button>
      </p.Selectable>
    </div>
  ),

  /** 10 · Pill shaped — floating capsule */
  'nav-pill-shaped': (p) => (
    <div className="max-w-md mx-auto p-2 bg-slate-950/80 border border-slate-800 rounded-full shadow-2xl flex items-center justify-between px-4">
      <p.Selectable elementId="title">
        <span className="font-bold text-[10px] tracking-widest text-slate-300 uppercase">{p.block.title || 'Capsule'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="flex gap-3 text-[10px] text-slate-400 font-semibold">
        {p.links.slice(0, 2).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" onClick={p.runAction} className="bg-white text-slate-950 rounded-full font-black text-[10px] px-3.5 py-1.5 hover:opacity-95 transition">
          {p.block.btnText || 'Ping'}
        </button>
      </p.Selectable>
    </div>
  ),

  /** 11 · Blur reveal — frosted bar with live indicator */
  'nav-blur-reveal': (p) => (
    <div className="flex items-center justify-between p-4 rounded-xl border border-blue-500/10 bg-slate-950/80 shadow-[0_0_25px_-5px_rgba(59,130,246,0.15)]">
      <p.Selectable elementId="title">
        <span className="font-extrabold text-sm flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          <span>{p.block.title || 'NovaGlow'}</span>
        </span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-300">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-blue-400 cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" onClick={p.runAction} className="px-4 py-2 bg-slate-900 border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 font-bold text-xs rounded-lg transition">
          {p.block.btnText || 'Enter'}
        </button>
      </p.Selectable>
    </div>
  ),

  /** 12 · With avatar — profile portal */
  'nav-with-avatar': (p) => (
    <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
      <p.Selectable elementId="title">
        <span className="font-black text-sm tracking-tight text-white">{p.block.title || 'OnlyAdmin'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-400">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <div className="flex items-center gap-3">
        <span className="hidden @sm:block text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">{p.block.badge || 'ONLINE'}</span>
        <div className="h-4 w-px bg-slate-800" />
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
          className="w-8 h-8 rounded-full border border-slate-700 object-cover"
          alt="User"
        />
      </div>
    </div>
  ),

  /** 13 · Dark neon — gradient aura */
  'nav-dark-neon': (p) => (
    <div className="flex items-center justify-between p-4 bg-slate-950 border border-violet-500/20 shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)] rounded-xl">
      <p.Selectable elementId="title">
        <span className="font-black text-xs tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase">
          {p.block.title || 'Cosmos'}
        </span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-400 font-semibold">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-fuchsia-400 cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" onClick={p.runAction} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold text-xs rounded-lg transition shadow-[0_0_15px_rgba(139,92,246,0.4)]">
          {p.block.btnText || 'Sync'}
        </button>
      </p.Selectable>
    </div>
  ),

  /** 14 · Badge alert — promo badge next to CTA */
  'nav-badge-alert': (p) => (
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <p.Selectable elementId="title">
        <span className="font-black text-sm text-slate-200">{p.block.title || 'Storefront'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-400">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <div className="flex items-center gap-3">
        <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest animate-pulse">
          {p.block.badge || 'HOT SALE'}
        </span>
        <p.Selectable elementId="button">
          <button type="button" onClick={p.runAction} className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-500 transition">
            {p.block.btnText || 'Buy Now'}
          </button>
        </p.Selectable>
      </div>
    </div>
  ),

  /** 15 · Burger only — minimal hamburger */
  'nav-burger-only': (p) => (
    <div className="flex items-center justify-between p-4" style={{ backgroundColor: p.styles.cardBgColor }}>
      <p.Selectable elementId="title">
        <span className="font-extrabold text-xs tracking-wider opacity-70 uppercase">{p.block.title || 'MenuOnly'}</span>
      </p.Selectable>
      <button type="button" aria-label="Open menu" className="flex flex-col gap-1 w-6 cursor-pointer group">
        <span className="h-0.5 w-full bg-slate-300 group-hover:bg-blue-500 transition-all duration-300" />
        <span className="h-0.5 w-full bg-slate-300 group-hover:bg-blue-500 transition-all duration-300" />
        <span className="h-0.5 w-full bg-slate-300 group-hover:bg-blue-500 transition-all duration-300" />
      </button>
    </div>
  ),

  /** 16 · With phone — hotline quick-dial */
  'nav-with-phone': (p) => (
    <div className="flex items-center justify-between p-4" style={{ backgroundColor: p.styles.cardBgColor, borderBottom: `1.5px solid ${p.styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
      <p.Selectable elementId="title">
        <span className="font-black text-sm">{p.block.title || 'CallClinic'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-400">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" onClick={() => p.onNavigate(`tel:${p.block.contactPhone}`)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition">
          <Phone size={12} fill="currentColor" /> {p.block.contactPhone || p.block.btnText || '+91 98840 12003'}
        </button>
      </p.Selectable>
    </div>
  ),

  /** 17 · Gradient border — shifting accent underline */
  'nav-gradient-border': (p) => (
    <div className="w-full relative flex flex-col">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />
      <div className="flex items-center justify-between p-4 bg-slate-950">
        <p.Selectable elementId="title">
          <span className="font-extrabold text-sm">{p.block.title || 'BorderGlow'}</span>
        </p.Selectable>
        <p.Selectable elementId="subtitle" className="hidden @md:flex gap-4 text-xs font-bold text-slate-300">
          {p.links.slice(0, 3).map((link, i) => (
            <button
              key={link.id}
              type="button"
              data-navigation-link="true"
              onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }}
              className={i === 0 ? 'border-b-2 border-blue-500 pb-0.5' : 'hover:text-blue-500 cursor-pointer'}
            >
              {link.label}
            </button>
          ))}
        </p.Selectable>
        <p.Selectable elementId="button">
          <button type="button" onClick={p.runAction} className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs rounded-lg hover:opacity-90 transition">
            {p.block.btnText || 'Get Started'}
          </button>
        </p.Selectable>
      </div>
    </div>
  ),

  /** 18 · Language picker — globe dropdown */
  'nav-language-picker': (p) => (
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <p.Selectable elementId="title">
        <span className="font-black text-sm">{p.block.title || 'GlobalHQ'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-400">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2 py-1 rounded">
        <Globe size={12} className="text-slate-400" />
        <select aria-label="Language" className="bg-transparent text-[10px] text-slate-300 font-extrabold outline-none cursor-pointer">
          <option value="en">ENGLISH (US)</option>
          <option value="hi">HINDI (IN)</option>
          <option value="ka">KANNADA (KA)</option>
        </select>
      </div>
    </div>
  ),

  /** 19 · E-commerce cart — cart count + links */
  'nav-ecommerce-cart': (p) => (
    <div className="flex items-center justify-between p-4" style={{ backgroundColor: p.styles.cardBgColor }}>
      <p.Selectable elementId="title">
        <span className="font-black text-sm">{p.block.title || 'ShopKart'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs text-slate-400">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </p.Selectable>
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer text-slate-300 hover:text-white transition">
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">3</div>
          <ShoppingCart size={20} />
        </div>
        <p.Selectable elementId="button">
          <button type="button" className="px-3.5 py-1.5 bg-slate-800 text-white font-extrabold text-[11px] rounded">{p.block.btnText || 'Checkout'}</button>
        </p.Selectable>
      </div>
    </div>
  ),

  /** 20 · Command-K — spotlight search bar */
  'nav-command-k': (p) => (
    <div className="flex items-center justify-between p-3 px-5 bg-slate-950 border border-slate-800 rounded-2xl max-w-xl mx-auto">
      <p.Selectable elementId="title">
        <span className="font-bold text-xs tracking-wider uppercase text-blue-500">{p.block.title || 'OnlySearch'}</span>
      </p.Selectable>
      <button type="button" onClick={p.runAction} className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md font-mono hover:border-slate-600 transition">
        <Search size={11} />
        <span>Search {p.links.length} pages</span>
        <span className="bg-slate-950 border border-slate-700 px-1 rounded text-slate-300">⌘K</span>
      </button>
    </div>
  ),

  /** 21 · Glowing glow — futuristic cyber rail */
  'nav-glowing-glow': (p) => (
    <div className="flex items-center justify-between p-4 bg-slate-950 border-b-2 border-cyan-500/40 shadow-[0_4px_30px_rgba(6,182,212,0.1)]">
      <p.Selectable elementId="title">
        <span className="font-mono text-xs font-black tracking-widest text-cyan-400 uppercase">{p.block.title || 'CYBER.NET'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="hidden @md:flex items-center gap-5 text-xs font-mono text-slate-400">
        {p.links.slice(0, 3).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-cyan-400 cursor-pointer transition">
            {link.label.toUpperCase()}
          </button>
        ))}
      </p.Selectable>
      <p.Selectable elementId="button">
        <button type="button" onClick={p.runAction} className="px-4 py-2 bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold text-xs rounded transition uppercase tracking-widest font-mono">
          {p.block.btnText || 'CONNECT'}
        </button>
      </p.Selectable>
    </div>
  ),
};

// =====================================================================
// FOOTER LAYOUTS (21)
// =====================================================================

const footerColLinks = (p: ChromeLayoutProps, title: string) => (
  <div className="space-y-3">
    <h5 className="font-extrabold text-[10px] text-slate-200 uppercase tracking-widest">{title}</h5>
    <ul className="space-y-1.5 text-[11px] text-slate-400 font-semibold">
      {p.links.slice(0, 5).map((link) => (
        <li key={link.id}>
          <button type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="cursor-pointer transition hover:text-blue-400">
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const footerContact = (p: ChromeLayoutProps) => (
  <div className="space-y-3">
    <h5 className="font-extrabold text-[10px] text-slate-200 uppercase tracking-widest">Contact</h5>
    <ul className="space-y-1.5 text-[11px] text-slate-400 font-semibold">
      <li>{p.block.contactPhone || p.site?.theme?.phone || '+91 98765 43210'}</li>
      <li>{p.block.contactEmail || p.site?.theme?.email || 'hello@onlypage.in'}</li>
      <li>{p.block.contactAddress || p.site?.theme?.address || 'India'}</li>
    </ul>
  </div>
);

const footerLegal = (p: ChromeLayoutProps) => (
  <div className="space-y-3">
    <h5 className="font-extrabold text-[10px] text-slate-200 uppercase tracking-widest">Legal</h5>
    <ul className="space-y-1.5 text-[11px] text-slate-400 font-semibold">
      <li><button type="button" onClick={() => p.onNavigate('privacy')} className="transition hover:text-blue-400">Privacy</button></li>
      <li><button type="button" onClick={() => p.onNavigate('terms')} className="transition hover:text-blue-400">Terms</button></li>
    </ul>
  </div>
);

const footerCopyright = (p: ChromeLayoutProps) =>
  (p.block as any).copyright || `© ${new Date().getFullYear()} ${p.block.title || 'OnlyPage'}. All rights reserved.`;

export const FOOTER_LAYOUTS: Record<string, FooterFC> = {
  /** 01 · Classic — 4-column directory with real links */
  'footer-classic': (p) => (
    <div className="p-8 text-left space-y-12 bg-slate-950 border border-slate-800 rounded-2xl">
      <div className="grid grid-cols-2 @md:grid-cols-4 gap-8">
        <div className="space-y-4 col-span-2 @md:col-span-1">
          <p.Selectable elementId="title">
            <h4 className="font-black text-base text-white">{p.block.title || 'OnlyPage'}</h4>
          </p.Selectable>
          <p.Selectable elementId="subtitle">
            <p className="text-[11px] text-slate-400 leading-relaxed">{p.block.subtitle || 'Build elegant websites, schedule reservations and gather feedback easily.'}</p>
          </p.Selectable>
        </div>
        {footerColLinks(p, 'Pages')}
        {footerContact(p)}
        {footerLegal(p)}
      </div>
      <div className="border-t border-slate-800 pt-6 flex flex-col @md:flex-row items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <span>{footerCopyright(p)}</span>
        <div className="flex gap-4 mt-3 @md:mt-0">
          {(p.links.length > 0 ? p.links : [{ id: 'd1', label: 'Privacy' }, { id: 'd2', label: 'Terms' }]).map((link) => (
            <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-slate-300 cursor-pointer">
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  ),

  /** 02 · Minimal — single row ribbon */
  'footer-minimal': (p) => (
    <div className="p-4 flex flex-col @sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: p.styles.cardBgColor, borderTop: `1px solid ${p.styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
      <p.Selectable elementId="title">
        <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">{p.block.title || 'MINIMAL.FOOT'}</span>
      </p.Selectable>
      <p.Selectable elementId="subtitle">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{footerCopyright(p)}</span>
      </p.Selectable>
      <div className="flex gap-2">
        {[Twitter, Github].map((Icon, i) => (
          <span key={i} className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer transition">
            <Icon size={13} />
          </span>
        ))}
      </div>
    </div>
  ),

  /** 03 · Brand huge — ultra-display branding */
  'footer-brand-huge': (p) => (
    <div className="p-10 text-left bg-slate-950 border border-slate-900 rounded-3xl space-y-12">
      <div className="grid grid-cols-2 @md:grid-cols-3 gap-6">
        {['Pages', 'Sitemap', 'Company'].map((col, cIdx) => (
          <div key={cIdx} className="space-y-3">
            <h5 className="font-extrabold text-[10px] text-blue-500 tracking-wider uppercase">{col}</h5>
            <ul className="space-y-1 text-xs text-slate-400">
              {cIdx === 0
                ? p.links.slice(0, 4).map((link) => (
                    <li key={link.id}>
                      <button type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer">
                        {link.label}
                      </button>
                    </li>
                  ))
                : (cIdx === 1 ? ['About', 'Careers', 'Press'] : ['Contact', 'Partners']).map((label) => (
                    <li key={label}>
                      <button type="button" onClick={() => p.onNavigate(label.toLowerCase())} className="hover:text-white cursor-pointer">{label}</button>
                    </li>
                  ))}
            </ul>
          </div>
        ))}
      </div>
      <p.Selectable elementId="title">
        <h1 className="text-6xl @md:text-8xl font-black text-slate-800 tracking-tight leading-none mt-8 select-none hover:text-blue-500/20 transition duration-300 uppercase">
          {p.block.title || 'ONLYPAGE'}
        </h1>
      </p.Selectable>
    </div>
  ),

  /** 04 · Retro wire — brutalist outline */
  'footer-retro-wire': (p) => (
    <div className="border-4 border-black p-6 bg-white text-black text-left font-mono space-y-6">
      <p.Selectable elementId="title">
        <h4 className="font-black text-base uppercase">_INDEX: {p.block.title || 'RETRO_WIRE'}</h4>
      </p.Selectable>
      <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase">
        <div>
          <h5 className="border-b-2 border-black pb-1">_PAGES</h5>
          <ul className="mt-2 space-y-1">
            {p.links.slice(0, 4).map((link) => (
              <li key={link.id}>
                <button type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:underline cursor-pointer">
                  {"•"} {link.label.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="border-b-2 border-black pb-1">_CONTACT</h5>
          <ul className="mt-2 space-y-1">
            <li>{p.block.contactEmail || 'HELLO@ONLYPAGE.IN'}</li>
            <li>{p.block.contactPhone || '+91 98765 43210'}</li>
          </ul>
        </div>
      </div>
      <div className="text-[10px] font-black border-t-2 border-black pt-4">{footerCopyright(p).toUpperCase()}</div>
    </div>
  ),

  /** 05 · Newsletter focus — high-impact subscription */
  'footer-newsletter-focus': (p) => (
    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
      <p.Selectable elementId="title">
        <h3 className="text-lg font-black text-white">{p.block.title || 'Stay Ahead of the Curve'}</h3>
      </p.Selectable>
      <p.Selectable elementId="subtitle" className="max-w-md mx-auto">
        <p className="text-xs text-slate-400">{p.block.subtitle || 'Subscribe for product updates, templates and drops.'}</p>
      </p.Selectable>
      <div className="max-w-sm mx-auto flex gap-2">
        <input type="email" aria-label="Email address" placeholder="enter email..." className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500" />
        <p.Selectable elementId="button">
          <button type="button" onClick={p.runAction} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition uppercase tracking-wider">
            {p.block.btnText || 'Join'}
          </button>
        </p.Selectable>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider pt-2 border-t border-slate-800/60">
        {p.links.slice(0, 4).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-slate-300 cursor-pointer">
            {link.label}
          </button>
        ))}
      </div>
    </div>
  ),

  /** 06 · Social wall — grid of imagery */
  'footer-social-wall': (p) => (
    <div className="p-6 text-left space-y-6" style={{ backgroundColor: p.styles.cardBgColor }}>
      <h5 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500">FOLLOW THE WORK</h5>
      <div className="grid grid-cols-4 gap-2">
        {[
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=120',
        ].map((url, uIdx) => (
          <div key={uIdx} className="aspect-square bg-slate-900 overflow-hidden rounded-lg border border-slate-800">
            <img src={url} className="w-full h-full object-cover hover:scale-110 transition duration-300" alt="Social preview" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-4">
        <p.Selectable elementId="title">
          <span className="text-xs font-black text-slate-300">{p.block.title || '@brand'}</span>
        </p.Selectable>
        <p className="text-[10px] text-slate-500 font-bold tracking-wide">{footerCopyright(p)}</p>
      </div>
    </div>
  ),

  /** 07 · Compact badge — trust badges */
  'footer-compact-badge': (p) => (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex flex-col @sm:flex-row items-center justify-between gap-4">
      <div className="text-left">
        <span className="font-extrabold text-xs text-white">{p.block.title || 'OnlyPage secured'}</span>
        <p className="text-[10px] text-slate-500 mt-1">{footerCopyright(p)}</p>
      </div>
      <div className="flex gap-3">
        <span className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-emerald-500 font-extrabold tracking-wider flex items-center gap-1.5">
          <Lock size={11} /> SSL ENCRYPTED
        </span>
        <span className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-blue-500 font-extrabold tracking-wider flex items-center gap-1.5">
          <CreditCard size={11} /> SECURE PAYMENTS
        </span>
      </div>
    </div>
  ),

  /** 08 · Three col CTA — mini CTA banner above links */
  'footer-three-col-cta': (p) => (
    <div className="w-full space-y-8 text-left">
      <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl flex flex-col @sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-sm text-white">{p.block.title || 'Create your professional visual space.'}</h4>
          <p className="text-[10px] text-slate-300 mt-0.5">{p.block.subtitle || 'Publish your site live in minutes.'}</p>
        </div>
        <p.Selectable elementId="button">
          <button type="button" onClick={p.runAction} className="px-4 py-2 bg-white text-slate-950 font-bold text-xs rounded-lg shadow-xl hover:opacity-90 transition">
            {p.block.btnText || 'Launch Now'}
          </button>
        </p.Selectable>
      </div>
      <div className="grid grid-cols-1 @sm:grid-cols-3 gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-extrabold border-t border-slate-800 pt-6">
        <span>{footerCopyright(p)}</span>
        <span className="text-center">{p.links[0]?.label?.toUpperCase() || 'PAGES'}</span>
        <span className="text-right">{p.block.contactAddress || 'INDIA'}</span>
      </div>
    </div>
  ),

  /** 09 · Dark cosmos — radial spotlight */
  'footer-dark-cosmos': (p) => (
    <div className="p-8 text-center bg-slate-950 relative overflow-hidden rounded-2xl border border-violet-500/15 shadow-[0_-10px_40px_rgba(139,92,246,0.1)]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <p.Selectable elementId="title">
        <h4 className="font-black text-base text-violet-400 uppercase tracking-wider mb-2">{p.block.title || 'Cosmic Deck'}</h4>
      </p.Selectable>
      <p.Selectable elementId="subtitle">
        <p className="text-[10px] text-slate-400 max-w-sm mx-auto mb-6">{p.block.subtitle || 'Designed with precision for builders and dreamers.'}</p>
      </p.Selectable>
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent w-full my-4" />
      <div className="flex flex-wrap justify-center gap-3 text-[10px] font-mono text-slate-500 mb-4">
        {p.links.slice(0, 4).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-violet-300 cursor-pointer">
            {link.label.toUpperCase()}
          </button>
        ))}
      </div>
      <span className="text-[10px] font-mono text-slate-600">{footerCopyright(p)}</span>
    </div>
  ),

  /** 10 · Accordion — collapsible columns */
  'footer-accordion': (p) => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);
    const groups = [
      { title: '01. PAGES', items: p.links.slice(0, 5) },
      { title: '02. CONTACT', items: [{ id: 'c1', label: p.block.contactEmail || 'hello@onlypage.in' }, { id: 'c2', label: p.block.contactPhone || '+91 98765 43210' }] },
      { title: '03. LEGAL', items: [{ id: 'l1', label: 'Privacy' }, { id: 'l2', label: 'Terms' }] },
    ];
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-left">
        {groups.map((group, gIdx) => (
          <div key={group.title} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <button type="button" className="w-full flex justify-between items-center cursor-pointer hover:border-slate-700" onClick={() => setOpenIdx(openIdx === gIdx ? null : gIdx)}>
              <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">{group.title}</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${openIdx === gIdx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === gIdx && (
              <ul className="mt-2 space-y-1 text-[11px] text-slate-400 font-semibold">
                {group.items.map((item: ChromeLink) => (
                  <li key={item.id}>
                    <button type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(item.url); }} className="hover:text-white cursor-pointer transition">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <p className="pt-2 text-[10px] text-slate-500 text-center">{footerCopyright(p)}</p>
      </div>
    );
  },

  /** 11 · Split legal — legal links + status */
  'footer-split-legal': (p) => (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col @md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      <div className="flex gap-4">
        {(p.links.length > 0 ? p.links : [{ id: 'd1', label: 'Privacy Charter' }, { id: 'd2', label: 'Cookie Settings' }, { id: 'd3', label: 'TOS' }]).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-white cursor-pointer">
            {link.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] text-slate-300 font-mono">ALL SYSTEMS RUNNING</span>
      </div>
    </div>
  ),

  /** 12 · With map — location blueprint */
  'footer-with-map': (p) => (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 @md:grid-cols-2 gap-6 text-left">
      <div className="aspect-video bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
        <MapPin size={32} className="text-slate-600" />
        <span className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
          {p.block.contactAddress || p.block.mapAddress || 'Headquarters, India'}
        </span>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <p.Selectable elementId="title">
            <h4 className="font-extrabold text-sm text-white">{p.block.title || 'Location Headquarters'}</h4>
          </p.Selectable>
          <p.Selectable elementId="subtitle">
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{p.block.subtitle || 'Visit our studio, or reach us any day of the week.'}</p>
          </p.Selectable>
        </div>
        <div className="mt-4 space-y-1 text-[11px] text-slate-400 font-semibold">
          <p>{p.block.contactEmail || 'hello@onlypage.in'}</p>
          <p>{p.block.contactPhone || '+91 98765 43210'}</p>
        </div>
      </div>
    </div>
  ),

  /** 13 · Bento footer — asymmetrical grid */
  'footer-bento-footer': (p) => (
    <div className="grid grid-cols-1 @md:grid-cols-3 gap-4 text-left">
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl @md:col-span-2 space-y-2">
        <p.Selectable elementId="title">
          <h4 className="font-black text-sm text-white">{p.block.title || 'OnlyPage Builder'}</h4>
        </p.Selectable>
        <p className="text-[11px] text-slate-400">{p.block.subtitle || 'Stack layout pieces, custom styles, and publish instantly.'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
          {p.links.slice(0, 5).map((link) => (
            <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="text-[10px] text-slate-500 hover:text-white cursor-pointer transition">
              {link.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-xl flex flex-col justify-between">
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">WIDGET</span>
        <div className="space-y-3">
          <p className="text-[10px] text-slate-400">{footerCopyright(p)}</p>
          <p.Selectable elementId="button">
            <button type="button" onClick={p.runAction} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[10px] shadow transition">
              {p.block.btnText || 'Launch Platform'}
            </button>
          </p.Selectable>
        </div>
      </div>
    </div>
  ),

  /** 14 · Multilingual — locale select */
  'footer-multilingual': (p) => (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col @sm:flex-row items-center justify-between gap-4">
      <span className="text-[10px] font-bold text-slate-400">{footerCopyright(p)}</span>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {p.links.slice(0, 4).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </div>
      <div className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
        <Globe size={12} className="text-slate-400" /> LOCALE:
        <select aria-label="Locale" className="bg-transparent outline-none cursor-pointer text-blue-400">
          <option value="en">ENGLISH</option>
          <option value="hi">HINDI</option>
        </select>
      </div>
    </div>
  ),

  /** 15 · Quick booking — schedule selector */
  'footer-quick-booking': (p) => (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-4">
      <p.Selectable elementId="title">
        <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">{p.block.title || 'Instant Schedule'}</h4>
      </p.Selectable>
      <div className="flex flex-wrap gap-2 max-w-sm">
        <input type="date" aria-label="Booking date" className="bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none focus:border-blue-500" />
        <p.Selectable elementId="button">
          <button type="button" onClick={p.runAction} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded transition">
            {p.block.btnText || 'Lock Seat'}
          </button>
        </p.Selectable>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-slate-800/60">
        {p.links.slice(0, 4).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="text-[10px] text-slate-500 hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </div>
    </div>
  ),

  /** 16 · Trustpilot rating — star panel */
  'footer-trustpilot-rating': (p) => (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col @sm:flex-row items-center justify-between gap-4 text-left">
      <div>
        <h5 className="font-black text-xs text-white">Rated Excellent by our customers</h5>
        <div className="flex gap-1 mt-1 text-emerald-500 text-xs">
          {Array.from({ length: 5 }).map((_, rIdx) => <span key={rIdx}>★</span>)}
          <span className="text-slate-400 ml-1 text-[10px] font-bold">4.9 / 5.0</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">{p.block.subtitle || footerCopyright(p)}</p>
      </div>
      <span className="text-[10px] text-slate-500 font-mono tracking-wider font-black uppercase">{p.block.btnText || 'TRUSTED BY 12,500+ USERS'}</span>
    </div>
  ),

  /** 17 · Back to top — anchor ribbon */
  'footer-with-backtotop': (p) => (
    <div className="p-4 flex flex-col @sm:flex-row items-center justify-between gap-3" style={{ backgroundColor: p.styles.cardBgColor, borderTop: `1px solid ${p.styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{footerCopyright(p)}</span>
      <div className="flex items-center gap-3">
        <div className="hidden @md:flex gap-3">
          {p.links.slice(0, 3).map((link) => (
            <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="text-[10px] text-slate-500 hover:text-white cursor-pointer transition">
              {link.label}
            </button>
          ))}
        </div>
        <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition">
          <ArrowUp size={15} />
        </button>
      </div>
    </div>
  ),

  /** 18 · Gradient glow — horizon separator */
  'footer-gradient-glow': (p) => (
    <div className="w-full space-y-4">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full" />
      <div className="p-4 flex flex-col @sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-mono">
        <span>{footerCopyright(p)}</span>
        <div className="flex gap-4">
          {p.links.slice(0, 3).map((link) => (
            <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="hover:text-cyan-400 cursor-pointer transition">
              {link.label.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="text-cyan-400 tracking-widest font-bold">{p.block.badge || 'HORIZON LIVE'}</span>
      </div>
    </div>
  ),

  /** 19 · Jobs hiring — careers flag */
  'footer-jobs-hiring': (p) => (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col @sm:flex-row items-center justify-between gap-4 text-left">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-extrabold text-white">{p.block.title || 'We are hiring!'}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {p.links.slice(0, 4).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="text-[10px] text-slate-500 hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </div>
      <span className="text-[10px] text-blue-500 font-black underline cursor-pointer">{p.block.btnText || 'VIEW OPENINGS'} {"→"}</span>
    </div>
  ),

  /** 20 · Social pill — capsule sharing row */
  'footer-social-pill': (p) => (
    <div className="p-6 text-center space-y-4 bg-slate-950 border border-slate-900 rounded-3xl">
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { Icon: Twitter, label: 'TWITTER', cls: 'text-blue-400 border-blue-500/20 bg-blue-500/10' },
          { Icon: Instagram, label: 'INSTAGRAM', cls: 'text-pink-400 border-pink-500/20 bg-pink-500/10' },
          { Icon: MessageCircle, label: 'WHATSAPP', cls: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
        ].map(({ Icon, label, cls }, i) => (
          <span key={i} className={`px-3 py-1.5 border ${cls} text-[10px] font-black rounded-full cursor-pointer hover:opacity-80 transition flex items-center gap-1.5`}>
            <Icon size={11} /> {label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {p.links.slice(0, 4).map((link) => (
          <button key={link.id} type="button" data-navigation-link="true" onClick={(e) => { e.stopPropagation(); p.onNavigate(link.url); }} className="text-[10px] text-slate-500 hover:text-white cursor-pointer transition">
            {link.label}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{footerCopyright(p)}</p>
    </div>
  ),

  /** 21 · Copyright only — super-minimal rail */
  'footer-copyright-only': (p) => (
    <div className="p-3 border-t border-slate-800/40 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
      {footerCopyright(p)}
    </div>
  ),
};

// Both registries in one map for the fallback lookup used by the renderer
export const CHROME_LAYOUTS: Record<string, React.FC<ChromeLayoutProps>> = {
  ...NAV_LAYOUTS,
  ...FOOTER_LAYOUTS,
};
