import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface UntitledCTAProps {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  styles?: any;
  block?: any;
}

export const UntitledCTA: React.FC<UntitledCTAProps> = ({
  title,
  description,
  primaryCtaText,
  secondaryCtaText,
  styles = {},
  block
}) => {
  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 text-center">
        {block?.badge && block?.showBadge !== false && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: styles.badgeBgColor || '#111827', color: styles.badgeTextColor || '#9ca3af', borderColor: '#1f2937' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: styles.accentColor || '#6366f1' }} />
            {block.badge}
          </div>
        )}
        <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>
          {title || 'Start building today.'}
        </h2>
        <p className="text-base @sm:text-lg font-medium leading-relaxed mx-auto mt-5 max-w-xl" style={{ color: styles.subtitleColor || '#9ca3af' }}>
          {description || 'Launch your site faster with our robust component system.'}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: styles.buttonBgColor || '#4f46e5', color: styles.buttonTextColor || '#ffffff' }}>
            {primaryCtaText || 'Get started'}
            <ArrowRight size={15} />
          </button>
          {secondaryCtaText && (
            <button className="rounded-lg border border-gray-800 px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-800" style={{ backgroundColor: '#111827', color: '#d1d5db' }}>
              {secondaryCtaText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
