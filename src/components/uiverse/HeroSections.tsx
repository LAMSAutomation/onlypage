import React from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export interface UiverseHeroProps {
  badgeText?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  styles?: any;
  block?: any;
}

export const UiverseHero: React.FC<UiverseHeroProps> = ({
  badgeText,
  title,
  description,
  primaryCtaText,
  secondaryCtaText,
  styles = {},
  block
}) => {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}40` : 'rgba(192, 38, 211, 0.25)' }} />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ backgroundColor: styles.buttonBgColor ? `${styles.buttonBgColor}33` : 'rgba(6, 182, 212, 0.2)' }} />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}33` : 'rgba(79, 70, 229, 0.2)' }} />

      <div className="relative mx-auto max-w-4xl px-4 text-center @sm:px-6">
        {block?.showBadge !== false && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
            style={{ color: styles.accentColor || '#f9a8d4' }}>
            <Sparkles size={14} />
            {badgeText || block?.badge || '✨ Community Built'}
          </div>
        )}

        <h1 className="text-4xl @sm:text-5xl @lg:text-6xl font-extrabold tracking-tight leading-tight mx-auto max-w-3xl"
          style={{ color: styles.textColor || '#ffffff' }}>
          {title || 'Sections that feel alive.'}
        </h1>

        <p className="text-base @sm:text-lg font-medium leading-relaxed mx-auto mt-6 max-w-2xl"
          style={{ color: styles.subtitleColor || '#cbd5e1' }}>
          {description || 'Interactive glassmorphism components tuned for performance and smooth layouts.'}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: styles.accentColor || '#d946ef', color: '#ffffff' }}
          >
            {primaryCtaText || block?.btnText || 'Start Creating'}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10"
            style={{ color: styles.subtitleColor || '#e2e8f0' }}
          >
            <Zap size={15} style={{ color: styles.accentColor || '#fbbf24' }} />
            {secondaryCtaText || block?.secondaryBtnText || 'Browse Elements'}
          </button>
        </div>

        {/* Floating glass chips */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {['Drag & Drop', 'Responsive', 'Customizable', 'Fast'].map((chip) => (
            <div
              key={chip}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold backdrop-blur-md transition-colors"
              style={{ color: styles.subtitleColor || '#cbd5e1' }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
