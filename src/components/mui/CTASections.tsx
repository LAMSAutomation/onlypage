import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface MuiCTAProps {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  styles?: any;
  block?: any;
}

export const MuiCTA: React.FC<MuiCTAProps> = ({
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
        <div className="relative overflow-hidden rounded-2xl px-8 text-center shadow-2xl @sm:px-16"
          style={{ backgroundColor: styles.accentColor || '#2563eb', boxShadow: styles.accentColor ? `0 25px 50px -12px ${styles.accentColor}4D` : '0 25px 50px -12px rgba(37,99,235,0.3)' }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/10" />
          <div className="pointer-events-none absolute right-1/4 top-8 h-3 w-3 rounded-full bg-white/30" />
          <div className="pointer-events-none absolute bottom-10 left-1/4 h-2 w-2 rounded-full bg-white/40" />

          <div className="relative">
            <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight mx-auto max-w-2xl">{title || 'Ready to build something great?'}</h2>
            <p className="text-base @sm:text-lg font-medium leading-relaxed mx-auto mt-4 max-w-xl opacity-90">{description || 'Join thousands of creators shipping beautiful sites with us. Your first site is free — no credit card required.'}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-bold shadow-xl transition-all hover:bg-slate-50 active:scale-[0.98]"
                style={{ color: styles.accentColor || '#1d4ed8' }}
              >
                {primaryCtaText || block?.btnText || 'Create Free Account'}
                <ArrowRight size={16} />
              </button>
              <button className="rounded-lg bg-black/10 px-7 py-3.5 text-sm font-bold text-white ring-1 ring-inset ring-white/30 backdrop-blur transition-all hover:bg-black/20">
                {secondaryCtaText || block?.secondaryBtnText || 'Talk to Sales'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
