import React from 'react';
import { ArrowRight, Rocket } from 'lucide-react';

export interface UiverseCTAProps {
  title?: string;
  description?: string;
  ctaText?: string;
  secondaryText?: string;
  styles?: any;
  block?: any;
}

export const UiverseCTA: React.FC<UiverseCTAProps> = ({
  title,
  description,
  ctaText,
  secondaryText,
  styles = {},
  block
}) => {
  return (
    <section className="px-4 @sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* animated gradient border wrapper */}
        <div className="group relative rounded-[2rem] p-[2px] transition-transform duration-300 hover:scale-[1.01]"
          style={{ background: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #2563eb, #06b6d4)` : 'linear-gradient(to right, #d946ef, #fbbf24, #22d3ee)' }}
        >
          <div className="relative overflow-hidden rounded-[calc(2rem-2px)] px-6 text-center @sm:px-12"
            style={{ backgroundColor: styles.cardBgColor || '#0f172a' }}
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}33` : 'rgba(217, 70, 239, 0.2)' }} />
            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: styles.buttonBgColor ? `${styles.buttonBgColor}26` : 'rgba(6, 182, 212, 0.15)' }} />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest"
                style={{ color: styles.accentColor || '#fcd34d' }}>
                <Rocket size={12} />
                {block?.badge || 'Launch in minutes'}
              </div>
              <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight mx-auto max-w-2xl"
                style={{ color: styles.textColor || '#ffffff' }}>
                {title || 'Ready to launch something electric?'}
              </h2>
              <p className="text-base @sm:text-lg font-medium leading-relaxed mx-auto mt-4 max-w-xl"
                style={{ color: styles.subtitleColor || '#94a3b8' }}>
                {description || 'Spin up a stunning, lightning-fast site in minutes — no code, no contracts, no limits.'}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <button className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-black transition-all hover:opacity-90 hover:shadow-2xl"
                  style={{ backgroundColor: styles.buttonBgColor || '#ffffff', color: styles.buttonTextColor || '#020617' }}>
                  {ctaText || block?.btnText || 'Get Started Free'}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <span className="text-xs font-semibold" style={{ color: styles.subtitleColor || '#64748b' }}>
                  {secondaryText || block?.secondaryBtnText || 'No credit card required'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
