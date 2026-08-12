import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export interface TailgridsCTAProps {
  title?: string;
  description?: string;
  styles?: any;
  block?: any;
}

export const TailgridsCTA: React.FC<TailgridsCTAProps> = ({
  title,
  description,
  styles = {},
  block
}) => {
  return (
    <section className="px-4 @sm:px-6 @lg:px-8">
      <div 
        className="max-w-7xl mx-auto rounded-3xl p-8 @sm:p-12 @lg:p-16 text-white shadow-2xl relative overflow-hidden"
        style={{ background: styles.accentColor ? `linear-gradient(to right, ${styles.accentColor}, #8b5cf6)` : 'linear-gradient(to right, #4f46e5, #8b5cf6)' }}
      >
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl @sm:text-4xl font-extrabold tracking-tight mb-4">
            {title || 'Ready to Accelerate Your Development?'}
          </h2>
          <p className="text-base @sm:text-lg font-medium leading-relaxed opacity-90 mb-8">
            {description || 'Join thousands of developers using our component library to build modern applications faster.'}
          </p>
          <div className="flex flex-col @sm:flex-row items-center gap-4">
            <div className="relative w-full @sm:w-80">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
            </div>
            <button className="w-full @sm:w-auto px-6 py-3 rounded-xl bg-white font-bold text-sm transition-colors inline-flex items-center justify-center gap-2 shrink-0 hover:opacity-90"
              style={{ color: styles.accentColor || '#4338ca' }}
            >
              {block?.btnText || 'Get Started Now'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
