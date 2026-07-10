/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Persona } from '../types';
import { 
  Globe, LayoutGrid, Palette, Type, Check, 
  ArrowRight, Sparkles, Image as ImageIcon, Eye, RefreshCw
} from 'lucide-react';

interface WebsiteEditorSectionProps {
  selectedPersona: Persona | null;
  businessName: string;
  setBusinessName: (name: string) => void;
}

const PALETTES = [
  { name: 'Classic Blue', primary: 'bg-blue-600', text: 'text-blue-600', hover: 'hover:bg-blue-700', value: 'blue' },
  { name: 'Warm Rose', primary: 'bg-rose-500', text: 'text-rose-500', hover: 'hover:bg-rose-600', value: 'rose' },
  { name: 'Emerald', primary: 'bg-emerald-600', text: 'text-emerald-600', hover: 'hover:bg-emerald-700', value: 'emerald' },
  { name: 'Royal Indigo', primary: 'bg-indigo-600', text: 'text-indigo-600', hover: 'hover:bg-indigo-700', value: 'indigo' },
  { name: 'Cozy Amber', primary: 'bg-amber-500', text: 'text-amber-500', hover: 'hover:bg-amber-600', value: 'amber' }
];

const IMAGES_BY_THEME = {
  salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
  doctor: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80',
  student: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80',
  creator: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80',
  business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
  realestate: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80';

export default function WebsiteEditorSection({ selectedPersona, businessName, setBusinessName }: WebsiteEditorSectionProps) {
  // Preset defaults if no persona selected
  const activePersonaId = selectedPersona?.id || 'salon';
  const defaultHeadline = selectedPersona?.mockHeadline || 'Timeless Beauty, Crafted For You';
  const defaultSub = selectedPersona?.mockSub || 'Experience premium haircare and holistic facial treatments in the heart of the city.';
  const defaultServices = selectedPersona?.features || ['Hair Styling', 'Nail Spa', 'Facial Care'];

  // Local Editable States
  const [editedName, setEditedName] = useState(selectedPersona?.name || 'Glow Studio');
  const [headline, setHeadline] = useState(defaultHeadline);
  const [subText, setSubText] = useState(defaultSub);
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);
  const [selectedTheme, setSelectedTheme] = useState<'modern' | 'warm' | 'serif' | 'clean'>('warm');
  const [showServices, setShowServices] = useState(true);
  const [showBooking, setShowBooking] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState(IMAGES_BY_THEME[activePersonaId as keyof typeof IMAGES_BY_THEME] || DEFAULT_IMAGE);

  // Sync state if selected persona changes from BuiltForEveryoneSection
  useEffect(() => {
    if (selectedPersona) {
      setEditedName(selectedPersona.name);
      setHeadline(selectedPersona.mockHeadline);
      setSubText(selectedPersona.mockSub);
      setSelectedTheme(selectedPersona.mockTheme);
      setCustomImageUrl(IMAGES_BY_THEME[selectedPersona.id as keyof typeof IMAGES_BY_THEME] || DEFAULT_IMAGE);
      
      // Select appropriate palette based on persona
      if (selectedPersona.id === 'doctor') setSelectedPalette(PALETTES[2]); // Emerald
      else if (selectedPersona.id === 'student') setSelectedPalette(PALETTES[3]); // Indigo
      else if (selectedPersona.id === 'salon') setSelectedPalette(PALETTES[1]); // Rose
      else if (selectedPersona.id === 'creator') setSelectedPalette(PALETTES[4]); // Amber
      else setSelectedPalette(PALETTES[0]); // Blue
    }
  }, [selectedPersona]);

  // Update global business name slug on typing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setEditedName(text);
    const slug = text.toLowerCase().replace(/[^a-z0-9\-]/g, '');
    setBusinessName(slug || 'yourname');
  };

  const handleReset = () => {
    setEditedName(selectedPersona?.name || 'Glow Studio');
    setHeadline(defaultHeadline);
    setSubText(defaultSub);
    setSelectedPalette(PALETTES[0]);
    setSelectedTheme(selectedPersona?.mockTheme || 'warm');
    setShowServices(true);
    setShowBooking(true);
    setShowReviews(false);
    setCustomImageUrl(IMAGES_BY_THEME[activePersonaId as keyof typeof IMAGES_BY_THEME] || DEFAULT_IMAGE);
  };

  // Determine font family class
  const getFontClass = () => {
    if (selectedTheme === 'serif') return 'font-serif';
    if (selectedTheme === 'modern') return 'font-sans tracking-tight';
    if (selectedTheme === 'clean') return 'font-sans';
    return 'font-sans font-medium';
  };

  return (
    <section id="editor" className="py-24 bg-white border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            No-Code Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Simple to customize. Zero code required.
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg font-medium leading-relaxed">
            Play with our interactive builder workspace below. Edit text, swap color presets, and toggle database modules in real-time.
          </p>
        </div>

        {/* Live Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Simple Editing Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <LayoutGrid size={14} className="text-indigo-500" />
                  Editor Settings
                </span>
                <button
                  onClick={handleReset}
                  className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw size={10} />
                  Reset Defaults
                </button>
              </div>

              {/* Editable Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Business / Brand Name
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={handleNameChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  placeholder="Glow Studio"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Hosting URL: <span className="text-indigo-500 font-semibold">{businessName}.onlypage.in</span>
                </p>
              </div>

              {/* Editable Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Hero Headline
                </label>
                <textarea
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Timeless Beauty, Crafted For You"
                />
              </div>

              {/* Colors Palette selection */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Palette size={12} />
                  Color Scheme
                </label>
                <div className="flex flex-wrap gap-2">
                  {PALETTES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setSelectedPalette(p)}
                      className={`relative w-8 h-8 rounded-full ${p.primary} flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110 shadow-xs`}
                    >
                      {selectedPalette.value === p.value && (
                        <Check size={14} className="stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Updates booking buttons and highlight boundaries.</p>
              </div>

              {/* Typography selectors */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Type size={12} />
                  Typography Feel
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'modern', label: 'Modern', style: 'font-sans font-bold' },
                    { id: 'warm', label: 'Warm', style: 'font-sans font-medium' },
                    { id: 'serif', label: 'Editorial', style: 'font-serif font-bold' },
                    { id: 'clean', label: 'Minimal', style: 'font-mono' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id as any)}
                      className={`text-[10px] py-2 rounded-lg border font-semibold capitalize cursor-pointer transition-all ${
                        selectedTheme === t.id
                          ? 'bg-white border-indigo-200 text-indigo-600 shadow-3xs'
                          : 'bg-transparent border-slate-200/50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Visible Page Modules
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'services', label: 'Services Grid List', val: showServices, setVal: setShowServices },
                    { id: 'booking', label: 'Online Booking Engine', val: showBooking, setVal: setShowBooking },
                    { id: 'reviews', label: 'Client Reviews Box', val: showReviews, setVal: setShowReviews }
                  ].map((sec) => (
                    <label key={sec.id} className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-3xs cursor-pointer hover:border-slate-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={sec.val}
                        onChange={(e) => sec.setVal(e.target.checked)}
                        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span>{sec.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom mini cta */}
            <div className="mt-8 pt-4 border-t border-slate-200/60 text-left">
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">✨ Instant Deployment</span>
              <p className="text-[11px] text-slate-400 mt-1">Changes are compiled, verified, and active in milliseconds.</p>
            </div>
          </div>

          {/* Right Column: High-Fidelity Website Preview (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-stretch justify-start">
            
            {/* Device Mockup Header */}
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-t-2xl flex items-center justify-between shadow-lg select-none">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>
              <div className="bg-white/10 px-4 py-0.5 rounded-md text-[10px] font-mono text-slate-300 tracking-tight flex items-center gap-1.5">
                <Globe size={10} className="text-emerald-400" />
                <span>https://{businessName}.onlypage.in</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold">
                <Eye size={12} />
                <span>Live View</span>
              </div>
            </div>

            {/* Simulated Webpage Body */}
            <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between text-left relative">
              
              {/* Inside Page Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                  {editedName || 'Glow Studio'}
                </span>
                <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                  <span>Home</span>
                  {showServices && <span>Services</span>}
                  {showBooking && <span>Book Now</span>}
                </div>
              </div>

              {/* Inside Page Hero */}
              <div className="p-8 flex-1 flex flex-col justify-start">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <h1 className={`text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight ${getFontClass()}`}>
                      {headline || 'Timeless Beauty, Crafted For You'}
                    </h1>
                    <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                      {subText || 'Experience premium haircut and wellness treatments at your leisure.'}
                    </p>
                    
                    {showBooking && (
                      <button className={`mt-5 text-white text-[11px] font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors ${selectedPalette.primary} ${selectedPalette.hover}`}>
                        Request Booking
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-5">
                    <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner flex items-center justify-center relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={customImageUrl}
                        alt="Workspace Preview"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200/50 flex items-center gap-1 text-[8px] font-bold text-slate-600">
                        <ImageIcon size={9} />
                        <span>Visual Asset</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visible Services Module */}
                <AnimatePresence>
                  {showServices && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-10 pt-6 border-t border-slate-100"
                    >
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Our Core Services</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {defaultServices.slice(0, 3).map((srv, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
                            <div>
                              <p className="font-bold text-[11px] text-slate-800">{srv}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">Top tier quality assurance.</p>
                            </div>
                            <span className={`text-[10px] font-bold mt-2 ${selectedPalette.text}`}>₹499+</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Visible Reviews Module */}
                <AnimatePresence>
                  {showReviews && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-8 pt-6 border-t border-slate-100"
                    >
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Client Reviews</h3>
                      <div className="p-3 bg-indigo-50/20 rounded-lg border border-indigo-100/30">
                        <p className="text-[11px] font-medium text-slate-600 italic">
                          "Outstanding service! The booking process took me 5 seconds, and OnlyPage's WhatsApp bot sent me instant driving directions on Saturday morning."
                        </p>
                        <p className="text-[9px] font-bold text-slate-800 mt-2">— Sneha Shah, Loyal Client</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Inside Page Footer */}
              <div className="bg-slate-50/60 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>&copy; {editedName || 'Glow Studio'} Inc.</span>
                <span>Powered by OnlyPage.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
