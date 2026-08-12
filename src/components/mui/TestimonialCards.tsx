import React from 'react';
import { Star } from 'lucide-react';

export interface MuiTestimonialsProps {
  title?: string;
  description?: string;
  styles?: any;
  block?: any;
}

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      'The Material-style components felt instantly familiar to my team. We shipped our redesign in half the time we estimated.',
    name: 'Sarah Chen',
    role: 'Product Lead, Northwind',
    initials: 'SC',
    tint: 'bg-blue-100 text-blue-700',
  },
  {
    quote:
      'Clean surfaces, thoughtful elevation, and motion that feels native. It is the closest thing to hand-rolled MUI without the maintenance.',
    name: 'Marcus Rivera',
    role: 'Frontend Engineer, Lumen',
    initials: 'MR',
    tint: 'bg-emerald-100 text-emerald-700',
  },
  {
    quote:
      'We migrated our whole landing page in an afternoon. Every section slots together and looks polished out of the box.',
    name: 'Aisha Patel',
    role: 'Founder, Helios Studio',
    initials: 'AP',
    tint: 'bg-violet-100 text-violet-700',
  },
];

export const MuiTestimonials: React.FC<MuiTestimonialsProps> = ({
  title,
  description,
  styles = {},
  block
}) => {
  const testimonials = block?.testimonials?.length ? block.testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 @sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#0f172a' }}>
            {title || 'Loved by product teams everywhere.'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#475569' }}>
            {description || 'Real stories from builders who switched to a design system they already know.'}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 @lg:grid-cols-3">
          {testimonials.map((t: any, idx: number) => (
            <figure
              key={t.id || t.name || idx}
              className="flex flex-col rounded-xl p-7 ring-1 ring-inset transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: styles.cardBgColor || '#f8fafc',
                boxShadow: styles.cardBorderColor ? `inset 0 0 0 1px ${styles.cardBorderColor}` : 'inset 0 0 0 1px #f1f5f9'
              }}
            >
              <div className="flex gap-1" style={{ color: styles.accentColor || '#fbbf24' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed" style={{ color: styles.textColor || '#334155' }}>
                “{t.quote || t.content}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: styles.cardBorderColor || '#f1f5f9' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
                    style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#eff6ff', color: styles.accentColor || '#1d4ed8' }}
                  >
                    {t.initials || t.name?.charAt(0) || 'U'}
                  </span>
                )}
                <div>
                  <div className="text-sm font-bold" style={{ color: styles.textColor || '#0f172a' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: styles.subtitleColor || '#64748b' }}>{t.role || t.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
