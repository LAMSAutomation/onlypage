/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BENTO_FEATURES } from '../data';
import { FeatureCard } from '../types';
import * as LucideIcons from 'lucide-react';

interface FeaturesSectionProps {
  onScrollTo: (sectionId: string) => void;
}

export default function FeaturesSection({ onScrollTo }: FeaturesSectionProps) {
  
  // Helper to dynamically render Lucide icons by name
  const renderIcon = (name: string, colorClass: string) => {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) {
      return <IconComponent size={20} className={colorClass} />;
    }
    return <LucideIcons.Layers size={20} className={colorClass} />;
  };

  // Helper to render high-contrast mock mini UI assets inside bento cards
  const renderBentoDemo = (type: string) => {
    switch (type) {
      case 'builder':
        return (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2 select-none">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Section Layer</span>
              <span className="text-indigo-500 font-bold">100% Mobile Fluid</span>
            </div>
            <div className="h-6 w-full bg-white rounded border border-slate-100 flex items-center px-2 justify-between">
              <span className="text-[10px] text-slate-600 font-semibold">Header Block</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="h-10 w-full bg-indigo-50 border border-indigo-100 rounded flex items-center px-2 justify-between">
              <span className="text-[10px] text-indigo-700 font-bold">Hero Showcase (Image + Button)</span>
              <span className="w-4 h-4 bg-indigo-600 text-white rounded flex items-center justify-center text-[8px] font-bold">A</span>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="mt-4 p-3 bg-linear-to-tr from-indigo-500/5 to-purple-500/5 border border-indigo-100 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">AI Engine</span>
              <span className="text-[9px] text-slate-400 font-mono">optimized copy</span>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-snug">"Revitalize your wellness routine in minutes."</p>
            <div className="flex justify-between items-center text-[9px] text-slate-400">
              <span>Alternative Tone: Playful</span>
              <span className="text-indigo-600 hover:underline cursor-pointer">Regenerate</span>
            </div>
          </div>
        );
      case 'whatsapp':
        return (
          <div className="mt-4 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded-full">Webhook Connected</span>
              <span className="text-[8px] font-mono text-slate-400">Auto Bot v2.0</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5"></div>
              <p className="text-[10px] text-emerald-800 font-semibold italic leading-relaxed">
                "We operate 10 AM to 8 PM on weekdays. Would you like me to book a root canal?"
              </p>
            </div>
          </div>
        );
      case 'cms':
        return (
          <div className="mt-3 text-[10px] space-y-1 bg-white border border-slate-100 p-2 rounded-lg font-mono">
            <div className="grid grid-cols-3 gap-1 border-b border-slate-100 pb-1 text-slate-400 font-bold">
              <span>Post ID</span>
              <span>Title</span>
              <span>Category</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-slate-600 border-b border-slate-50 py-1">
              <span className="truncate">blog-1</span>
              <span className="truncate font-semibold">Our Skin Routine</span>
              <span className="truncate text-indigo-600">Skincare</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-slate-600 py-1">
              <span className="truncate">blog-2</span>
              <span className="truncate font-semibold">Dental Hygiene</span>
              <span className="truncate text-indigo-600">Medicine</span>
            </div>
          </div>
        );
      case 'crm':
        return (
          <div className="mt-3 p-2 bg-slate-50 border border-slate-200/50 rounded-lg flex items-center justify-between text-[10px]">
            <div>
              <p className="font-bold text-slate-800">Radhika Sharma</p>
              <p className="text-[9px] text-slate-400">radhika@gmail.com</p>
            </div>
            <span className="text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded">New Lead</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="features" className="py-24 bg-white relative border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            All-In-One Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Supercharged features to scale your business
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed font-sans">
            No plugins. No templates conflict. Every tool is carefully pre-integrated to form a beautiful, cohesive, and incredibly fast operational core.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
          {BENTO_FEATURES.map((feat) => {
            
            // Map sizing descriptors to grid classes
            let gridSpan = 'md:col-span-1';
            if (feat.size === 'large') {
              gridSpan = 'md:col-span-2 md:row-span-2';
            } else if (feat.size === 'medium') {
              gridSpan = 'md:col-span-2';
            }

            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between text-left relative overflow-hidden group hover:bg-white hover:shadow-lg hover:border-slate-300/80 transition-all ${gridSpan}`}
              >
                {/* Floating badge top right */}
                {feat.badge && (
                  <span className="absolute top-4 right-4 text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 rounded-full select-none uppercase">
                    {feat.badge}
                  </span>
                )}

                {/* Card Core Content */}
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/50 flex items-center justify-center text-slate-800 shadow-3xs group-hover:scale-105 transition-transform">
                    {renderIcon(feat.iconName, 'text-indigo-600')}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">
                    {feat.title}
                  </h3>
                  
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Render interactive bento sub-visualizations */}
                {renderBentoDemo(feat.demoType)}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
