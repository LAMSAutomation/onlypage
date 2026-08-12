import React from 'react';
import { TrendingUp, Users, Globe, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface UiverseStat {
  icon: LucideIcon;
  value: string;
  label: string;
  gradient: string;
  glow: string;
}

export interface UiverseStatGridProps {
  title?: string;
  description?: string;
  stats?: UiverseStat[];
  styles?: any;
  block?: any;
}

const defaultStats: UiverseStat[] = [
  { icon: Users, value: '12,400+', label: 'Sites Launched', gradient: 'from-fuchsia-500 to-pink-600', glow: 'shadow-fuchsia-500/25' },
  { icon: Globe, value: '40+', label: 'Countries Served', gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/25' },
  { icon: Star, value: '4.9/5', label: 'Average Rating', gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/25' },
  { icon: TrendingUp, value: '3.2x', label: 'Avg. Conversion Lift', gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/25' },
];

export const UiverseStatGrid: React.FC<UiverseStatGridProps> = ({
  title,
  description,
  stats,
  styles = {},
  block
}) => {
  const statList = block?.stats?.length ? block.stats : (stats || defaultStats);

  return (
    <section className="text-white">
      <div className="mx-auto max-w-6xl px-4 @sm:px-6 @lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 block tracking-[0.25em]" style={{ color: styles.accentColor || '#34d399' }}>
            {block?.badge || 'By the numbers'}
          </span>
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>
            {title || 'Proof, not promises.'}
          </h2>
          <p className="mt-4" style={{ color: styles.subtitleColor || '#94a3b8' }}>
            {description || 'Real numbers from real builders shipping with us.'}
          </p>
        </div>

        <div className="grid gap-6 @sm:grid-cols-2 @lg:grid-cols-4">
          {statList.map((stat: any, idx: number) => {
            const Icon = stat.icon || Users; // fallback
            return (
              <div
                key={stat.id || stat.label || idx}
                className="group relative overflow-hidden rounded-3xl border p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                style={{
                  backgroundColor: styles.cardBgColor || 'rgba(255, 255, 255, 0.03)',
                  borderColor: styles.cardBorderColor || 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  style={{ background: styles.accentColor ? `linear-gradient(to bottom right, ${styles.accentColor}, #2563eb)` : 'linear-gradient(to bottom right, #10b981, #0d9488)' }}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <p className="text-3xl font-black tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>{stat.value}</p>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: styles.subtitleColor || '#64748b' }}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
