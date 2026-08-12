import React from 'react';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export interface TailgridsHeroProps {
  badgeText?: string;
  title?: string;
  highlightTitle?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  features?: string[];
  imageSrc?: string;
  styles?: any;
  block?: any;
}

export const TailgridsHeroSplit: React.FC<TailgridsHeroProps> = ({
  badgeText,
  title,
  highlightTitle,
  description,
  primaryCtaText,
  secondaryCtaText,
  onPrimaryClick,
  onSecondaryClick,
  features,
  imageSrc,
  styles = {},
  block
}) => {
  const heroBadge = block?.showBadge !== false ? (badgeText || block?.badgeText || block?.badge) : null;
  const heroTitle = title || block?.title || 'Build Modern Web Applications';
  const heroHighlight = highlightTitle || block?.highlightTitle || 'Faster Than Ever';
  const heroDesc = description || block?.description || 'Empower your team with a complete set of pre-built UI components, section templates, and clean responsive layouts built with Tailwind CSS.';
  const heroFeatures = features || block?.features || ['No credit card required', '14-day free trial', 'Instant access'];
  const heroImg = imageSrc || block?.imageSrc || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 @sm:px-6 @lg:px-8">
        <div className="grid items-center gap-12 @lg:grid-cols-12 @lg:gap-8">
          <div className="flex flex-col items-start @lg:col-span-7">
            {heroBadge && (
              <span className="mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#e0e7ff', color: styles.accentColor || '#4338ca' }}
              >
                {heroBadge} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
            <h1 className="text-4xl @sm:text-5xl @lg:text-6xl font-extrabold tracking-tight leading-tight mb-6" style={{ color: styles.textColor || '#111827' }}>
              {heroTitle}{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #8b5cf6)` : 'linear-gradient(to right, #4f46e5, #8b5cf6)' }}>
                {heroHighlight}
              </span>
            </h1>
            <p className="text-base @sm:text-lg font-medium leading-relaxed mb-8 max-w-2xl" style={{ color: styles.subtitleColor || '#4b5563' }}>
              {heroDesc}
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onPrimaryClick}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90"
                style={{ backgroundColor: styles.accentColor || '#4f46e5' }}
              >
                {primaryCtaText || block?.primaryCtaText || 'Get Started Free'} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onSecondaryClick}
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-black/5"
                style={{ borderColor: styles.cardBorderColor || '#d1d5db', color: styles.textColor || '#374151' }}
              >
                <Play className="h-4 w-4" style={{ color: styles.accentColor || '#4f46e5', fill: styles.accentColor || '#4f46e5' }} /> {secondaryCtaText || block?.secondaryCtaText || 'Watch Demo'}
              </button>
            </div>
            {heroFeatures && heroFeatures.length > 0 && (
              <div className="flex flex-wrap items-center gap-6 border-t pt-4" style={{ borderColor: styles.cardBorderColor || '#f3f4f6' }}>
                {heroFeatures.map((feat: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center gap-2 text-xs font-medium" style={{ color: styles.subtitleColor || '#6b7280' }}>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {feat}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="relative @lg:col-span-5">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border shadow-2xl @lg:max-w-none" style={{ borderColor: styles.cardBorderColor || '#e5e7eb' }}>
              <img src={heroImg} alt="Hero preview" className="h-auto w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
