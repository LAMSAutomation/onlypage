/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PERSONAS } from '../data';
import { Persona } from '../types';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface BuiltForEveryoneSectionProps {
  onSelectPersona: (p: Persona) => void;
  onScrollTo: (sectionId: string) => void;
}

export default function BuiltForEveryoneSection({ onSelectPersona, onScrollTo }: BuiltForEveryoneSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCardClick = (p: Persona) => {
    onSelectPersona(p);
    onScrollTo('editor');
  };

  return (
    <section id="everyone" className="py-24 bg-slate-50 relative border-b border-slate-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Tailormade Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-sans">
            Built for everyone who runs a business
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed">
            Whether you are booking haircuts, counseling patients, or selling digital templates, OnlyPage creates an optimized workflow out-of-the-box.
          </p>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PERSONAS.map((p, idx) => {
            const isHovered = hoveredId === p.id;
            return (
              <motion.div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group cursor-pointer"
                onClick={() => handleCardClick(p)}
              >
                {/* Accent Background Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${p.bgGradient} rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl select-none">{p.emoji}</span>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 uppercase">
                      {p.role}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {p.name}
                  </h3>
                  
                  {/* Live Mini Preview Box inside Card */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100/80 text-left relative overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 tracking-tight leading-snug line-clamp-1">
                      {p.mockHeadline}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {p.mockSub}
                    </p>
                  </div>

                  {/* Core Features list */}
                  <div className="mt-5 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features included:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {p.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-1.5 text-xs text-slate-600">
                          <Check size={12} className="text-emerald-500 shrink-0 stroke-[3]" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 group-hover:text-slate-800 transition-colors">
                    Load in Editor
                  </span>
                  <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1.5 transition-transform">
                    <span>Try layout</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic callout badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/5 rounded-full text-xs text-slate-600 font-semibold border border-slate-200">
            <Sparkles size={12} className="text-indigo-500 fill-indigo-100" />
            <span>Click any card above to load and customize its website preview inside our live Editor.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
