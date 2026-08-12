import React from 'react';
import { Star } from 'lucide-react';

export interface UntitledTestimonialsProps {
  title?: string;
  description?: string;
  styles?: any;
  block?: any;
}

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      'We have been using OnlyPage for the past year and it has completely transformed how our team ships landing pages.',
    name: 'Olivia Rhye',
    role: 'Founder, Untitled SaaS',
    initials: 'OR',
  },
  {
    quote:
      'The component library is stunning. Every section looks like it was designed by a dedicated design team.',
    name: 'Phoenix Baker',
    role: 'Product Designer, Lumen',
    initials: 'PB',
  },
  {
    quote:
      'We replaced our entire agency workflow. Clients get pixel-perfect sites in days, not months.',
    name: 'Lana Steiner',
    role: 'CTO, Form Labs',
    initials: 'LS',
  },
];

export const UntitledTestimonials: React.FC<UntitledTestimonialsProps> = ({
  title,
  description,
  styles = {},
  block
}) => {
  const testimonials = block?.testimonials?.length ? block.testimonials : DEFAULT_TESTIMONIALS;
  
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#111827' }}>
            {title || 'Loved by teams around the world.'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#4b5563' }}>
            {description || 'Join thousands of teams shipping robust projects using components they actually enjoy.'}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 @md:grid-cols-3">
          {testimonials.map((t: any, i: number) => (
            <figure key={t.id || t.name || i} className="flex flex-col rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: styles.cardBgColor || '#ffffff', borderColor: styles.cardBorderColor || '#e5e7eb' }}
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed" style={{ color: styles.cardTextColor || '#374151' }}>
                “{t.content || t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: styles.cardBorderColor || '#f3f4f6' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ backgroundColor: styles.badgeBgColor || '#eef2ff', color: styles.badgeTextColor || '#4338ca' }}
                  >
                    {t.initials || t.name?.substring(0, 2).toUpperCase()}
                  </span>
                )}
                <div>
                  <div className="text-sm font-medium" style={{ color: styles.textColor || '#111827' }}>{t.name}</div>
                  <div className="text-sm" style={{ color: styles.subtitleColor || '#6b7280' }}>{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
