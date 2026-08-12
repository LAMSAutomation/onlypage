import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export interface UiversePlan {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export interface UiversePricingProps {
  title?: string;
  description?: string;
  plans?: UiversePlan[];
  styles?: any;
  block?: any;
}

const defaultPlans: UiversePlan[] = [
  {
    name: 'Starter',
    price: '₹0',
    period: '/ forever',
    tagline: 'For personal projects & experiments.',
    features: ['3 published sites', 'ONlyPage subdomain', 'Community blocks', 'WhatsApp button'],
    ctaText: 'Start Free',
  },
  {
    name: 'Creator',
    price: '₹499',
    period: '/ month',
    tagline: 'For freelancers & growing brands.',
    features: ['Unlimited sites', 'Custom domains', 'All library blocks', 'Remove ONlyPage badge', 'WhatsApp automation'],
    popular: true,
    ctaText: 'Go Creator',
  },
  {
    name: 'Studio',
    price: '₹1,499',
    period: '/ month',
    tagline: 'For agencies & multi-client workflows.',
    features: ['Client workspace', 'White-label editor', 'Priority support', 'E-commerce suite', 'Team seats'],
    ctaText: 'Talk to Sales',
  },
];

export const UiversePricing: React.FC<UiversePricingProps> = ({
  title,
  description,
  plans,
  styles = {},
  block
}) => {
  const pricingTiers = block?.pricingTiers?.length ? block.pricingTiers : (plans || defaultPlans);

  return (
    <section className="text-white">
      <div className="mx-auto max-w-6xl px-4 @sm:px-6 @lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px]"
            style={{ 
              borderColor: styles.accentColor ? `${styles.accentColor}4D` : 'rgba(251, 191, 36, 0.3)',
              backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : 'rgba(251, 191, 36, 0.1)',
              color: styles.accentColor || '#fcd34d'
            }}
          >
            <Sparkles size={11} /> {block?.badge || 'Pricing'}
          </span>
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>
            {title || 'Pick your plan.'}
          </h2>
          <p className="mt-4" style={{ color: styles.subtitleColor || '#94a3b8' }}>
            {description || 'Transparent pricing, zero lock-in. Upgrade, downgrade, or cancel any time.'}
          </p>
        </div>

        <div className="grid gap-6 @md:grid-cols-3">
          {pricingTiers.map((plan: any, idx: number) => (
            <div
              key={plan.id || plan.name || idx}
              className={`relative flex flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1.5`}
              style={{
                backgroundColor: styles.cardBgColor || 'rgba(255, 255, 255, 0.03)',
                borderColor: plan.isPopular || plan.popular ? (styles.accentColor || 'rgba(217, 70, 239, 0.6)') : (styles.cardBorderColor || 'rgba(255, 255, 255, 0.1)'),
                boxShadow: (plan.isPopular || plan.popular) ? `0 25px 50px -12px ${styles.accentColor ? styles.accentColor + '33' : 'rgba(217,70,239,0.2)'}` : 'none',
                background: (plan.isPopular || plan.popular) ? `linear-gradient(to bottom, ${styles.accentColor ? styles.accentColor + '26' : 'rgba(217,70,239,0.15)'}, transparent)` : (styles.cardBgColor || 'rgba(255,255,255,0.03)')
              }}
            >
              {(plan.isPopular || plan.popular) && (
                <span className="text-xs font-bold uppercase tracking-widest absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] shadow-lg"
                  style={{ background: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #4f46e5)` : 'linear-gradient(to right, #d946ef, #6366f1)' }}
                >
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold uppercase" style={{ color: styles.accentColor || '#e879f9' }}>{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1" style={{ color: styles.textColor || '#ffffff' }}>
                <span className="text-4xl @sm:text-5xl font-extrabold tracking-tight">{plan.price || (plan.priceMonthly !== undefined ? `$${plan.priceMonthly}` : '')}</span>
                {plan.period && <span className="text-xs font-semibold" style={{ color: styles.subtitleColor || '#64748b' }}>{plan.period}</span>}
              </div>
              <p className="text-sm font-medium leading-relaxed mt-2" style={{ color: styles.subtitleColor || '#94a3b8' }}>{plan.tagline || plan.description}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {(plan.features || []).map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: styles.cardTextColor || '#cbd5e1' }}>
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full`}
                      style={{ 
                        backgroundColor: (plan.isPopular || plan.popular) ? (styles.accentColor ? `${styles.accentColor}40` : 'rgba(217, 70, 239, 0.25)') : 'rgba(255, 255, 255, 0.1)',
                        color: (plan.isPopular || plan.popular) ? (styles.accentColor || '#f9a8d4') : '#cbd5e1'
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full rounded-2xl py-3 text-sm font-black transition-all hover:opacity-90`}
                style={
                  (plan.isPopular || plan.popular)
                    ? { background: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #4f46e5)` : 'linear-gradient(to right, #d946ef, #6366f1)', color: '#ffffff' }
                    : { backgroundColor: styles.cardBorderColor || 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: '1px', color: '#e2e8f0' }
                }
              >
                {plan.ctaText || 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
