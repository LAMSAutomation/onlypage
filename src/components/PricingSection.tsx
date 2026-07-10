/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PRICING_PLANS } from '../data';
import { Check, Info, ShieldCheck, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onPlanSelect: (planName: string) => void;
}

export default function PricingSection({ onPlanSelect }: PricingSectionProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');

  return (
    <section id="pricing" className="py-24 bg-white relative border-b border-slate-100 overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-100/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-100/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Honest plans. No hidden costs.
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed font-sans">
            Start for free and upgrade as your business thrives. Cancel or adjust your plan tier anytime from your settings portal.
          </p>
        </div>

        {/* Interval Billing Switcher Toggle */}
        <div className="flex items-center justify-center space-x-3 mb-16">
          <span className={`text-xs font-bold ${billingInterval === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
            Billed Monthly
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'annual' : 'monthly')}
            className="w-12 h-6 bg-slate-900 rounded-full p-1 relative flex items-center justify-start cursor-pointer transition-colors"
          >
            <motion.div
              layout
              className="w-4 h-4 bg-white rounded-full shadow-sm"
              style={{ x: billingInterval === 'annual' ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <div className="flex items-center space-x-1.5">
            <span className={`text-xs font-bold ${billingInterval === 'annual' ? 'text-slate-900' : 'text-slate-400'}`}>
              Billed Annually
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full select-none uppercase tracking-wide animate-pulse-subtle">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const displayPrice = billingInterval === 'annual' ? plan.priceAnnual : plan.price;
            
            return (
              <motion.div
                key={plan.name}
                whileHover={{ y: -4 }}
                className={`bg-white border rounded-2xl p-8 flex flex-col justify-between text-left relative overflow-hidden transition-all ${
                  plan.popular
                    ? 'border-indigo-600 shadow-xl ring-1 ring-indigo-500/25'
                    : 'border-slate-200 shadow-xs hover:border-slate-350'
                }`}
              >
                {/* Popular Glow Indicator Top Edge */}
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-indigo-600 to-violet-600 h-1.5 flex items-center justify-center">
                    <span className="absolute top-1.5 text-[9px] font-extrabold text-white bg-indigo-600 px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm select-none">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Metadata */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-8 leading-relaxed font-semibold">
                    {plan.description}
                  </p>

                  {/* Price display */}
                  <div className="mt-6 flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{displayPrice}</span>
                    <span className="text-xs font-semibold text-slate-400">/ month</span>
                  </div>
                  {billingInterval === 'annual' && plan.name !== 'Free' && (
                    <p className="text-[10px] text-emerald-600 font-bold font-mono mt-1">Billed annually (Save ₹600/yr)</p>
                  )}

                  <hr className="my-6 border-slate-100" />

                  {/* Feature lists checklist */}
                  <div className="space-y-3.5">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Plan Entitlements:</p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-600 font-medium">
                          <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Submit button card bottom */}
                <div className="mt-8 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => onPlanSelect(plan.name)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{plan.cta}</span>
                  </button>
                  <div className="mt-2.5 text-center flex items-center justify-center space-x-1 text-[10px] text-slate-400 font-semibold select-none">
                    <ShieldCheck size={12} className="text-slate-300" />
                    <span>Secure Stripe billing. 100% encrypted.</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Badge indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-xs text-slate-400 select-none">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            No setup fee
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            7-day risk-free trial
          </span>
        </div>

      </div>
    </section>
  );
}
