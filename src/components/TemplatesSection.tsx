/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TEMPLATES } from '../data';
import { Template, Persona } from '../types';
import { Star, Eye, ArrowRight, Sparkles } from 'lucide-react';

interface TemplatesSectionProps {
  onSelectTemplate: (tempId: string) => void;
  onScrollTo: (sectionId: string) => void;
}

export default function TemplatesSection({ onSelectTemplate, onScrollTo }: TemplatesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleTemplateClick = (tempId: string) => {
    onSelectTemplate(tempId);
    onScrollTo('editor');
  };

  return (
    <section id="templates" className="py-24 bg-mesh-template relative border-b border-slate-100 overflow-hidden grid-pattern">
      {/* Background decoration blur */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Gallery Showroom
          </span>
          <h2 className="text-fluid-h2 font-extrabold text-slate-900 tracking-tight mt-3">
            Handcrafted, lightning-fast templates
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed font-sans">
            Every template is meticulously designed using premium modern grids, responsive flexboxes, and custom fonts, ensuring your brand stands out with high trust.
          </p>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEMPLATES.map((temp) => {
            const isHovered = hoveredId === temp.id;
            return (
              <motion.div
                key={temp.id}
                onMouseEnter={() => setHoveredId(temp.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden p-4 shadow-3xs flex flex-col justify-between group cursor-pointer"
                onClick={() => handleTemplateClick(temp.id)}
              >
                {/* Simulated Thumbnail preview inside template card */}
                <div className={`aspect-video w-full rounded-xl ${temp.image} border border-slate-100 p-4 flex flex-col justify-between relative overflow-hidden shadow-inner`}>
                  {/* Decorative background grid pattern inside thumbnail */}
                  <div className="absolute inset-0 grid-pattern-subtle opacity-30"></div>

                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[9px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-100">
                      HTML5 Canvas
                    </span>
                    <div className="flex items-center space-x-0.5 text-[10px] font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded shadow-3xs">
                      <Star size={10} className="fill-amber-400 text-amber-500" />
                      <span>{temp.rating}</span>
                    </div>
                  </div>

                  {/* Tiny simulated webpage visual layout */}
                  <div className="space-y-1 relative z-10 text-left">
                    <div className="w-16 h-2 rounded-full bg-slate-400"></div>
                    <div className="w-24 h-3.5 rounded-full bg-slate-900"></div>
                    <div className="w-12 h-2 rounded-full bg-slate-300"></div>
                  </div>

                  {/* Absolute Center Eye button hover overlay */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center backdrop-blur-xs z-20">
                      <div className="bg-white rounded-full p-2.5 shadow-lg text-slate-800 flex items-center gap-1.5 font-bold text-[10px] animate-pulse-subtle">
                        <Eye size={12} />
                        <span>Load Template</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Title Card Footer */}
                <div className="mt-4 text-left">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{temp.category}</p>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mt-0.5">{temp.name}</h3>
                  
                  {/* Bottom button indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-850 transition-colors">
                    <span>Includes AI modules</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform text-indigo-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mini prompt notification banner */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900/5 border border-slate-200 rounded-full text-xs text-slate-500 font-semibold select-none">
            <Sparkles size={12} className="text-indigo-500 animate-pulse-subtle" />
            <span>Select any template above to swap out themes inside the sandbox editor.</span>
          </div>
        </div>

      </div>
    </section>
  );
}
