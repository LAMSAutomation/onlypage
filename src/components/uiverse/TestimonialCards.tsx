import React from 'react';
import { Star, Quote } from 'lucide-react';

export interface UiverseTestimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  initials: string;
  gradient: string;
  rating: number;
}

export interface UiverseTestimonialsProps {
  title?: string;
  description?: string;
  testimonials?: UiverseTestimonial[];
  styles?: any;
  block?: any;
}

const defaultTestimonials: UiverseTestimonial[] = [
  {
    name: 'Ananya Sharma',
    role: 'Salon Owner, Bengaluru',
    content: 'My clients book through WhatsApp before they even finish reading the page. The Uiverse sections made my site feel like a premium studio.',
    avatar: 'https://i.pravatar.cc/96?img=47',
    initials: 'AS',
    gradient: 'from-fuchsia-500 to-pink-500',
    rating: 5,
  },
  {
    name: 'Rohan Mehta',
    role: 'Indie SaaS Founder',
    content: 'Launched my landing page in an afternoon. The glassmorphism cards converted 2.3x better than my old template.',
    avatar: 'https://i.pravatar.cc/96?img=12',
    initials: 'RM',
    gradient: 'from-cyan-500 to-blue-500',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Clinic Director',
    content: 'Patients trust the page instantly. Setup took zero code and the support team helped me polish the details.',
    avatar: 'https://i.pravatar.cc/96?img=32',
    initials: 'PN',
    gradient: 'from-emerald-500 to-teal-500',
    rating: 5,
  },
];

export const UiverseTestimonials: React.FC<UiverseTestimonialsProps> = ({
  title,
  description,
  testimonials,
  styles = {},
  block
}) => {
  const reviews = block?.testimonials?.length ? block.testimonials : (testimonials || defaultTestimonials);

  return (
    <section className="text-white">
      <div className="mx-auto max-w-6xl px-4 @sm:px-6 @lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 block tracking-[0.25em]" style={{ color: styles.accentColor || '#22d3ee' }}>
            {block?.badge || 'Wall of love'}
          </span>
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>
            {title || 'Loved by makers & merchants.'}
          </h2>
          <p className="mt-4" style={{ color: styles.subtitleColor || '#94a3b8' }}>
            {description || 'Thousands of builders ship stunning sites with us every week.'}
          </p>
        </div>

        <div className="grid gap-6 @md:grid-cols-3">
          {reviews.map((t: any, idx: number) => (
            <div
              key={t.id || t.name || idx}
              className="group relative rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              style={{
                backgroundColor: styles.cardBgColor || 'rgba(255, 255, 255, 0.03)',
                borderColor: styles.cardBorderColor || 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <Quote size={28} className="absolute right-6 top-6 transition-colors" style={{ color: 'rgba(255, 255, 255, 0.1)' }} />
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: styles.cardTextColor || '#cbd5e1' }}>{t.content}</p>
              <div className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover shadow-lg" />
                ) : (
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white shadow-lg`}
                    style={{ background: styles.accentColor ? `linear-gradient(to bottom right, ${styles.accentColor}, #4f46e5)` : 'linear-gradient(to bottom right, #06b6d4, #3b82f6)' }}
                  >
                    {t.initials || t.name?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: styles.textColor || '#ffffff' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: styles.subtitleColor || '#64748b' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
