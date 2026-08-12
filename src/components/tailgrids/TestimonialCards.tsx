import React from 'react';
import { Quote, Star } from 'lucide-react';

export interface TailgridsTestimonialsProps {
  title?: string;
  description?: string;
  styles?: any;
  block?: any;
}

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      'OnlyPage helped us launch our storefront in record time. The sections are beautiful and the checkout just works.',
    name: 'Devid Weil',
    role: 'CEO, Tailgrids Store',
    initials: 'DW',
  },
  {
    quote:
      'The best part is how fast pages load. Our conversion rate jumped 34% after we rebuilt with these components.',
    name: 'Richard Jackson',
    role: 'Marketing Head, Shopify Pro',
    initials: 'RJ',
  },
  {
    quote:
      'We switched our agency clients over and never looked back. Support is lightning fast too.',
    name: 'Jese Leos',
    role: 'Founder, Horizon Agency',
    initials: 'JL',
  },
];

export const TailgridsTestimonials: React.FC<TailgridsTestimonialsProps> = ({
  title,
  description,
  styles = {},
  block
}) => {
  const testimonials = block?.testimonials?.length ? block.testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#111827' }}>
            {title || 'What our customers say.'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#6b7280' }}>
            {description || 'Thousands of businesses trust us to build and grow their online presence.'}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 @md:grid-cols-3">
          {testimonials.map((t: any, idx: number) => (
            <div key={t.id || t.name || idx} className="group relative rounded-xl border p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
              style={{ backgroundColor: styles.cardBgColor || '#ffffff', borderColor: styles.cardBorderColor || '#f3f4f6' }}
            >
              <Quote size={32} className="absolute right-6 top-6 transition-colors" style={{ color: styles.accentColor ? `${styles.accentColor}33` : '#dbeafe' }} />
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-5 text-[15px] leading-relaxed" style={{ color: styles.cardTextColor || '#4b5563' }}>“{t.content || t.quote}”</p>
              <div className="mt-7 flex items-center gap-3 border-t pt-6" style={{ borderColor: styles.cardBorderColor || '#f3f4f6' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: styles.accentColor || '#2563eb' }}>
                    {t.initials || t.name?.substring(0, 2).toUpperCase()}
                  </span>
                )}
                <div>
                  <div className="text-sm font-medium" style={{ color: styles.textColor || '#111827' }}>{t.name}</div>
                  <div className="text-sm" style={{ color: styles.subtitleColor || '#6b7280' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
