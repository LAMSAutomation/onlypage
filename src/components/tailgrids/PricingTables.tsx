import React, { useState } from 'react';
import { Check } from 'lucide-react';

export interface PricingTier {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Starter',
    priceMonthly: 19,
    priceYearly: 15,
    description: 'Perfect for small teams and solo developers starting out.',
    features: ['Up to 5 projects', '10GB Storage', 'Community support', 'Basic analytics'],
    ctaText: 'Start Free Trial',
  },
  {
    name: 'Pro',
    priceMonthly: 49,
    priceYearly: 39,
    description: 'Ideal for growing businesses requiring advanced tools.',
    features: ['Unlimited projects', '100GB Storage', 'Priority 24/7 support', 'Advanced AI analytics', 'Custom domain support'],
    isPopular: true,
    ctaText: 'Get Started with Pro',
  },
  {
    name: 'Enterprise',
    priceMonthly: 99,
    priceYearly: 79,
    description: 'Dedicated infrastructure, SSO, and custom SLA agreements.',
    features: ['Custom infrastructure', 'Unlimited Storage', 'Dedicated account manager', 'SOC2 Compliance', 'Custom SLA agreements'],
    ctaText: 'Contact Sales',
  },
];

export interface TailgridsPricingProps {
  title?: string;
  description?: string;
  tiers?: PricingTier[];
  styles?: any;
  block?: any;
}

export const TailgridsPricingTable: React.FC<TailgridsPricingProps> = ({
  title,
  description,
  tiers,
  styles = {},
  block
}) => {
  const [isYearly, setIsYearly] = useState(true);
  const pricingTiers = tiers || block?.pricingTiers || defaultTiers;

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {block?.badge && block?.showBadge !== false && (
            <span className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: styles.accentColor || '#4f46e5' }}>
              {block.badge}
            </span>
          )}
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: styles.textColor || '#111827' }}>
            {title || 'Simple, Transparent Plans'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed mb-8" style={{ color: styles.subtitleColor || '#4b5563' }}>
            {description || 'Choose the plan that best fits your workflow. Save up to 20% when billed annually.'}
          </p>

          <div className="inline-flex items-center p-1 rounded-xl" style={{ backgroundColor: styles.cardBorderColor || '#e5e7eb' }}>
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                !isYearly ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: !isYearly ? (styles.cardBgColor || '#ffffff') : 'transparent',
                color: !isYearly ? (styles.textColor || '#111827') : (styles.subtitleColor || '#4b5563')
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{
                backgroundColor: isYearly ? (styles.cardBgColor || '#ffffff') : 'transparent',
                color: isYearly ? (styles.textColor || '#111827') : (styles.subtitleColor || '#4b5563')
              }}
            >
              Yearly <span className="ml-1 px-2 py-0.5 text-xs rounded-full font-bold" style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}20` : '#e0e7ff', color: styles.accentColor || '#4338ca' }}>20% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid @md:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, idx) => (
            <div
              key={tier.id || idx}
              className={`relative flex flex-col p-8 rounded-3xl border ${
                tier.isPopular ? 'ring-2 shadow-2xl' : 'shadow-sm'
              }`}
              style={{
                backgroundColor: styles.cardBgColor || '#ffffff',
                borderColor: tier.isPopular ? (styles.accentColor || '#4f46e5') : (styles.cardBorderColor || '#e5e7eb'),
                ...(tier.isPopular ? { '--tw-ring-color': styles.accentColor || '#4f46e5' } : {})
              }}
            >
              {tier.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold shadow-md"
                  style={{ backgroundColor: styles.accentColor || '#4f46e5', color: '#ffffff' }}
                >
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-2" style={{ color: styles.textColor || '#111827' }}>{tier.name}</h3>
              <p className="text-xs mb-6 h-10" style={{ color: styles.subtitleColor || '#6b7280' }}>{tier.description}</p>
              <div className="mb-6">
                <span className="text-4xl @sm:text-5xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#111827' }}>
                  ${isYearly ? tier.priceYearly : tier.priceMonthly}
                </span>
                <span className="text-xs" style={{ color: styles.subtitleColor || '#6b7280' }}> / month</span>
              </div>
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm" style={{ color: styles.cardTextColor || '#4b5563' }}>
                    <Check className="w-4 h-4 shrink-0" style={{ color: styles.accentColor || '#10b981' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm hover:opacity-90"
                style={
                  tier.isPopular
                    ? { backgroundColor: styles.accentColor || '#4f46e5', color: '#ffffff' }
                    : { backgroundColor: styles.cardBorderColor || '#f3f4f6', color: styles.textColor || '#111827' }
                }
              >
                {tier.ctaText || 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TailgridsPricing = TailgridsPricingTable;
