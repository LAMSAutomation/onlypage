/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, CheckCircle, ShieldCheck, X, ArrowRight } from 'lucide-react';

import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import AiBuilderSection from './components/AiBuilderSection';
import BuiltForEveryoneSection from './components/BuiltForEveryoneSection';
import WebsiteEditorSection from './components/WebsiteEditorSection';
import DashboardSection from './components/DashboardSection';
import WhatsAppSection from './components/WhatsAppSection';
import FeaturesSection from './components/FeaturesSection';
import TemplatesSection from './components/TemplatesSection';
import PrdExplorer from './components/PrdExplorer';
import PricingSection from './components/PricingSection';
import { Persona } from './types';
import { PERSONAS } from './data';

export default function App() {
  const [businessName, setBusinessName] = useState('yourname');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(PERSONAS[0]); // default to salon
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleClaimDomain = () => {
    setShowClaimModal(true);
  };

  const handleSelectTemplate = (tempId: string) => {
    // Select persona corresponding to template ID
    if (tempId === 'temp-1') {
      setSelectedPersona(PERSONAS[4]); // Business
      showToast('Loaded Apex Professional Template in Editor');
    } else if (tempId === 'temp-2') {
      setSelectedPersona(PERSONAS[3]); // Creator
      showToast('Loaded Lumina Creative Template in Editor');
    } else if (tempId === 'temp-3') {
      setSelectedPersona(PERSONAS[0]); // Salon
      showToast('Loaded Elysian Boutique Template in Editor');
    } else if (tempId === 'temp-4') {
      setSelectedPersona(PERSONAS[2]); // Student
      showToast('Loaded Vanguard Minimalist Template in Editor');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Floating Global Glass Header */}
      <Header onScrollTo={handleScrollTo} />

      {/* --- SECTION 1: HERO --- */}
      <HeroSection 
        businessName={businessName} 
        setBusinessName={setBusinessName} 
        onClaimDomain={handleClaimDomain} 
      />

      {/* --- SECTION 2: AI BUILDER DEMO --- */}
      <AiBuilderSection businessName={businessName} />

      {/* --- SECTION 3: BUILT FOR EVERYONE --- */}
      <BuiltForEveryoneSection 
        onSelectPersona={(p) => {
          setSelectedPersona(p);
          showToast(`Successfully loaded preset for: ${p.name}`);
        }} 
        onScrollTo={handleScrollTo} 
      />

      {/* --- SECTION 4: EASY WEBSITE EDITOR --- */}
      <WebsiteEditorSection 
        selectedPersona={selectedPersona} 
        businessName={businessName}
        setBusinessName={setBusinessName}
      />

      {/* --- SECTION 5: BUSINESS DASHBOARD --- */}
      <DashboardSection businessName={businessName} />

      {/* --- SECTION 6: WHATSAPP ASSISTANT --- */}
      <WhatsAppSection businessName={businessName} />

      {/* --- SECTION 7: FEATURES BENTO --- */}
      <FeaturesSection onScrollTo={handleScrollTo} />

      {/* --- SECTION 8: TEMPLATES SHOWCASE --- */}
      <TemplatesSection 
        onSelectTemplate={handleSelectTemplate} 
        onScrollTo={handleScrollTo} 
      />

      {/* --- SECTION 8.5: PRD SPEC EXPLORER --- */}
      <PrdExplorer />

      {/* --- SECTION 9: PRICING PLANS --- */}
      <PricingSection 
        onPlanSelect={(planName) => {
          showToast(`Redirecting to checkout for OnlyPage ${planName} Plan...`);
        }} 
      />

      {/* --- SECTION 10: FINAL CTA --- */}
      <section className="py-24 bg-radial from-slate-50 to-white relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
            Launch Today
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto font-sans leading-tight">
            Your idea deserves a place online.
          </h2>
          
          <p className="text-slate-500 text-sm sm:text-base font-semibold max-w-lg mx-auto">
            Build your website, structure booking forms, accept leads, and automate client inquiries on WhatsApp business in minutes. No credit card required.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleScrollTo('pricing')}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              Create your OnlyPage
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => handleScrollTo('ai-demo')}
              className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-350 text-slate-700 font-bold px-8 py-3.5 rounded-xl transition-all shadow-2xs inline-flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} className="text-blue-500" />
              Try AI Generator Demo
            </button>
          </div>

          <div className="pt-6 text-xs text-slate-400 font-semibold select-none flex justify-center items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Join over 12,500+ independent operators scaling online with OnlyPage</span>
          </div>
        </div>
      </section>

      {/* --- PLATFORM FOOTER --- */}
      <Footer onScrollTo={handleScrollTo} />

      {/* DYNAMIC CONFIRMATION TOAST FLOATER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-sm w-max border border-white/10"
          >
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOMAIN CLAIMED SUCCESS OVERLAY DIALOG */}
      <AnimatePresence>
        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClaimModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full relative z-10 shadow-2xl text-center space-y-4"
            >
              <button
                onClick={() => setShowClaimModal(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xl mx-auto">
                ✨
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">Your OnlyPage domain is reserved!</h3>
                <p className="text-xs text-slate-500 font-medium">
                  We have successfully held <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">{businessName}.onlypage.in</span> for you.
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                This domain has been propagated across our live visual sandboxes. Try editing your website below, or finalize the checkout to claim it forever.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowClaimModal(false);
                    handleScrollTo('editor');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Configure Website in Editor
                </button>
                <button
                  onClick={() => {
                    setShowClaimModal(false);
                    handleScrollTo('pricing');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Go to Pricing Tiers
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
