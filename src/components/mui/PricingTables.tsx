import React from 'react';
import { Check } from 'lucide-react';

export interface MuiPricingProps {
  title?: string;
  description?: string;
  styles?: any;
  block?: any;
}

interface MuiTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const DEFAULT_TIERS: MuiTier[] = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'For personal sites and experiments.',
    features: ['1 published site', '50 components', 'Onlypage subdomain', 'Community support'],
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing businesses that need more.',
    features: ['Unlimited sites', 'All 400+ components', 'Custom domain & SSL', 'Remove branding', 'Priority support'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams with advanced needs.',
    features: ['SSO & audit logs', 'Dedicated manager', '99.99% uptime SLA', 'Custom integrations'],
    cta: 'Contact Sales',
  },
];

export const MuiPricing: React.FC<MuiPricingProps> = ({
  title,
  description,
  styles = {},
  block
}) => {
  const pricingTiers = block?.pricingTiers?.length ? block.pricingTiers : DEFAULT_TIERS;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 @sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#0f172a' }}>
            {title || 'Simple, transparent pricing.'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#475569' }}>
            {description || 'Start free. Upgrade when you grow. No hidden fees, cancel anytime.'}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 @lg:grid-cols-3">
          {pricingTiers.map((tier: any, idx: number) => (
            <div
              key={tier.id || tier.name || idx}
              className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${(tier.popular || tier.isPopular) ? 'lg:-mt-4 lg:mb-4' : ''}`}
              style={{
                backgroundColor: (tier.popular || tier.isPopular) ? (styles.accentColor || '#0f172a') : (styles.cardBgColor || '#ffffff'),
                color: (tier.popular || tier.isPopular) ? '#ffffff' : (styles.textColor || '#0f172a'),
                boxShadow: (tier.popular || tier.isPopular) ? (styles.accentColor ? `0 25px 50px -12px ${styles.accentColor}4D` : '0 25px 50px -12px rgba(15,23,42,0.3)') : (styles.cardBorderColor ? `inset 0 0 0 1px ${styles.cardBorderColor}` : 'inset 0 0 0 1px #e2e8f0')
              }}
            >
              {(tier.popular || tier.isPopular) && (
                <span className="text-xs font-bold uppercase tracking-widest absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] shadow-lg"
                  style={{ backgroundColor: styles.buttonBgColor || '#2563eb', color: '#ffffff' }}
                >
                  Recommended
                </span>
              )}
              <h3 className={`text-lg font-bold`} style={{ color: (tier.popular || tier.isPopular) ? '#ffffff' : (styles.textColor || '#0f172a') }}>{tier.name}</h3>
              <p className={`mt-1 text-sm`} style={{ color: (tier.popular || tier.isPopular) ? '#cbd5e1' : (styles.subtitleColor || '#64748b') }}>{tier.description || tier.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold tracking-tight`} style={{ color: (tier.popular || tier.isPopular) ? '#ffffff' : (styles.textColor || '#0f172a') }}>
                  {tier.price || (tier.priceMonthly !== undefined ? `$${tier.priceMonthly}` : '')}
                </span>
                {tier.period && <span className={`text-sm font-medium`} style={{ color: (tier.popular || tier.isPopular) ? '#cbd5e1' : (styles.subtitleColor || '#64748b') }}>{tier.period}</span>}
              </div>
              <button
                className={`mt-6 rounded-lg px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.98] shadow-lg`}
                style={{
                  backgroundColor: (tier.popular || tier.isPopular) ? (styles.buttonBgColor || '#2563eb') : (styles.textColor || '#0f172a'),
                  color: '#ffffff'
                }}
              >
                {tier.cta || tier.ctaText || 'Select Plan'}
              </button>
              <ul className="mt-8 space-y-3">
                {(tier.features || []).map((f: string) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-0.5 rounded-full p-0.5`}
                      style={{ 
                        backgroundColor: (tier.popular || tier.isPopular) ? 'rgba(255,255,255,0.2)' : '#ecfdf5',
                        color: (tier.popular || tier.isPopular) ? '#ffffff' : '#059669'
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span style={{ color: (tier.popular || tier.isPopular) ? '#cbd5e1' : (styles.cardTextColor || '#475569') }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
