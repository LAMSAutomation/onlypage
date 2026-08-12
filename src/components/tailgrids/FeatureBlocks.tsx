import React from 'react';
import { LucideIcon, Zap, ShieldCheck, Cpu, Sparkles, Layers, Globe } from 'lucide-react';

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  sectionTag?: string;
  title?: string;
  description?: string;
  features?: FeatureItem[];
  styles?: any;
  block?: any;
}

const defaultFeatures: FeatureItem[] = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized rendering pipelines for low latency and high frame rates across all browsers.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, automated vulnerability scans, and strict access controls built-in.',
  },
  {
    icon: Cpu,
    title: 'AI Automated Workflow',
    description: 'Integrated intelligence models to speed up content creation and repetitive engineering tasks.',
  },
  {
    icon: Sparkles,
    title: 'Custom Themes',
    description: 'Easily tailor colors, typography, and dark mode tokens to match your visual brand.',
  },
  {
    icon: Layers,
    title: 'Modular Components',
    description: 'Plug-and-play components designed with accessibility, clean APIs, and reusability first.',
  },
  {
    icon: Globe,
    title: 'Global CDN Ready',
    description: 'Deploy assets everywhere instantly with edge caching and static site optimization.',
  },
];

export const TailgridsFeatureGrid: React.FC<FeatureGridProps> = ({
  sectionTag,
  title,
  description,
  features,
  styles = {},
  block
}) => {
  const featureList = block?.features?.length ? block.features : (features || defaultFeatures);

  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: styles.accentColor || '#4f46e5' }}>
            {sectionTag || block?.badge || 'Features'}
          </span>
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight mb-4" style={{ color: styles.textColor || '#111827' }}>
            {title || 'Built for Speed & Scalability'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed" style={{ color: styles.subtitleColor || '#4b5563' }}>
            {description || 'Everything you need to build robust web applications without the overhead.'}
          </p>
        </div>
        <div className="grid @md:grid-cols-2 @lg:grid-cols-3 gap-8">
          {featureList.map((item: any, index: number) => {
            const Icon = item.icon || Zap; // fallback icon if not string or lucide
            return (
              <div
                key={item.id || index}
                className="p-6 rounded-2xl border hover:shadow-xl transition-all duration-300 group"
                style={{ 
                  backgroundColor: styles.cardBgColor || '#f9fafb',
                  borderColor: styles.cardBorderColor || '#f3f4f6'
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: styles.accentColor || '#4f46e5', color: '#ffffff' }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: styles.textColor || '#111827' }}>{item.title}</h3>
                <p className="text-sm font-medium leading-relaxed" style={{ color: styles.subtitleColor || '#4b5563' }}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
