/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Code, CheckSquare, Search, MessageSquareCode, 
  ArrowRight, ShieldCheck, HelpCircle, Eye, ChevronRight, Settings
} from 'lucide-react';

interface AiBuilderSectionProps {
  businessName: string;
}

const PRESET_PROMPTS = [
  'salon & wellness studio with booking',
  'family dental clinic in indiranagar',
  'freelance product designer portfolio',
  'organic pet hotel & day care centre'
];

export default function AiBuilderSection({ businessName }: AiBuilderSectionProps) {
  const [prompt, setPrompt] = useState('Create a premium salon website');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'website' | 'form' | 'seo' | 'bot'>('website');

  // Dynamic state representation for what the AI generated
  const generatedTitle = prompt.toLowerCase().includes('salon') 
    ? 'Velvet Cut & Glow Studio' 
    : prompt.toLowerCase().includes('dental') 
    ? 'Dr. Archana Family Dental' 
    : prompt.toLowerCase().includes('designer') 
    ? 'Siddharth Rao • Interactive Design' 
    : prompt.toLowerCase().includes('pet')
    ? 'Paws & Whiskers Luxury Hotel'
    : 'Custom ' + (prompt || 'My Brand') + ' Website';

  const generatedHeroHeadline = prompt.toLowerCase().includes('salon')
    ? 'Effortless Radiance, Engineered Comfort.'
    : prompt.toLowerCase().includes('dental')
    ? 'Gentle Care for Beautiful, Healthy Smiles.'
    : prompt.toLowerCase().includes('designer')
    ? 'Crafting visual stories for ambitious tech teams.'
    : prompt.toLowerCase().includes('pet')
    ? 'A premium home away from home for your best friends.'
    : 'Professional services tailored to your exact standards.';

  const generatedServices = prompt.toLowerCase().includes('salon')
    ? ['Signature Haircut & Spa', 'Hydra Facial Rejuvenation', 'Wedding Makeup Styling']
    : prompt.toLowerCase().includes('dental')
    ? ['Root Canal Therapy', 'Invisalign Alignment', 'Teeth Whitening Pro']
    : prompt.toLowerCase().includes('designer')
    ? ['UI/UX Design Systems', 'Webflow/Vite Development', 'Brand Strategy Audit']
    : prompt.toLowerCase().includes('pet')
    ? ['Luxury Overnight Boarding', 'Organic Hair Grooming', 'Behavioral Training']
    : ['Premium Core Service', 'Strategic Consultations', 'Quarterly Support Packages'];

  const stepsList = [
    { label: 'Analysing content structure', desc: 'Decoding prompt & industry best-practices' },
    { label: 'Generating responsive website preview', desc: 'Assembling typography, palettes & images' },
    { label: 'Creating database & contact forms', desc: 'Injecting validation schemas & capture points' },
    { label: 'Configuring SEO & meta structured metadata', desc: 'Formulating schema.org & viewport variables' },
    { label: 'Bootstrapping WhatsApp auto-responder', desc: 'Syncing AI brain with website offerings' }
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);
    setGeneratedResult(false);
  };

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= stepsList.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setGeneratedResult(true);
            setActiveTab('website');
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <section id="ai-demo" className="py-24 bg-white relative border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Autonomous Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Watch the AI Builder do the heavy lifting
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed">
            Type what your business does. In less than 10 seconds, OnlyPage constructs a fully responsive website, structured lead databases, optimized SEO meta tags, and an active WhatsApp assistant.
          </p>
        </div>

        {/* Builder Container Box */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs relative">
          {/* Prompt Entry Box */}
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 flex items-center px-2">
              <Sparkles className="text-indigo-500 shrink-0 mr-2 animate-pulse-subtle" size={18} />
              <input
                type="text"
                disabled={isGenerating}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What website would you like to build today?"
                className="w-full bg-transparent text-slate-800 font-medium placeholder-slate-300 focus:outline-hidden text-sm"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                {isGenerating ? 'Building...' : 'Generate with AI'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Quick presets picker */}
          <div className="mt-3 flex flex-wrap gap-1.5 items-center justify-center sm:justify-start">
            <span className="text-[11px] text-slate-400 font-medium mr-1 select-none">Presets:</span>
            {PRESET_PROMPTS.map((p) => (
              <button
                key={p}
                disabled={isGenerating}
                onClick={() => setPrompt(`Create a ${p}`)}
                className={`text-[10px] px-2 py-1 rounded-md border font-medium transition-all cursor-pointer ${
                  prompt.toLowerCase().includes(p.split(' ')[0])
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200/60 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* GENERATING PROGRESS CARD */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="mt-8 bg-white border border-indigo-100 rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 animate-spin text-[10px]">
                      🌀
                    </div>
                    <span className="text-xs font-bold text-slate-800">OnlyPage AI Orchestrator</span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                    Step {generationStep + 1} of {stepsList.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {stepsList.map((step, idx) => {
                    const isCompleted = idx < generationStep;
                    const isActive = idx === generationStep;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 transition-opacity duration-300 ${
                          isCompleted || isActive ? 'opacity-100' : 'opacity-35'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                              <ShieldCheck size={11} className="stroke-[3]" />
                            </div>
                          ) : isActive ? (
                            <div className="w-4.5 h-4.5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[9px] animate-pulse">
                              ●
                            </div>
                          ) : (
                            <div className="w-4.5 h-4.5 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 text-[9px]">
                              {idx + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isActive ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Progress Bar */}
                <div className="mt-6 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${((generationStep + 1) / stepsList.length) * 100}%` }}
                    className="h-full bg-indigo-600 rounded-full"
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* GENERATED MOCKUP DASHBOARD CONTROLLER */}
          <AnimatePresence>
            {generatedResult && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg text-left"
              >
                {/* Control Tab Buttons */}
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex flex-wrap gap-1 items-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-3">Preview Output:</span>
                  {[
                    { id: 'website', label: '🖥️ Website Preview', icon: Code },
                    { id: 'form', label: '📋 Lead Form', icon: CheckSquare },
                    { id: 'seo', label: '🔍 SEO Tags', icon: Search },
                    { id: 'bot', label: '🤖 WhatsApp Bot', icon: MessageSquareCode }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          activeTab === tab.id
                            ? 'bg-white border-slate-200 text-indigo-600 shadow-2xs font-bold'
                            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Output Workspace */}
                <div className="p-6 bg-slate-50/40">
                  {activeTab === 'website' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-xs relative"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <span className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          {generatedTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">
                          {businessName}.onlypage.in
                        </span>
                      </div>
                      
                      <div className="max-w-xl">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          {generatedHeroHeadline}
                        </h1>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                          We believe in high-fidelity, premium quality output. Connect with us and experience unmatched precision in everything we deliver.
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Offerings & Highlights</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {generatedServices.map((srv, i) => (
                            <div key={i} className="p-2 border border-slate-100 bg-slate-50 rounded-lg text-left">
                              <p className="text-[11px] font-bold text-slate-800 truncate">{srv}</p>
                              <p className="text-[9px] text-slate-400">Consult with experts</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'form' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-xs max-w-md mx-auto"
                    >
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-3 inline-block">
                        AUTOMATED FORM INSTALLED
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">Book an Appointment or Inquiry</h3>
                      <p className="text-[11px] text-slate-400 mb-4">Collected directly into your OnlyPage CRM.</p>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                          <input
                            type="text"
                            placeholder="Ananya Roy"
                            className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Phone / WhatsApp</label>
                          <input
                            type="text"
                            placeholder="+91 98765 43210"
                            className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Service</label>
                          <select className="w-full mt-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-500" disabled>
                            <option>{generatedServices[0]}</option>
                            <option>{generatedServices[1]}</option>
                          </select>
                        </div>
                        <button disabled className="w-full mt-2 bg-slate-900 text-white rounded-lg py-2 text-xs font-semibold">
                          Submit Reservation
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'seo' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-xs space-y-3 font-mono text-[11px]"
                    >
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                        <span className="text-rose-500 font-bold">&lt;title&gt;</span>
                        <span className="text-slate-800 font-semibold">{generatedTitle} | Official Booking Portal</span>
                        <span className="text-rose-500 font-bold">&lt;/title&gt;</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                        <span className="text-indigo-600 font-bold">&lt;meta</span> name="description" content="
                        <span className="text-slate-700">{generatedHeroHeadline} Book appointments online now.</span>"
                        <span className="text-indigo-600 font-bold">/&gt;</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                        <span className="text-emerald-600 font-bold">&lt;script</span> type="application/ld+json"
                        <span className="text-emerald-600 font-bold">&gt;</span>
                        <pre className="text-[10px] text-slate-500 mt-1 whitespace-pre-wrap">
{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${generatedTitle}",
  "url": "https://${businessName}.onlypage.in"
}`}
                        </pre>
                        <span className="text-emerald-600 font-bold">&lt;/script&gt;</span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'bot' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-xs max-w-md mx-auto"
                    >
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-bold p-2.5 rounded-lg mb-3">
                        🤖 Bot Status: ACTIVE & TRAINING COMPLETED
                      </div>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        We fed the robot your website services. Below is how OnlyBot answers questions when clients contact your WhatsApp.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-slate-100 p-2.5 rounded-xl text-xs text-slate-700 font-medium">
                          <p className="text-[9px] font-bold text-slate-400">CUSTOMER QUESTION</p>
                          "Can you give me a list of your top services and prices?"
                        </div>
                        <div className="bg-emerald-50 p-2.5 rounded-xl text-xs text-emerald-800 font-medium">
                          <p className="text-[9px] font-bold text-emerald-600">ONLYBOT AUTO-ANSWER</p>
                          "Yes! Here is what we offer at {generatedTitle}: <br />
                          1. {generatedServices[0]} <br />
                          2. {generatedServices[1]} <br />
                          3. {generatedServices[2]} <br /><br />
                          Would you like me to book one of these for you?"
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
