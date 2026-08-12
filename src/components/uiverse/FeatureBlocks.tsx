import React from 'react';
import { LucideIcon, Zap, ShieldCheck, Cpu, Sparkles, Layers, Globe } from 'lucide-react';

export interface UiverseFeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export interface UiverseFeatureGridProps {
  sectionTag?: string;
  title?: string;
  description?: string;
  features?: UiverseFeatureItem[];
  styles?: any;
  block?: any;
}

const defaultFeatures: UiverseFeatureItem[] = [
  { icon: Zap, title: 'Instant Velocity', description: 'Sub-second loads with edge-cached assets and zero-jank animation pipelines.', gradient: 'from-amber-500 to-orange-600' },
  { icon: ShieldCheck, title: 'Fortress Security', description: 'Hardened inputs, encrypted storage, and safe-mode embeds by default.', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Cpu, title: 'AI-Assisted Builds', description: 'Generate entire sections from a single prompt and refine them visually.', gradient: 'from-fuchsia-500 to-purple-600' },
  { icon: Sparkles, title: 'Living Effects', description: 'Glow orbs, gradient borders, and micro-interactions that react to hover.', gradient: 'from-pink-500 to-rose-600' },
  { icon: Layers, title: 'Composable Blocks', description: 'Every section is a self-contained layer you can restack in one click.', gradient: 'from-indigo-500 to-blue-600' },
  { icon: Globe, title: 'Global Reach', description: 'CDN-ready output, multilingual ready, and SEO signals wired in.', gradient: 'from-cyan-500 to-sky-600' },
];

export const UiverseFeatureGrid: React.FC<UiverseFeatureGridProps> = ({
  sectionTag,
  title,
  description,
  features,
  styles = {},
  block
}) => {
  const featureList = block?.features?.length ? block.features : (features || defaultFeatures);

  return (
    <section className="text-white">
      <div className="mx-auto max-w-7xl px-4 @sm:px-6 @lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {block?.showBadge !== false && (
            <span className="text-xs font-bold uppercase tracking-widest mb-3 block tracking-[0.25em]" style={{ color: styles.accentColor || '#e879f9' }}>
              {sectionTag || block?.badge || 'Why Uiverse'}
            </span>
          )}
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight" style={{ color: styles.textColor || '#ffffff' }}>
            {title || 'Beautiful on the inside too.'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed mt-4" style={{ color: styles.subtitleColor || '#94a3b8' }}>
            {description || 'Each tile is a robust block designed to adapt to your brand seamlessly.'}
          </p>
        </div>

        <div className="grid gap-6 @md:grid-cols-2 @lg:grid-cols-3">
          {featureList.map((item: any, index: number) => {
            const Icon = item.icon || Zap; // fallback
            return (
              <div
                key={item.id || index}
                className="group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                style={{
                  backgroundColor: styles.cardBgColor || 'rgba(255, 255, 255, 0.03)',
                  borderColor: styles.cardBorderColor || 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* hover glow wash */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: styles.accentColor ? `linear-gradient(to bottom right, ${styles.accentColor}1A, transparent)` : 'linear-gradient(to bottom right, rgba(217, 70, 239, 0.1), transparent)' }} />
                <div className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  style={{ background: styles.accentColor ? `linear-gradient(to bottom right, ${styles.accentColor}, #2563eb)` : 'linear-gradient(to bottom right, #f59e0b, #ea580c)' }}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-bold relative mb-2" style={{ color: styles.textColor || '#ffffff' }}>{item.title}</h3>
                <p className="text-sm font-medium leading-relaxed relative" style={{ color: styles.subtitleColor || '#94a3b8' }}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
