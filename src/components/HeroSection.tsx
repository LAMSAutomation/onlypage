/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Sparkles, ArrowRight, Users, MessageSquare, 
  BarChart3, Check, Search, MapPin, Clock, Calendar, 
  ChevronRight, Phone, Send, CheckCircle2, ShieldAlert,
  Scissors, Stethoscope, GraduationCap, Palette, Home
} from 'lucide-react';
import { PERSONAS } from '../data';
import { Persona } from '../types';

interface HeroSectionProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  onClaimDomain: () => void;
}

interface LeadRecord {
  id: string;
  name: string;
  category: string;
  time: string;
  source: string;
}

export default function HeroSection({ businessName, setBusinessName, onClaimDomain }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState(businessName);
  const [activePersonaId, setActivePersonaId] = useState<string>('salon');
  
  // Interactive CRM state - users can submit a form inside the mock preview and see it go live!
  const [crmLeads, setCrmLeads] = useState<LeadRecord[]>([
    { id: '1', name: 'Radhika Sharma', category: 'Hair Spa', time: 'Just now', source: 'Website Form' },
    { id: '2', name: 'Amit Verma', category: 'Dental consult', time: '14m ago', source: 'WhatsApp Bot' },
    { id: '3', name: 'Pooja K.', category: 'CS Tuition info', time: '1h ago', source: 'Website Form' },
  ]);

  // Interactive Form Inputs inside the preview mockup
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // WhatsApp simulation state
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'client' | 'bot', text: string }>>([
    { sender: 'client', text: 'Hi, are you open on Sunday?' },
    { sender: 'bot', text: 'Yes, absolutely! We are open 10 AM - 6 PM on Sunday. Would you like to schedule an appointment?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Sync businessName changes from outside if any
  useEffect(() => {
    if (businessName) {
      setInputValue(businessName);
    }
  }, [businessName]);

  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
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

  // Handler for visitor form submission inside mockup
  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    setFormSubmitted(true);

    // Add new lead to the CRM state dynamically
    const newLead: LeadRecord = {
      id: Date.now().toString(),
      name: visitorName,
      category: activePersona.role.split(' & ')[0] + ' query',
      time: 'Just now',
      source: 'Interactive Mock'
    };

    setTimeout(() => {
      setCrmLeads(prev => [newLead, ...prev]);
    }, 600);

    // Reset form after a delay
    setTimeout(() => {
      setVisitorName('');
      setVisitorPhone('');
      setFormSubmitted(false);
    }, 4000);
  };

  // WhatsApp simulation chat interactive response triggers
  const handleWaQuery = (query: string, reply: string) => {
    if (isTyping) return;
    
    // Add client question
    setWaMessages(prev => [...prev, { sender: 'client', text: query }]);
    setIsTyping(true);

    // Simulate typing answer
    setTimeout(() => {
      setIsTyping(false);
      setWaMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1200);
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-36 md:pb-32 bg-mesh-hero overflow-hidden grid-pattern">
      {/* 10,000,000 USD Architectural Layout Lines */}
      <div className="absolute top-0 bottom-0 left-1/12 w-px bg-slate-200/40 pointer-events-none hidden xl:block" />
      <div className="absolute top-0 bottom-0 right-1/12 w-px bg-slate-200/40 pointer-events-none hidden xl:block" />
      
      {/* Multi-layered soft backdrop glowing cloud overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-5 w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-violet-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Animated Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-slate-200/60 rounded-full text-xs font-semibold text-slate-800 shadow-3xs mb-6 select-none"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">OnlyPage Engine v1.2</span>
          <div className="w-px h-3 bg-slate-200" />
          <span className="text-indigo-600 flex items-center gap-1">
            Now live with Google Workspace integrations <Sparkles size={11} className="fill-indigo-100 animate-spin" style={{ animationDuration: '6s' }} />
          </span>
        </motion.div>

        {/* Display Typography Header */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-fluid-h1 font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto font-sans"
        >
          One beautiful page. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">Everything</span> your business needs.
        </motion.h1>

        {/* Responsive, clear subheader */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Replace website builders, dynamic databases, feedback forms, local pipelines, slot bookings, and WhatsApp automation bots in under 2 minutes.
        </motion.p>

        {/* Claim Subdomain Command Center */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="flex items-center p-1.5 bg-white border border-slate-200 rounded-full shadow-lg hover:border-slate-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <div className="flex-1 flex items-center pl-4 pr-1 py-1 min-w-0">
              <Globe className="text-slate-400 shrink-0 mr-2" size={16} />
              <input
                type="text"
                value={inputValue}
                onChange={handleTextChange}
                placeholder="salon-de-lux"
                className="w-full py-1.5 bg-transparent text-slate-800 font-bold focus:outline-none text-sm placeholder-slate-300 min-w-0"
              />
              <span className="text-slate-400 font-bold select-none text-sm shrink-0 pr-1">.onlypage.in</span>
            </div>
            <button
              type="submit"
              onClick={handleClaim}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-full shadow-lg shadow-indigo-100 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Build instantly</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Subdomain validation feedback */}
          <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 font-semibold font-mono">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>https://{inputValue || 'yourname'}.onlypage.in is available for free. SSL guaranteed.</span>
          </div>
        </motion.div>

        {/* --- PREMIUM DYNAMIC PREVIEW SANDBOX CONTROLLER --- */}
        <div className="mt-12 max-w-xl mx-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-mono">
            Select an industry preset to preview live conversion logic
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200/60 backdrop-blur-md">
            {[
              { id: 'salon', label: 'Salon', icon: Scissors },
              { id: 'doctor', label: 'Doctor', icon: Stethoscope },
              { id: 'student', label: 'Portfolio', icon: GraduationCap },
              { id: 'creator', label: 'Creator', icon: Palette },
              { id: 'realestate', label: 'Real Estate', icon: Home }
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePersonaId(p.id);
                    // Populate default simulated texts if needed
                    setVisitorName('');
                    setVisitorPhone('');
                    setFormSubmitted(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activePersonaId === p.id
                      ? 'bg-white text-indigo-600 shadow-3xs border border-indigo-100/50 font-extrabold scale-105'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={12} className={activePersonaId === p.id ? 'text-indigo-600' : 'text-slate-400'} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- FLOATING DEVICE MOCKUP CANVAS --- */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          
          {/* Subtle Decorative floating circles */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />

          {/* Browser Container Frame */}
          <motion.div
            layoutId="preview-browser"
            className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden aspect-video relative flex flex-col min-h-[460px]"
          >
            {/* Header Address Bar */}
            <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              
              <div className="bg-white px-5 py-1 border border-slate-200/60 rounded-full text-xs text-slate-500 font-semibold select-none shadow-3xs flex items-center gap-1.5 max-w-xs truncate">
                <Globe size={11} className="text-indigo-500 shrink-0" />
                <span className="font-mono text-[11px] tracking-tight">{inputValue || 'yourname'}.onlypage.in</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase font-mono">
                  Live Preview
                </span>
              </div>
            </div>

            {/* Simulated Live Web Page (Changes according to selected industry preset) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-left relative flex flex-col md:flex-row gap-6">
              
              {/* Left Column: Headline and Interactive Booking / Contact Form */}
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase tracking-widest font-mono">
                    {activePersona.role}
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight leading-tight">
                    {activePersona.mockHeadline}
                  </h2>
                  
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 font-medium leading-relaxed max-w-md">
                    {activePersona.mockSub}
                  </p>
                </div>

                {/* --- REAL-TIME INTERACTIVE SUBMISSION FORM --- */}
                <div className="p-4 bg-slate-50/80 border border-slate-200/50 rounded-xl max-w-sm">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/30">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Capture Lead Form Widget
                    </span>
                    <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                      Google Sheets Synced
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {!formSubmitted ? (
                      <motion.form
                        key="v-form"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleVisitorSubmit}
                        className="space-y-2.5"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Name (e.g. Rahul)"
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                            className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <input
                            type="tel"
                            required
                            placeholder="Mobile / Email"
                            value={visitorPhone}
                            onChange={(e) => setVisitorPhone(e.target.value)}
                            className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Test instant lead capture</span>
                          <Send size={11} />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="v-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-3 text-center space-y-1.5"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-3xs">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                        <p className="text-xs font-bold text-slate-850">Lead captured instantly!</p>
                        <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                          Watch the CRM card on the left update in real-time.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Dynamic Services Catalog Grid */}
              <div className="flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center justify-between">
                    <span>Active Services Catalog CMS</span>
                    <span className="text-slate-300 font-medium">Auto-populated</span>
                  </h4>
                  
                  <div className="mt-3 space-y-2">
                    {activePersona.features.map((feature, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-100 hover:border-slate-200/80 hover:shadow-3xs rounded-xl flex items-center justify-between transition-all group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {feature}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100/50">
                          Active Collection
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3 mt-4">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[7px] font-extrabold text-slate-600">RS</div>
                    <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-[7px] font-extrabold text-indigo-600">AV</div>
                    <div className="w-6 h-6 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-[7px] font-extrabold text-pink-600">PK</div>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500">
                    Trusted by <span className="font-bold text-slate-800">4,800+</span> hyper-local businesses
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- LEFT FLOATING CARD: CONVERSION CRM PIPELINE --- */}
          <div className="absolute -left-10 bottom-6 hidden lg:block w-72 bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-4 text-left z-20 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users size={14} className="text-indigo-500" />
                Live CRM Contacts
              </span>
              <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                Active Sync
              </span>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {crmLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={index === 0 && lead.source === 'Interactive Mock' ? { opacity: 0, x: -20, height: 0 } : { opacity: 1 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200/80 transition-all flex items-center justify-between gap-2 overflow-hidden"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-800 tracking-tight">{lead.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{lead.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-500 block">{lead.time}</span>
                      <span className="text-[8px] font-mono text-indigo-500 font-bold uppercase">{lead.source}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* --- RIGHT FLOATING CARD: AUTOMATED WHATSAPP BOT CHAT --- */}
          <div className="absolute -right-6 top-16 hidden lg:block w-72 bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-4 text-left z-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <MessageSquare size={12} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850">WhatsApp OnlyBot</h4>
                  <p className="text-[9px] text-slate-400 font-semibold">Active AI Responding</p>
                </div>
              </div>
              <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                WhatsApp
              </span>
            </div>

            {/* Chat Box */}
            <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 max-h-[150px] overflow-y-auto font-sans">
              {waMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl text-[10.5px] leading-relaxed font-semibold max-w-[85%] ${
                    msg.sender === 'client'
                      ? 'bg-slate-200/80 text-slate-700 mr-auto'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-100/50 ml-auto'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="bg-emerald-50/50 border border-emerald-100/30 text-emerald-600 p-2 rounded-xl text-[10px] w-24 ml-auto text-center font-bold italic animate-pulse">
                  typing reply...
                </div>
              )}
            </div>

            {/* Simulated interactive customer query triggers */}
            <div className="mt-3.5 space-y-1.5">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Click customer query below to test AI:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleWaQuery(
                    "Are you open Sunday?",
                    `Yes! We are open from 10 AM to 6 PM on Sunday. Would you like to check available appointment slots?`
                  )}
                  className="p-1.5 bg-slate-100 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-[9px] font-bold text-slate-600 hover:text-slate-800 rounded-lg text-left transition-colors cursor-pointer"
                >
                  "Open Sunday?"
                </button>
                <button
                  onClick={() => handleWaQuery(
                    "What services do you offer?",
                    `We offer standard treatments such as ${activePersona.features[0]} and ${activePersona.features[1] || 'consultations'}.`
                  )}
                  className="p-1.5 bg-slate-100 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-[9px] font-bold text-slate-600 hover:text-slate-800 rounded-lg text-left transition-colors cursor-pointer"
                >
                  "Show Services"
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
