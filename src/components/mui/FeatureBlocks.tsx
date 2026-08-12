import React from 'react';
import { Check, Layers, ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react';

export interface MuiFeatureGridProps {
  title?: string;
  description?: string;
  styles?: any;
  block?: any;
}

const DEFAULT_FEATURES = [
  { icon: Zap, title: 'Lightning Performance', desc: 'Sub-second loads with optimized bundles and smart caching at every layer.', tint: 'bg-blue-50 text-blue-700' },
  { icon: ShieldCheck, title: 'Enterprise Security', desc: 'SOC 2 ready, encrypted at rest, and role-based access built into every plan.', tint: 'bg-emerald-50 text-emerald-700' },
  { icon: Users, title: 'Team Collaboration', desc: 'Invite your whole team with granular permissions and a shared component library.', tint: 'bg-violet-50 text-violet-700' },
  { icon: Layers, title: 'Flexible Layouts', desc: 'Grid systems, breakpoints, and containers that adapt to any screen size.', tint: 'bg-amber-50 text-amber-700' },
  { icon: TrendingUp, title: 'Analytics Built-in', desc: 'Understand your visitors with privacy-first, cookie-free usage insights.', tint: 'bg-rose-50 text-rose-700' },
  { icon: Check, title: 'Zero Lock-in', desc: 'Export your site and components anytime. Your work always belongs to you.', tint: 'bg-cyan-50 text-cyan-700' },
];

export const MuiFeatureGrid: React.FC<MuiFeatureGridProps> = ({
  title,
  description,
  styles = {},
  block
}) => {
  const featureList = block?.features?.length ? block.features : DEFAULT_FEATURES;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 @sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#0f172a' }}>
            {title || 'Everything your product needs.'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#475569' }}>
            {description || 'A complete toolkit of structured surfaces, components, and patterns — production-tested and ready to ship.'}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 @sm:grid-cols-2 @lg:grid-cols-3">
          {featureList.map((f: any, idx: number) => {
            const Icon = f.icon || Zap; // fallback
            return (
              <div
                key={f.id || f.title || idx}
                className="group rounded-xl p-6 ring-1 ring-inset transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: styles.cardBgColor || '#f8fafc',
                  boxShadow: styles.cardBorderColor ? `inset 0 0 0 1px ${styles.cardBorderColor}` : 'inset 0 0 0 1px #f1f5f9'
                }}
              >
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110`}
                  style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#eff6ff', color: styles.accentColor || '#1d4ed8' }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-bold" style={{ color: styles.textColor || '#0f172a' }}>{f.title}</h3>
                <p className="text-sm font-medium leading-relaxed mt-2" style={{ color: styles.subtitleColor || '#475569' }}>{f.desc || f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
