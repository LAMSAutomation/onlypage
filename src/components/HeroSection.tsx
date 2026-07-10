/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Sparkles, ArrowRight, Users, MessageSquare, 
  BarChart3, Check, Search, ShieldAlert, HeartHandshake, Eye
} from 'lucide-react';

interface HeroSectionProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  onClaimDomain: () => void;
}

export default function HeroSection({ businessName, setBusinessName, onClaimDomain }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState(businessName);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Clean up string to be domain friendly
      const cleanName = inputValue
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      setBusinessName(cleanName || 'yourname');
      onClaimDomain();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = raw.toLowerCase().replace(/[^a-z0-9\-]/g, '');
    setInputValue(clean);
  };

  const handleClaim = () => {
    if (inputValue.trim()) {
      const cleanName = inputValue.toLowerCase().replace(/[^a-z0-9\-]/g, '');
      setBusinessName(cleanName || 'yourname');
    }
    onClaimDomain();
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-radial from-slate-50 to-white overflow-hidden grid-pattern-subtle">
      {/* Soft blue/purple background blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-100/25 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Top Mini-Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100/60 rounded-full text-xs font-semibold text-indigo-700 mb-6 backdrop-blur-xs"
        >
          <Sparkles size={12} className="text-indigo-500 fill-indigo-100" />
          <span>The Modern Business OS for Solo Operators</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-4xl mx-auto font-sans"
        >
          One page. <span className="text-indigo-600">Everything</span> your business needs.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Build your website, capture high-intent leads, and automate customer support without managing multiple disjointed platforms.
        </motion.p>

        {/* Domain Search Interactive Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 max-w-lg mx-auto flex flex-col items-center"
        >
          <form onSubmit={handleSubmit} className="inline-flex items-center p-1.5 bg-white border border-slate-200 rounded-full shadow-md max-w-md w-full">
            <div className="flex-1 flex items-center pl-5 pr-2 py-1 min-w-0">
              <Globe className="text-slate-400 shrink-0 mr-2" size={16} />
              <input
                type="text"
                value={inputValue}
                onChange={handleTextChange}
                placeholder="yourname"
                className="w-full py-1.5 bg-transparent text-slate-800 font-bold focus:outline-none text-sm placeholder-slate-300 min-w-0"
              />
              <span className="text-slate-400 font-bold select-none text-sm shrink-0">.onlypage.in</span>
            </div>
            <button
              type="submit"
              onClick={handleClaim}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-full shadow-lg shadow-indigo-100 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              Generate
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Availability badge */}
          <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Domain is <span className="text-emerald-600 font-semibold">available for free</span>. Instant setup.</span>
          </div>
        </motion.div>

        {/* --- FLOATING PRODUCT UI DECK --- */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          {/* Main Showcase Device Block (Simulating a premium web browser frame) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden aspect-video relative"
          >
            {/* Browser Header Bar */}
            <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
              </div>
              <div className="bg-white px-6 py-1 border border-slate-200/40 rounded-lg text-xs text-slate-500 font-medium select-none shadow-2xs flex items-center gap-1.5">
                <Globe size={11} className="text-emerald-500" />
                <span>{inputValue || 'yourname'}.onlypage.in</span>
              </div>
              <div className="w-12"></div>
            </div>

            {/* Inner Interactive Demo Preview */}
            <div className="p-8 h-full bg-linear-to-b from-slate-50 to-white flex flex-col justify-start text-left overflow-hidden">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">✨ AI GENERATED PREVIEW</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                  The Premium Salon Experience for {inputValue ? inputValue.charAt(0).toUpperCase() + inputValue.slice(1) : 'Glow Studio'}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-lg">
                  Beautiful haircuts, biological therapy, and high-fidelity makeup custom tailormade for you. Book an appointment today.
                </p>
                
                {/* Simulated booking button */}
                <button className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5">
                  Reserve Services Now
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Wireframe columns below */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="p-3 bg-white border border-slate-200/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold">💇‍♀️</div>
                  <h4 className="font-semibold text-xs text-slate-800 mt-2">Hair Styling</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Starting from ₹499</p>
                </div>
                <div className="p-3 bg-white border border-slate-200/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">💆‍♂️</div>
                  <h4 className="font-semibold text-xs text-slate-800 mt-2">Facial Care</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Starting from ₹899</p>
                </div>
                <div className="p-3 bg-white border border-slate-200/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 text-xs font-bold">💅</div>
                  <h4 className="font-semibold text-xs text-slate-800 mt-2">Nail Artistry</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Starting from ₹299</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating UI Card 1: CRM Contacts */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute -left-10 bottom-12 hidden lg:block w-72 bg-white rounded-xl border border-slate-200/80 shadow-xl p-4 text-left backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users size={14} className="text-indigo-500" />
                Live Leads (CRM)
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Radhika Sharma</p>
                  <p className="text-[10px] text-slate-400">Hair Salon request</p>
                </div>
                <span className="text-[10px] text-slate-500">2m ago</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Amit Verma</p>
                  <p className="text-[10px] text-slate-400">Real estate valuation</p>
                </div>
                <span className="text-[10px] text-slate-500">14m ago</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Pooja K.</p>
                  <p className="text-[10px] text-slate-400">Personal trainer trial</p>
                </div>
                <span className="text-[10px] text-slate-500">1h ago</span>
              </div>
            </div>
          </motion.div>

          {/* Floating UI Card 2: Analytics & SEO Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute -right-10 top-20 hidden lg:block w-64 bg-white/95 rounded-xl border border-slate-200/70 shadow-xl p-4 text-left backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-1.5">
                <BarChart3 size={14} className="text-indigo-500" />
                <span className="text-xs font-bold text-slate-800">Live Traffic</span>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono font-medium">+18.4%</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900">4,810</span>
              <span className="text-[10px] text-slate-400 font-medium">uniques this week</span>
            </div>
            
            {/* Visual graph line path */}
            <div className="mt-4 h-10 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path
                  d="M0,35 Q15,20 30,28 T60,10 T90,15 L100,5"
                  fill="none"
                  stroke="url(#sparkGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="sparkGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>

          {/* Floating UI Card 3: WhatsApp Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute -right-6 -bottom-8 hidden lg:block w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-3 text-left"
          >
            <div className="flex items-center space-x-2 mb-3 border-b border-slate-100 pb-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">💬</div>
              <div>
                <p className="text-xs font-bold text-slate-800">OnlyBot — WhatsApp</p>
                <p className="text-[9px] text-slate-400">Automated AI Assistant</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-100 text-slate-700 p-2 rounded-lg max-w-[85%] text-[11px]">
                "Hello, are you open on Sunday?"
              </div>
              <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg max-w-[85%] ml-auto text-[11px]">
                "Yes! We are open from 10 AM to 6 PM on Sunday. Would you like to reserve a hair spa?"
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
