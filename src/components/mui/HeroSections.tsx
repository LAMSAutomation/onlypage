import React from 'react';
import { ArrowRight, PlayCircle, Rocket } from 'lucide-react';

export interface MuiHeroProps {
  badgeText?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  styles?: any;
  block?: any;
}

export const MuiHero: React.FC<MuiHeroProps> = ({
  badgeText,
  title,
  description,
  primaryCtaText,
  secondaryCtaText,
  styles = {},
  block
}) => {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 @sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 @lg:grid-cols-2">
          <div>
            {block?.showBadge !== false && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset"
                style={{
                  backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#eff6ff',
                  color: styles.accentColor || '#1d4ed8',
                  boxShadow: styles.accentColor ? `inset 0 0 0 1px ${styles.accentColor}33` : 'inset 0 0 0 1px #dbeafe'
                }}
              >
                <Rocket size={13} />
                {badgeText || block?.badge || 'Material Design'}
              </div>
            )}
            <h1 className="text-4xl @sm:text-5xl @lg:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: styles.textColor || '#0f172a' }}>
              {title || 'Build faster with a familiar design language.'}
            </h1>
            <p className="text-base @sm:text-lg font-medium leading-relaxed mt-5 max-w-xl" style={{ color: styles.subtitleColor || '#475569' }}>
              {description || 'A structured layout with elevation, color surfaces, and clear hierarchy — trusted by product teams worldwide.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                style={{ backgroundColor: styles.accentColor || '#2563eb', color: '#ffffff', boxShadow: styles.accentColor ? `0 10px 15px -3px ${styles.accentColor}40` : '0 10px 15px -3px rgba(37,99,235,0.25)' }}
              >
                {primaryCtaText || block?.btnText || 'Get Started'}
                <ArrowRight size={16} />
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold shadow-sm ring-1 ring-inset transition-all hover:bg-slate-50"
                style={{ color: styles.textColor || '#334155', boxShadow: styles.cardBorderColor ? `inset 0 0 0 1px ${styles.cardBorderColor}` : 'inset 0 0 0 1px #e2e8f0' }}
              >
                <PlayCircle size={17} style={{ color: styles.accentColor || '#2563eb' }} />
                {secondaryCtaText || block?.secondaryBtnText || 'Watch Demo'}
              </button>
            </div>
          </div>

          {/* Material surface mock */}
          <div className="relative">
            <div className="rounded-2xl shadow-xl ring-1"
              style={{ backgroundColor: styles.cardBgColor || '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', borderColor: styles.cardBorderColor || '#f1f5f9', padding: '1.5rem' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: styles.textColor || '#1e293b' }}>Monthly overview</span>
                <span className="rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset"
                  style={{ backgroundColor: '#ecfdf5', color: '#047857', boxShadow: 'inset 0 0 0 1px #d1fae5' }}
                >
                  +24.5%
                </span>
              </div>
              <div className="flex h-40 items-end gap-3">
                {[42, 65, 50, 78, 62, 88, 72, 96].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md transition-colors" style={{ height: `${h}%`, backgroundColor: styles.accentColor ? (i % 2 === 0 ? `${styles.accentColor}80` : styles.accentColor) : (i % 2 === 0 ? '#93c5fd' : '#3b82f6') }} />
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: styles.cardBorderColor || '#f1f5f9' }}>
                {[
                  { label: 'Revenue', value: '$48.2k' },
                  { label: 'Users', value: '12,480' },
                  { label: 'Conversion', value: '3.8%' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-sm font-bold" style={{ color: styles.textColor || '#0f172a' }}>{s.value}</div>
                    <div className="text-[11px] font-medium" style={{ color: styles.subtitleColor || '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl px-4 py-3 shadow-2xl @sm:block"
              style={{ backgroundColor: styles.textColor || '#0f172a', color: '#ffffff' }}
            >
              <div className="text-xs font-bold">Material surface</div>
              <div className="text-[11px] opacity-70">Dynamic color · Motion · Elevation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
