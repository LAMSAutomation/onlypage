import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, Tablet, Smartphone, Search, Plus, Trash2, Copy, MoveUp, MoveDown, 
  Sparkles, Check, ChevronDown, Settings, Layers, Database, Image as ImageIcon, 
  Sliders, ChevronRight, RotateCcw, FileText, CheckCircle2, ArrowLeft, Send, 
  Layout, Type, Palette, SlidersHorizontal, PlusCircle, Save, ExternalLink, 
  Eye, Globe, RefreshCw, X, Sliders as SliderIcon, Type as FontIcon, 
  Grid, Compass, Info, CheckSquare, MessageSquare, Briefcase, DollarSign, List,
  MapPin, Phone, Mail, Award, ThumbsUp, Star, Palette as ThemeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BLOCK_CATEGORIES, BLOCK_VARIANTS_MAP, INDUSTRY_PRESETS } from './builder-data';
import { BuilderRenderer } from './builder-renderer';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface BlockCSSStyles {
  // Spacing & Layout
  paddingTop: number;       // in px
  paddingBottom: number;    // in px
  paddingLeft: number;      // in px
  paddingRight: number;     // in px
  gapSize: number;          // in px
  maxWidth: number;         // in px (content constraint)
  textAlign: 'left' | 'center' | 'right';
  
  // Theme & Colors (Hex values)
  backgroundColor: string;
  backgroundGradient: string; // e.g. "linear-gradient(...)"
  useGradient: boolean;
  textColor: string;
  subtitleColor: string;
  accentColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  
  // Typography
  fontFamily: string;
  titleSize: number;        // in px
  titleWeight: 'light' | 'normal' | 'semibold' | 'bold' | 'black';
  subtitleSize: number;     // in px
  bodySize: number;         // in px
  lineHeight: number;       // standard line height scale (e.g. 1.2, 1.5, 1.6)

  // Card Styling (For sub-items in Features/Pricing/Testimonials)
  cardBgColor: string;
  cardTextColor: string;
  cardBorderRadius: number; // in px
  cardShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  cardBorderWidth: number;  // in px
  cardBorderColor: string;

  // Global Section Borders & Shadow
  borderRadius: number;     // in px (outer section container if any)
  borderWidth: number;      // in px
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  boxShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Interactive Buttons
  buttonBgColor: string;
  buttonTextColor: string;
  buttonBorderRadius: number; // in px
  buttonHoverScale: boolean;

  // Interactive Backgrounds & Animations
  bgType?: 'color' | 'gradient' | 'image' | string;
  bgImageUrl?: string;
  bgImageOpacity?: number;
  bgImageSize?: 'cover' | 'contain' | 'auto' | string;
  bgImageAttachment?: 'scroll' | 'fixed' | string;
  clickResponse?: 'none' | 'scale-down' | 'scale-up' | 'bounce' | 'pulse' | 'flash' | 'ripple' | string;
  hoverEffect?: 'none' | 'lift' | 'glow' | 'tilt' | 'scale' | string;
}

export interface WebBlock {
  id: string;
  type: 'Hero' | 'Features' | 'Pricing' | 'Testimonials' | 'Contact' | 'Footer' | 'Gallery' | 'Business' | 'Forms' | 'Special' | 'CTA' | 'Navigation';
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl?: string;
  btnText?: string;
  variant?: string;
  // Gallery Slide Images
  galleryImages?: { id: string; url: string; title: string; subtitle: string; aspect?: string }[];
  // Features lists
  features?: { id: string; title: string; desc: string; icon: string }[];
  // Pricing plans
  pricing?: { id: string; tier: string; price: string; features: string[]; btnText: string; popular?: boolean }[];
  // Testimonial list
  testimonials?: { id: string; name: string; role: string; content: string; avatar: string; rating: number }[];
  // Contact details
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  showMap?: boolean;
  // Footer content
  copyright?: string;
  links?: { id: string; label: string; url: string }[];
  // FAQ, Stats, Steps
  faqs?: { id: string; q: string; a: string }[];
  stats?: { id: string; label: string; val: number; suffix: string }[];
  steps?: { id: string; step: string; title: string; desc: string }[];
  styles: BlockCSSStyles;
}

export interface WebPage {
  id: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
}

export const GOOGLE_FONTS_LIST = [
  "Inter", "Plus Jakarta Sans", "Poppins", "Montserrat", "Open Sans", "Roboto", "Lato", "Raleway", "DM Sans", "Nunito", "Albert Sans",
  "Playfair Display", "Merriweather", "Lora", "Cormorant Garamond", "EB Garamond", "Georgia",
  "Space Grotesk", "Outfit", "Syne", "Oswald", "Bebas Neue", "Cinzel", "Lexend",
  "JetBrains Mono", "Fira Code", "Space Mono", "Source Code Pro",
  "Caveat", "Pacifico", "Shadows Into Light", "Great Vibes", "Architects Daughter", "Dancing Script"
];

const INITIAL_BLOCKS = INDUSTRY_PRESETS['portfolio'].blocks as unknown as WebBlock[];

export function WebsiteBuilderEditor({ onExit }: { onExit: () => void }) {
  // --- CORE STATE ---
  const [blocks, setBlocks] = useState<WebBlock[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(INITIAL_BLOCKS[0]?.id || null);
  const [selectedSubElement, setSelectedSubElement] = useState<'background' | 'badge' | 'title' | 'subtitle' | 'button' | 'card' | 'media' | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  
  // Navigation & Workspace Preferences
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftSidebarTab, setLeftSidebarTab] = useState<'add-blocks' | 'layers' | 'seo'>('add-blocks');
  const [rightInspectorTab, setRightInspectorTab] = useState<'content' | 'css-styles'>('css-styles');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  
  // Undo/Redo tracking
  const [history, setHistory] = useState<WebBlock[][]>([INITIAL_BLOCKS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  // Page Setup & SEO
  const [seoTitle, setSeoTitle] = useState('My Portfolio | Live OnlyPage Build');
  const [seoDesc, setSeoDesc] = useState('Explore visual designs built instantly with the OnlyPage live editor.');

  // Alert Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Search and tabs for Lego Builder Block Library
  const [blockSearch, setBlockSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Hero');

  // AI Prompt transformation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Auto-save simulation
  useEffect(() => {
    if (saveStatus === 'dirty') {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        setSaveStatus('saved');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Helper to trigger toast alerts
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // State update helper with history push
  const updateBlocksState = (newBlocks: WebBlock[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, newBlocks]);
    setHistoryIndex(updatedHistory.length);
    setBlocks(newBlocks);
    setSaveStatus('dirty');
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
      triggerToast('Undo action applied', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
      triggerToast('Redo action applied', 'info');
    }
  };

  // Canvas block action modifiers
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateBlocksState(updated);
    triggerToast(`Moved section ${direction}`, 'success');
  };

  const handleDeleteBlock = (id: string, name: string) => {
    if (blocks.length <= 1) {
      triggerToast('Canvas must contain at least one block!', 'error');
      return;
    }
    const updated = blocks.filter(b => b.id !== id);
    updateBlocksState(updated);
    if (selectedBlockId === id) {
      setSelectedBlockId(updated[0]?.id || null);
    }
    triggerToast(`Deleted ${name} section`, 'info');
  };

  const handleDuplicateBlock = (block: WebBlock) => {
    const index = blocks.findIndex(b => b.id === block.id);
    const duplicated: WebBlock = JSON.parse(JSON.stringify(block));
    duplicated.id = `${block.type}-${Date.now()}`;
    duplicated.title = `${block.title} (Copy)`;
    
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    updateBlocksState(updated);
    setSelectedBlockId(duplicated.id);
    triggerToast(`Duplicated ${block.type} section`, 'success');
  };

  // Interactive style tuning helpers (CSS Inspector updates)
  const handleUpdateBlockStyle = (key: keyof BlockCSSStyles, value: any) => {
    if (!selectedBlockId) return;
    const updated = blocks.map(b => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          styles: {
            ...b.styles,
            [key]: value
          }
        };
      }
      return b;
    });
    setBlocks(updated); // fast state update
    setSaveStatus('dirty');
  };

  const handleUpdateBlockContent = (key: string, value: any) => {
    if (!selectedBlockId) return;
    const updated = blocks.map(b => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          [key]: value
        };
      }
      return b;
    });
    setBlocks(updated);
    setSaveStatus('dirty');
  };

  // Load a complete Industry Preset
  const handleLoadIndustryPreset = (presetKey: keyof typeof INDUSTRY_PRESETS) => {
    const selectedPreset = INDUSTRY_PRESETS[presetKey];
    if (selectedPreset) {
      const clonedBlocks = JSON.parse(JSON.stringify(selectedPreset.blocks)) as unknown as WebBlock[];
      updateBlocksState(clonedBlocks);
      setSelectedBlockId(clonedBlocks[0]?.id || null);
      triggerToast(`Loaded ${presetKey} website preset!`, 'success');
    }
  };

  const generateDefaultBlock = (category: string, variantKey: string): WebBlock => {
    const isDark = ['gradient-glow', 'saas-modern', '3d-mesh', 'aurora-sky', 'video-simulate', 'bento-box', 'gradient-cta', 'app-download'].includes(variantKey);
    
    const blockStyles: BlockCSSStyles = {
      paddingTop: 80,
      paddingBottom: 80,
      paddingLeft: 24,
      paddingRight: 24,
      gapSize: 24,
      maxWidth: 1200,
      textAlign: (category === 'Hero' || category === 'CTA' || category === 'Pricing') ? 'center' : 'left',
      backgroundColor: isDark ? '#030712' : '#ffffff',
      textColor: isDark ? '#f9fafb' : '#0f172a',
      subtitleColor: isDark ? '#9ca3af' : '#475569',
      accentColor: '#3b82f6',
      badgeBgColor: isDark ? '#1e1b4b' : '#eff6ff',
      badgeTextColor: isDark ? '#c084fc' : '#3b82f6',
      useGradient: isDark,
      backgroundGradient: isDark ? 'linear-gradient(135deg, #090514 0%, #030712 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Inter',
      titleSize: category === 'Hero' ? 48 : 34,
      titleWeight: 'bold',
      subtitleSize: 15,
      bodySize: 13,
      lineHeight: 1.4,
      cardBgColor: isDark ? '#111827' : '#f8fafc',
      cardTextColor: isDark ? '#f9fafb' : '#0f172a',
      cardBorderRadius: 12,
      cardShadow: 'md',
      cardBorderWidth: 1,
      cardBorderColor: isDark ? '#1f2937' : '#cbd5e1',
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '',
      borderStyle: 'solid',
      boxShadow: 'none',
      buttonBgColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      buttonBorderRadius: 8,
      buttonHoverScale: true
    };

    const id = `${category.toLowerCase()}-${Date.now()}`;
    
    const defaultData: any = {
      Hero: {
        title: variantKey === 'aurora-sky' ? 'Rejuvenate Your Senses. Restore Your Glow.' : 'Transform Your Online Experience',
        subtitle: 'Build responsive, highly optimized landing pages instantly with the easiest visual block builder.',
        badge: 'NEXT-GEN PAGE BUILDER',
        btnText: 'Start Building Free',
        imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
      },
      Features: {
        title: 'Exceptional Visual Capabilities',
        subtitle: 'All visual blocks are responsive, interactive, and customizable.',
        badge: 'CORE ADVANTAGES',
        features: [
          { id: 'f-1', title: 'Aesthetic Lego System', desc: 'Combine premade sections and create a beautiful layout.', icon: 'Sliders' },
          { id: 'f-2', title: 'Interactive Spotlight Effect', desc: 'Dynamic radial lights follow the cursor smoothly.', icon: 'Sparkles' },
          { id: 'f-3', title: 'Figma-Like Controls', desc: 'Precision styles like padding, borders, shadow adjustments.', icon: 'Layout' }
        ]
      },
      Pricing: {
        title: 'Flexible Pricing Plans',
        subtitle: 'Choose the model that fits your business scaling needs.',
        badge: 'TRANSPARENT PLANS',
        pricing: [
          { id: 'p-1', tier: 'Starter Pack', price: '$0', features: ['3 visual custom pages', 'Standard responsive canvas', 'Local draft autosaves'], btnText: 'Launch Free' },
          { id: 'p-2', tier: 'Pro Studio', price: '$29', features: ['Unlimited visual pages', 'Custom domain mapping', 'Advanced moving effects', 'Premium bento structures'], btnText: 'Go Pro Today', popular: true },
          { id: 'p-3', tier: 'Enterprise Spec', price: '$99', features: ['Dedicated cloud database', 'Team collaboration seats', 'A/B landing analysis', 'Priority support line'], btnText: 'Contact Enterprise' }
        ]
      },
      Testimonials: {
        title: 'Loved By Digital Creators',
        subtitle: 'Read why elite designers use OnlyPage for their web layouts.',
        badge: 'COMMUNITY VOICES',
        testimonials: [
          { id: 't-1', name: 'Aravind Sharma', role: 'UX Director, DesignCraft', content: 'The easiest block builder I have ever experienced. Accidentally created a beautiful portfolio in 5 minutes!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', rating: 5 },
          { id: 't-2', name: 'Sarah Jenkins', role: 'SaaS Creator', content: 'The bento box feature maps apple-grade portfolios instantly. Completely replaced our web agency workflow!', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', rating: 5 }
        ]
      },
      Gallery: {
        title: 'Visual Brand Portfolio',
        subtitle: 'High-definition showcases of premium craft and digital structures.',
        badge: 'BRAND REVELATION',
        features: [
          { id: 'g-1', title: 'Luxury Residences', desc: 'Modern high-rises and custom private villas.', icon: 'Check' },
          { id: 'g-2', title: 'Creative Studio', desc: 'Fluid interactive assets rendering 3D shaders.', icon: 'Check' },
          { id: 'g-3', title: 'Design System', desc: 'Full-bleed layout mockups with beautiful margins.', icon: 'Check' }
        ]
      },
      Business: {
        title: 'Premium Specialized Services',
        subtitle: 'Curated solutions designed for wellness clinics, doctors, and luxury salons.',
        badge: 'SPECIALTIES',
        features: [
          { id: 'b-1', title: 'Signature Treatment', desc: '1 hour • Complete exfoliating facial rejuvenation.', icon: 'Sparkles' },
          { id: 'b-2', title: 'Deep Tissue Balance', desc: '1.5 hours • Restorative oil massages.', icon: 'Heart' },
          { id: 'b-3', title: 'Advanced Skin Therapy', desc: '45 mins • Dynamic peptide infusions.', icon: 'Check' }
        ]
      },
      Forms: {
        title: 'Initiate Your Consultation',
        subtitle: 'Confirm your custom slot online. No upfront deposit required.',
        badge: 'SECURE RESERVATIONS',
        btnText: 'Confirm Booking Now',
        contactEmail: 'contact@onlypage.io',
        contactPhone: '+1 (555) 019-2834',
        contactAddress: 'Indiranagar, Bengaluru',
      },
      Special: {
        title: 'Timeline & Frequently Asked Questions',
        subtitle: 'Find instant answers to common questions about our visual block editor.',
        badge: 'TIMELINES & FAQ',
        features: [
          { id: 's-1', title: 'Is the hosting permanent?', desc: 'Yes, all published sites are hosted directly on Google Cloud Run with custom SSL.', icon: 'Globe' },
          { id: 's-2', title: 'Can I export the clean code?', desc: 'Absolutely, you can export the production-ready React + Tailwind package anytime.', icon: 'Sliders' }
        ]
      },
      CTA: {
        title: 'Ready to Unleash Your Brand Potential?',
        subtitle: 'Join over 10,000 creators designing the future of landing pages on OnlyPage.',
        badge: 'HIGH-CONVERSION CTA',
        btnText: 'Create Your First Page',
      },
      Footer: {
        title: 'OnlyPage',
        copyright: '© 2026 OnlyPage Inc. All rights reserved. Crafting beautiful visual layouts.',
        links: [
          { id: 'l-1', label: 'Dashboard', url: '#' },
          { id: 'l-2', label: 'Privacy Policy', url: '#' },
          { id: 'l-3', label: 'Terms of Service', url: '#' }
        ]
      }
    }[category] || {};

    return {
      id,
      type: category as any,
      variant: variantKey,
      title: '',
      subtitle: '',
      styles: blockStyles,
      ...defaultData
    } as WebBlock;
  };

  // Add block preset templates from Variant library
  const addBlockVariant = (category: string, variantKey: string) => {
    const categoryVariants = BLOCK_VARIANTS_MAP[category];
    if (!categoryVariants) return;
    const template = categoryVariants.find(v => v.id === variantKey);
    if (!template) return;

    const newBlock = generateDefaultBlock(category, variantKey);

    const updated = [...blocks];
    const footerIndex = updated.findIndex(b => b.type === 'Footer');
    if (footerIndex !== -1) {
      updated.splice(footerIndex, 0, newBlock);
    } else {
      updated.push(newBlock);
    }

    updateBlocksState(updated);
    setSelectedBlockId(newBlock.id);
    triggerToast(`Added ${newBlock.type} variant [${variantKey}] to canvas`, 'success');
  };

  // Submit Prompt to Gemini API backend route
  const handleAiStyling = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    triggerToast('Sending design instructions to OnlyPage AI...', 'info');

    try {
      const response = await fetch('/api/ai/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, blocks })
      });

      if (!response.ok) {
        throw new Error('AI styling request failed');
      }

      const data = await response.json();
      if (data.blocks) {
        updateBlocksState(data.blocks);
        triggerToast(data.message || 'Styles transformed by AI successfully!', 'success');
        setAiPrompt('');
      } else {
        throw new Error('Invalid response payload');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast('AI Service offline. Initializing local aesthetic backup transformation...', 'error');
      
      // Resilient backup transformations
      const isLuxury = aiPrompt.toLowerCase().includes("luxur") || aiPrompt.toLowerCase().includes("gold");
      const isCosmic = aiPrompt.toLowerCase().includes("cosmic") || aiPrompt.toLowerCase().includes("dark") || aiPrompt.toLowerCase().includes("purple");
      const isMinimal = aiPrompt.toLowerCase().includes("minim");

      const simulated = blocks.map((b: any) => {
        const styles = { ...b.styles };
        if (isLuxury) {
          styles.fontFamily = "Playfair Display";
          styles.backgroundColor = "#09090b";
          styles.textColor = "#f5f5f5";
          styles.subtitleColor = "#a3a3a3";
          styles.accentColor = "#d4af37";
          styles.badgeBgColor = "#1a1a1a";
          styles.badgeTextColor = "#d4af37";
          styles.buttonBgColor = "#d4af37";
          styles.buttonTextColor = "#09090b";
        } else if (isCosmic) {
          styles.fontFamily = "Space Grotesk";
          styles.backgroundColor = "#030712";
          styles.textColor = "#f9fafb";
          styles.subtitleColor = "#9ca3af";
          styles.accentColor = "#a855f7";
          styles.badgeBgColor = "#1e1b4b";
          styles.badgeTextColor = "#c084fc";
          styles.buttonBgColor = "#a855f7";
          styles.buttonTextColor = "#ffffff";
          styles.useGradient = true;
          styles.backgroundGradient = "linear-gradient(135deg, #090514 0%, #030712 100%)";
        } else if (isMinimal) {
          styles.fontFamily = "Inter";
          styles.backgroundColor = "#ffffff";
          styles.textColor = "#0f172a";
          styles.subtitleColor = "#475569";
          styles.accentColor = "#2563eb";
          styles.badgeBgColor = "#f1f5f9";
          styles.badgeTextColor = "#2563eb";
          styles.buttonBgColor = "#0f172a";
          styles.buttonTextColor = "#ffffff";
          styles.useGradient = false;
        }
        return { ...b, styles };
      });
      updateBlocksState(simulated);
      setAiPrompt('');
    } finally {
      setIsAiLoading(false);
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);


  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 font-sans overflow-hidden select-none" id="builder-root">
      
      {/* ==========================================
          TOP BAR (64px) - Figma-Like Nav
          ========================================== */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between shrink-0 z-40" id="top-nav-bar">
        
        {/* Left Section: Back, Brand & Active Domain */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            id="back-dashboard-btn"
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </button>
          
          <div className="h-4 w-px bg-slate-800" />
          
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-md shadow-blue-500/20">O</span>
              <span>OnlyPage <span className="text-[10px] text-blue-400 font-normal ml-0.5 px-1 py-0.5 bg-blue-900/30 border border-blue-500/20 rounded">Figma Mode</span></span>
            </span>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 font-mono">my-portfolio.onlypage.in</span>
              <ExternalLink size={10} className="text-slate-500 hover:text-slate-300 cursor-pointer" onClick={() => setShowPublishModal(true)} />
            </div>
          </div>
        </div>

        {/* Middle Section: Viewport Controls */}
        <div className="flex items-center gap-5">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {[
              { id: 'desktop' as const, icon: Laptop, label: 'Desktop (100%)' },
              { id: 'tablet' as const, icon: Tablet, label: 'Tablet (768px)' },
              { id: 'mobile' as const, icon: Smartphone, label: 'Mobile (390px)' }
            ].map(dev => {
              const Icon = dev.icon;
              const isSelected = viewportMode === dev.id;
              return (
                <button
                  key={dev.id}
                  onClick={() => {
                    setViewportMode(dev.id);
                    triggerToast(`Viewport scaled to ${dev.id} layout`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow shadow-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  id={`viewport-toggle-${dev.id}`}
                  title={dev.label}
                >
                  <Icon size={13} />
                  <span className="hidden lg:inline text-[10px]">{dev.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Undo/Redo & Save status & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Saved Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-slate-900/60 border border-slate-800/50 px-2.5 py-1.5 rounded-lg">
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-emerald-400">All changes synced</span>
              </>
            ) : saveStatus === 'saving' ? (
              <>
                <RefreshCw size={12} className="text-blue-500 animate-spin" />
                <span className="text-blue-400">Syncing to cloud...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                <span className="text-amber-400 font-bold">Unsaved draft</span>
              </>
            )}
          </div>

          {/* Undo/Redo Controls */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                historyIndex > 0 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              id="undo-btn"
              title="Undo Last Action"
            >
              <RotateCcw size={14} className="transform -scale-x-100" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                historyIndex < history.length - 1 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              id="redo-btn"
              title="Redo Action"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Live Preview & Publish */}
          <button 
            onClick={() => setShowLivePreviewModal(true)}
            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            id="preview-site-btn"
          >
            <Eye size={13} />
            <span>Live Preview</span>
          </button>
          
          <button 
            onClick={() => setShowPublishModal(true)}
            className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
            id="publish-site-btn"
          >
            <Globe size={13} />
            <span>Publish Site</span>
          </button>
        </div>
      </header>

      {/* ==========================================
          MAIN AREA LAYOUT
          ========================================== */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        
        {/* ==========================================
            LEFT SIDEBAR (280px) - Block selection & Layers
            ========================================== */}
        <aside className="w-[280px] bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0 z-10" id="left-sidebar">
          
          {/* Tab Selector buttons */}
          <div className="grid grid-cols-3 border-b border-slate-800 p-1.5 bg-slate-950">
            {[
              { id: 'add-blocks' as const, label: 'Add Blocks', icon: PlusCircle },
              { id: 'layers' as const, label: 'Layers Tree', icon: Layers },
              { id: 'seo' as const, label: 'Page SEO', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = leftSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLeftSidebarTab(tab.id)}
                  className={`py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected 
                      ? 'bg-slate-900 text-white border border-slate-800 shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                  id={`left-tab-${tab.id}`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            
            {/* 1. ADD BLOCKS TAB */}
            {leftSidebarTab === 'add-blocks' && (
              <div className="space-y-6" id="add-blocks-panel">
                
                {/* ✨ BRAND NEW: ONLYPAGE AI COPILOT */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 shadow-lg shadow-indigo-950/20 space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-400">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>ONLYPAGE AI COPILOT</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">Type visual instructions to completely transform the typography, colors, and layout aesthetics.</p>
                  
                  <div className="space-y-2">
                    <textarea 
                      rows={2}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. 'Make it look luxury gold', 'Soft warm pastel', 'Dark high-tech cyber'"
                      className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-indigo-500 resize-none font-sans"
                    />
                    <button 
                      onClick={handleAiStyling}
                      disabled={isAiLoading}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/50 text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10"
                    >
                      {isAiLoading ? (
                        <>
                          <RefreshCw size={11} className="animate-spin" />
                          <span>RE-STYLING ASSETS...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={11} />
                          <span>RE-STYLE CANVAS</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 🏢 BRAND NEW: INDUSTRY TEMPLATE PRESETS */}
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Database size={11} className="text-blue-400" />
                    <span>Industry Presets</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(INDUSTRY_PRESETS) as Array<keyof typeof INDUSTRY_PRESETS>).map(key => (
                      <button
                        key={key}
                        onClick={() => handleLoadIndustryPreset(key)}
                        className="p-2 text-left bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-all cursor-pointer"
                      >
                        <p className="text-[10px] font-black text-slate-200">{key}</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">Template pack</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🔥 BRAND NEW: LEGO BLOCK VARIANT MARKETPLACE */}
                <div className="space-y-3.5 border-t border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Layout size={11} className="text-blue-400" />
                      <span>Block Library</span>
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono">Variants Mode</span>
                  </div>

                  {/* Horizontal scrolling Categories bar */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800 shrink-0">
                    {BLOCK_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer border ${
                          activeCategory === cat.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Curated list of specific premium variants for the active Category */}
                  <div className="space-y-2 pt-1">
                    {BLOCK_VARIANTS_MAP[activeCategory]?.map(v => (
                      <div
                        key={v.id}
                        onClick={() => addBlockVariant(activeCategory, v.id)}
                        className="group p-3 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-blue-600/40 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-slate-200 group-hover:text-white uppercase tracking-tight">{v.id.replace('-', ' ')}</span>
                          <span className="text-[8px] bg-slate-800 text-slate-400 group-hover:bg-blue-950 group-hover:text-blue-300 px-1.5 py-0.5 rounded font-bold transition-all">ADD</span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-normal group-hover:text-slate-400">
                          {v.id === 'minimal' && 'Clean typography layout with elegant badges'}
                          {v.id === 'split' && 'Asymmetric block split with beautiful mockups'}
                          {v.id === 'saas-modern' && 'Sleek dashboard mockups, grid dots, and dark cards'}
                          {v.id === 'gradient-glow' && 'Stunning spotlight mask overlay with floating particles'}
                          {v.id === 'aurora-sky' && 'Breathtaking canvas with fluid moving aurora backgrounds'}
                          {v.id === '3d-mesh' && 'Cyber dot-grid overlays connected with animated beams'}
                          {v.id === 'video-simulate' && 'Embedded media visual mockup with hover-active play triggers'}
                          {v.id === 'bento-box' && 'Premium asymmetrical card arrangements for clean feature showcase'}
                          {v.id === 'alternating' && 'Fluid alternating flow sheets featuring staggered media steps'}
                          {v.id === 'marquee-logos' && 'Infinite sliding marquee row to showcase premium client logos'}
                          {v.id === 'slider' && 'Interactive comparison layout with sliding comparison node'}
                          {v.id === 'treatment-list' && 'Luxury, minimalist itemized grid layout with CTA booking triggers'}
                          {v.id === 'active-offer' && 'Attention-grabbing discount card with functional claimed code state'}
                          {v.id === 'wall-of-love' && 'Grid structure mapping review profiles with avatar tags'}
                          {v.id === 'newsletter' && 'Clean input form tailored specifically to capture newsletter signups'}
                          {v.id === 'appointment' && 'Detailed reservation picker for consultation clinic consults'}
                          {v.id === 'faq-accordions' && 'Interactive expanding panels with collapsible details'}
                          {v.id === 'stats-grid' && 'Interactive columns housing real-time countup ticker variables'}
                          {v.id === 'roadmap-steps' && 'Staggered path mapping step sequences with numbers'}
                          {v.id === 'gradient-cta' && 'Glow-masked call to action overlay with spotlight effects'}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* 2. LAYERS TREE TAB */}
            {leftSidebarTab === 'layers' && (
              <div className="space-y-4" id="layers-panel">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">Document Layers</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Reorder, select, duplicate, or delete specific node sections on your canvas.</p>
                </div>

                <div className="space-y-1.5">
                  {blocks.map((block, index) => {
                    const isSelected = selectedBlockId === block.id;
                    const isHovered = hoveredBlockId === block.id;
                    return (
                      <div
                        key={block.id}
                        onMouseEnter={() => setHoveredBlockId(block.id)}
                        onMouseLeave={() => setHoveredBlockId(null)}
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                          isSelected 
                            ? 'bg-blue-600/10 border-blue-500 text-white' 
                            : isHovered
                              ? 'bg-slate-900 border-slate-800 text-slate-200'
                              : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-mono text-slate-500 shrink-0 bg-slate-900 border border-slate-800/60 w-5 h-5 rounded flex items-center justify-center">#{index + 1}</span>
                          <span className="text-xs font-black truncate">{block.type} Section</span>
                        </div>

                        {/* Layer Actions */}
                        <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
                          <button
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'up'); }}
                            className={`p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 disabled:pointer-events-none`}
                            title="Move Up"
                          >
                            <MoveUp size={11} />
                          </button>
                          <button
                            disabled={index === blocks.length - 1}
                            onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'down'); }}
                            className={`p-1 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-20 disabled:pointer-events-none`}
                            title="Move Down"
                          >
                            <MoveDown size={11} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id, block.type); }}
                            className="p-1 hover:bg-red-950/40 hover:text-red-400 rounded text-slate-400"
                            title="Delete"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. SEO CONFIGURATION TAB */}
            {leftSidebarTab === 'seo' && (
              <div className="space-y-4" id="seo-panel">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">SEO Metadata</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Configure search engine crawlers tags to score premium lighthouse rankings.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">SEO Page Title</label>
                    <input 
                      type="text" 
                      value={seoTitle}
                      onChange={(e) => { setSeoTitle(e.target.value); setSaveStatus('dirty'); }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans"
                      placeholder="Enter optimized title tag..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">SEO Meta Description</label>
                    <textarea 
                      rows={4}
                      value={seoDesc}
                      onChange={(e) => { setSeoDesc(e.target.value); setSaveStatus('dirty'); }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-sans resize-none"
                      placeholder="Summarize page content to render on search grids..."
                    />
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Globe size={11} className="text-blue-400" />
                      <span>Google Preview Match</span>
                    </p>
                    <p className="text-xs font-bold text-blue-400 truncate hover:underline cursor-pointer">https://my-portfolio.onlypage.in</p>
                    <p className="text-[11px] text-emerald-500 truncate font-mono">{seoTitle || 'Default Title'}</p>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{seoDesc || 'Provide description details...'}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Quick System Diagnostics footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>CANVAS_NODES: {blocks.length}</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>ONLINE_DB_SYNC</span>
              </span>
            </div>
          </div>
        </aside>

        {/* ==========================================
            CENTRAL CANVAS - Live Preview with Figma-like dots
            ========================================== */}
        <main className="flex-1 bg-slate-900 relative flex flex-col overflow-y-auto scrollbar-thin overflow-x-hidden" id="central-canvas-area">
          
          {/* Figma-grade background design dots */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Floating Canvas Grid Lines Toggle details */}
          <div className="absolute top-4 left-6 z-20 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-500">
              <Grid size={11} />
              <span>Canvas Guide</span>
            </span>
            <div className="h-2 w-px bg-slate-800" />
            <span className="text-blue-400">{viewportMode === 'desktop' ? 'Full Width Responsive' : viewportMode === 'tablet' ? '768px Constrained' : '390px Constrained'}</span>
          </div>

          {/* Device Bezel Shell container */}
          <div className="flex-1 w-full py-12 px-4 flex items-start justify-center transition-all duration-300">
            
            {/* Responsiveness constraint wrappers */}
            <div 
              className={`w-full transition-all duration-300 relative ${
                viewportMode === 'tablet' 
                  ? 'max-w-[768px] border-8 border-slate-950 rounded-3xl bg-slate-950 shadow-2xl shadow-black/80' 
                  : viewportMode === 'mobile' 
                    ? 'max-w-[390px] border-[10px] border-slate-950 rounded-[40px] bg-slate-950 shadow-2xl shadow-black/80'
                    : 'max-w-full'
              }`}
              style={{
                minHeight: viewportMode !== 'desktop' ? '720px' : 'auto'
              }}
              id="viewport-frame-wrapper"
            >
              {/* Device Notch for Mobile View */}
              {viewportMode === 'mobile' && (
                <div className="absolute -top-[1px] left-1/2 transform -translate-x-1/2 w-36 h-5 bg-slate-950 rounded-b-2xl z-40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
                  <div className="w-12 h-1 bg-slate-900 rounded-full" />
                </div>
              )}

              {/* Dynamic Live website view rendering starts here */}
              <div className="w-full bg-white text-slate-900 rounded-lg overflow-hidden shadow-2xl flex flex-col relative" id="live-canvas-preview">
                
                {blocks.map((block, index) => {
                  const isSelected = selectedBlockId === block.id;
                  const isHovered = hoveredBlockId === block.id;

                  return (
                    <div
                      key={block.id}
                      onMouseEnter={() => setHoveredBlockId(block.id)}
                      onMouseLeave={() => setHoveredBlockId(null)}
                      className="relative group/item"
                    >
                      {/* Hover Outline Label Overlay */}
                      {isHovered && !isSelected && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-md z-30 pointer-events-none shadow">
                          {block.type} Section
                        </div>
                      )}

                      {isSelected && (
                        <>
                          {/* Floating Selected Block Badge */}
                          <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[9px] font-mono px-2.5 py-0.5 rounded-md z-30 flex items-center gap-1 shadow shadow-blue-500/20">
                            <span>Selected Block:</span>
                            <span className="font-extrabold text-[10px]">{block.type} ({block.variant || 'default'})</span>
                          </div>

                          {/* Floating Quick Action Overlay controls */}
                          <div className="absolute -top-11 right-4 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-2xl z-30 flex items-center gap-1 text-slate-100">
                            <span className="text-[9px] text-slate-400 font-mono px-2 border-r border-slate-800">{block.type}</span>
                            <button
                              disabled={index === 0}
                              onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'up'); }}
                              className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer disabled:opacity-20"
                              title="Move Section Up"
                            >
                              <MoveUp size={11} />
                            </button>
                            <button
                              disabled={index === blocks.length - 1}
                              onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'down'); }}
                              className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer disabled:opacity-20"
                              title="Move Section Down"
                            >
                              <MoveDown size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDuplicateBlock(block); }}
                              className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                              title="Duplicate Section"
                            >
                              <Copy size={11} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id, block.type); }}
                              className="p-1 hover:bg-red-950 text-red-400 rounded-lg cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>

                          {/* Authentic Figma handles (Circles at corners) */}
                          <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full z-30 pointer-events-none" />
                        </>
                      )}

                      <BuilderRenderer 
                        block={block} 
                        isActive={isSelected} 
                        selectedSubElement={selectedSubElement}
                        onSelect={() => {
                          setSelectedBlockId(block.id);
                          setSelectedSubElement(null);
                        }} 
                        onSelectSubElement={(subId) => {
                          setSelectedBlockId(block.id);
                          setSelectedSubElement(subId);
                        }}
                      />
                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* Canvas Bottom Instructions */}
          <div className="py-6 text-center text-[11px] text-slate-500 font-medium">
            <span>💡 Pro Tip: Hover and click any block section to open active CSS inspector attributes.</span>
          </div>
        </main>

        {/* ==========================================
            RIGHT SIDEBAR (300px) - Interactive CSS Inspector
            ========================================== */}
        <aside className="w-[300px] bg-slate-950 border-l border-slate-800 flex flex-col h-full shrink-0 z-10" id="right-sidebar">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-blue-500" />
              <span className="text-xs font-black uppercase text-slate-200 tracking-wider">Properties Inspector</span>
            </div>
            {selectedBlock && (
              <span className="text-[9px] bg-blue-900/30 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-mono font-black">{selectedBlock.type}</span>
            )}
          </div>

          {/* Active selection diagnostics */}
          {!selectedBlock ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
              <Compass size={32} className="text-slate-700 animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <p className="text-xs font-bold text-slate-400">No Block Inspected</p>
                <p className="text-[10px] text-slate-500 mt-1">Select any visual section on the central canvas to edit styling, layout and copy nodes.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector: Content Copy vs. CSS Styles */}
              <div className="flex border-b border-slate-800 p-1 bg-slate-950/80">
                <button
                  onClick={() => setRightInspectorTab('css-styles')}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    rightInspectorTab === 'css-styles' 
                      ? 'bg-slate-900 text-white border border-slate-800' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Design (CSS)
                </button>
                <button
                  onClick={() => setRightInspectorTab('content')}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    rightInspectorTab === 'content' 
                      ? 'bg-slate-900 text-white border border-slate-800' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Content Copy
                </button>
              </div>

              {/* Inspector Content Grid */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                
                {/* 1. DESIGN / CSS TAB */}
                {rightInspectorTab === 'css-styles' && (
                  <div className="space-y-5" id="design-inspector-panel">
                    
                    {/* Layer selection controls */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Layers size={10} className="text-blue-500" />
                          <span>Layer Selector</span>
                        </span>
                        {selectedSubElement && (
                          <button 
                            onClick={() => setSelectedSubElement(null)} 
                            className="text-[8px] text-blue-400 hover:text-blue-300 font-extrabold uppercase bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 cursor-pointer"
                          >
                            Reset To Section
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1">
                        {([
                          { id: null, label: 'Section' },
                          { id: 'title', label: 'Title' },
                          { id: 'subtitle', label: 'Sub' },
                          { id: 'button', label: 'Button' },
                          { id: 'card', label: 'Card' },
                          { id: 'media', label: 'Media' },
                          { id: 'badge', label: 'Badge' },
                        ] as const).map((item) => {
                          const hasElement = 
                            item.id === null || 
                            (item.id === 'title' && selectedBlock.title) ||
                            (item.id === 'subtitle' && selectedBlock.subtitle) ||
                            (item.id === 'button' && selectedBlock.btnText) ||
                            (item.id === 'badge' && selectedBlock.badge) ||
                            (item.id === 'media' && (selectedBlock.imageUrl || selectedBlock.type === 'Gallery' || selectedBlock.galleryImages)) ||
                            (item.id === 'card' && (selectedBlock.features || selectedBlock.pricing || selectedBlock.testimonials || selectedBlock.faqs || selectedBlock.stats || selectedBlock.steps));
                            
                          if (!hasElement) return null;
                          
                          return (
                            <button
                              key={item.id || 'block'}
                              onClick={() => setSelectedSubElement(item.id)}
                              className={`py-1 px-1 text-[8px] font-extrabold uppercase rounded transition-all cursor-pointer ${
                                selectedSubElement === item.id 
                                  ? 'bg-blue-600 text-white border border-blue-500' 
                                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* IF A SUB-ELEMENT IS SELECTED, SHOW ELEMENT-SPECIFIC DESIGN CONTROLS */}
                    {selectedSubElement !== null ? (
                      <div className="space-y-4">
                        
                        {/* 1. TITLE CONTROLS */}
                        {selectedSubElement === 'title' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Type size={11} />
                              <span>Style Heading Title</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Title Font Family</label>
                              <select 
                                value={(selectedBlock.styles as any).titleFontFamily || selectedBlock.styles.fontFamily}
                                onChange={(e) => handleUpdateBlockStyle('titleFontFamily' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="">Same as Section Font</option>
                                {GOOGLE_FONTS_LIST.map((font) => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Heading Size</label>
                              <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                                <span className="text-blue-400">{(selectedBlock.styles as any).titleFontSize || selectedBlock.styles.titleSize}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="14" 
                                max="100" 
                                value={(selectedBlock.styles as any).titleFontSize || selectedBlock.styles.titleSize}
                                onChange={(e) => handleUpdateBlockStyle('titleFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Heading Weight</label>
                              <select 
                                value={(selectedBlock.styles as any).titleFontWeight || selectedBlock.styles.titleWeight}
                                onChange={(e) => handleUpdateBlockStyle('titleFontWeight' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="light">Light (300)</option>
                                <option value="normal">Normal (400)</option>
                                <option value="semibold">Semibold (600)</option>
                                <option value="bold">Bold (700)</option>
                                <option value="black">Black (900)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Title Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).titleColor || selectedBlock.styles.textColor}
                                  onChange={(e) => handleUpdateBlockStyle('titleColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).titleColor || selectedBlock.styles.textColor}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Line Height</label>
                              <input 
                                type="range" 
                                min="0.8" 
                                max="2.5" 
                                step="0.1"
                                value={(selectedBlock.styles as any).titleLineHeight || selectedBlock.styles.lineHeight || 1.2}
                                onChange={(e) => handleUpdateBlockStyle('titleLineHeight' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Title Padding</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="50" 
                                value={(selectedBlock.styles as any).titlePadding || 0}
                                onChange={(e) => handleUpdateBlockStyle('titlePadding' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* 2. SUBTITLE CONTROLS */}
                        {selectedSubElement === 'subtitle' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Type size={11} />
                              <span>Style Subtitle Copy</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Font Family</label>
                              <select 
                                value={(selectedBlock.styles as any).subtitleFontFamily || selectedBlock.styles.fontFamily}
                                onChange={(e) => handleUpdateBlockStyle('subtitleFontFamily' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="">Same as Section Font</option>
                                {GOOGLE_FONTS_LIST.map((font) => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Size</label>
                              <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                                <span className="text-blue-400">{(selectedBlock.styles as any).subtitleFontSize || selectedBlock.styles.subtitleSize}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="11" 
                                max="48" 
                                value={(selectedBlock.styles as any).subtitleFontSize || selectedBlock.styles.subtitleSize}
                                onChange={(e) => handleUpdateBlockStyle('subtitleFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Subtitle Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).subtitleColor || selectedBlock.styles.subtitleColor || '#94a3b8'}
                                  onChange={(e) => handleUpdateBlockStyle('subtitleColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).subtitleColor || '#94a3b8'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Weight</label>
                              <select 
                                value={(selectedBlock.styles as any).subtitleFontWeight || 'normal'}
                                onChange={(e) => handleUpdateBlockStyle('subtitleFontWeight' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="normal">Normal (400)</option>
                                <option value="bold">Bold (700)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Subtitle Padding</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="40" 
                                value={(selectedBlock.styles as any).subtitlePadding || 0}
                                onChange={(e) => handleUpdateBlockStyle('subtitlePadding' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* 3. BADGE CONTROLS */}
                        {selectedSubElement === 'badge' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Award size={11} />
                              <span>Style Header Badge</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Badge Bg Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).badgeBgColor || selectedBlock.styles.badgeBgColor || '#2563eb'}
                                  onChange={(e) => handleUpdateBlockStyle('badgeBgColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).badgeBgColor || '#2563eb'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Badge Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).badgeTextColor || selectedBlock.styles.badgeTextColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('badgeTextColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).badgeTextColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Badge Font Size</label>
                              <input 
                                type="range" 
                                min="8" 
                                max="16" 
                                value={(selectedBlock.styles as any).badgeFontSize || 10}
                                onChange={(e) => handleUpdateBlockStyle('badgeFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="30" 
                                value={(selectedBlock.styles as any).badgeBorderRadius !== undefined ? (selectedBlock.styles as any).badgeBorderRadius : 9999}
                                onChange={(e) => handleUpdateBlockStyle('badgeBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="4" 
                                value={(selectedBlock.styles as any).badgeBorderWidth || 1}
                                onChange={(e) => handleUpdateBlockStyle('badgeBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).badgeBorderColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('badgeBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).badgeBorderColor || '#ffffff'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. BUTTON CONTROLS */}
                        {selectedSubElement === 'button' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Compass size={11} />
                              <span>Style CTA Button</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Btn Background Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).buttonBgColor || selectedBlock.styles.buttonBgColor || '#3b82f6'}
                                  onChange={(e) => handleUpdateBlockStyle('buttonBgColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).buttonBgColor || '#3b82f6'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Btn Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).buttonTextColor || selectedBlock.styles.buttonTextColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('buttonTextColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).buttonTextColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Btn Font Size</label>
                              <input 
                                type="range" 
                                min="10" 
                                max="24" 
                                value={(selectedBlock.styles as any).buttonFontSize || 14}
                                onChange={(e) => handleUpdateBlockStyle('buttonFontSize' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="40" 
                                value={(selectedBlock.styles as any).buttonBorderRadius !== undefined ? (selectedBlock.styles as any).buttonBorderRadius : 8}
                                onChange={(e) => handleUpdateBlockStyle('buttonBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Button Shadow</label>
                              <select 
                                value={(selectedBlock.styles as any).buttonShadow || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('buttonShadow' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="none">None (Flat)</option>
                                <option value="sm">Soft Elevation</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="4" 
                                value={(selectedBlock.styles as any).buttonBorderWidth || 0}
                                onChange={(e) => handleUpdateBlockStyle('buttonBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).buttonBorderColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('buttonBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).buttonBorderColor || '#ffffff'}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. CARD CONTROLS */}
                        {selectedSubElement === 'card' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <Grid size={11} />
                              <span>Style Sub-item Cards</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Card Bg Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).cardBgColor || selectedBlock.styles.cardBgColor || '#1e293b'}
                                  onChange={(e) => handleUpdateBlockStyle('cardBgColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).cardBgColor || '#1e293b'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Card Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).cardTextColor || selectedBlock.styles.textColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('cardTextColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).cardTextColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="40" 
                                value={(selectedBlock.styles as any).cardBorderRadius !== undefined ? (selectedBlock.styles as any).cardBorderRadius : 12}
                                onChange={(e) => handleUpdateBlockStyle('cardBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="10" 
                                value={(selectedBlock.styles as any).cardBorderWidth !== undefined ? (selectedBlock.styles as any).cardBorderWidth : 1}
                                onChange={(e) => handleUpdateBlockStyle('cardBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Card Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).cardBorderColor || '#334155'}
                                  onChange={(e) => handleUpdateBlockStyle('cardBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).cardBorderColor || '#334155'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Shadow</label>
                              <select 
                                value={(selectedBlock.styles as any).cardShadow || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('cardShadow' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="none">None</option>
                                <option value="sm">sm</option>
                                <option value="md">md</option>
                                <option value="lg">lg</option>
                                <option value="xl">xl</option>
                                <option value="2xl">2xl</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Card Inner Padding</label>
                              <input 
                                type="range" 
                                min="8" 
                                max="64" 
                                value={(selectedBlock.styles as any).cardPadding !== undefined ? (selectedBlock.styles as any).cardPadding : 24}
                                onChange={(e) => handleUpdateBlockStyle('cardPadding' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* 6. MEDIA CONTROLS */}
                        {selectedSubElement === 'media' && (
                          <div className="space-y-3.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                            <p className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                              <ImageIcon size={11} />
                              <span>Style Image Shapes & Filters</span>
                            </p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Shape Mask Clipping</label>
                              <select 
                                value={(selectedBlock.styles as any).mediaShape || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('mediaShape' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="none">Square / Default Layout</option>
                                <option value="circle">Perfect Circle mask</option>
                                <option value="hexagon">Futuristic Hexagon</option>
                                <option value="triangle">Triangle Geometry</option>
                                <option value="star">Modern 5-Point Star</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Visual Tone Filter</label>
                              <select 
                                value={(selectedBlock.styles as any).mediaFilter || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('mediaFilter' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                              >
                                <option value="none">No Filter (Full Color)</option>
                                <option value="grayscale">Elegant Grayscale</option>
                                <option value="blur">Soft Ambient Blur</option>
                                <option value="sepia">Warm Sepia Retro</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Media Border Radius</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="60" 
                                value={(selectedBlock.styles as any).mediaBorderRadius !== undefined ? (selectedBlock.styles as any).mediaBorderRadius : 16}
                                onChange={(e) => handleUpdateBlockStyle('mediaBorderRadius' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Media Border Width</label>
                              <input 
                                type="range" 
                                min="0" 
                                max="12" 
                                value={(selectedBlock.styles as any).mediaBorderWidth || 0}
                                onChange={(e) => handleUpdateBlockStyle('mediaBorderWidth' as any, Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 block">Media Border Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={(selectedBlock.styles as any).mediaBorderColor || '#ffffff'}
                                  onChange={(e) => handleUpdateBlockStyle('mediaBorderColor' as any, e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{(selectedBlock.styles as any).mediaBorderColor || '#ffffff'}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Media Shadow</label>
                              <select 
                                value={(selectedBlock.styles as any).mediaShadow || 'none'}
                                onChange={(e) => handleUpdateBlockStyle('mediaShadow' as any, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                              >
                                <option value="none">Flat (No Shadow)</option>
                                <option value="sm">Soft Elevation</option>
                              </select>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setSelectedSubElement(null)}
                          className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <SlidersHorizontal size={12} />
                          <span>Show All Section Design Settings</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* ACCORDION GROUP: BACKGROUND & COLOR */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                            <Palette size={11} className="text-blue-400" />
                            <span>Background & Colors</span>
                          </p>

                          <div className="space-y-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                            {/* Use Gradient Toggle */}
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-slate-400">Gradient Fill</label>
                              <input 
                                type="checkbox" 
                                checked={selectedBlock.styles.useGradient}
                                onChange={(e) => handleUpdateBlockStyle('useGradient', e.target.checked)}
                                className="cursor-pointer"
                              />
                            </div>

                        {selectedBlock.styles.useGradient ? (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 block">Gradient CSS</label>
                            <input 
                              type="text" 
                              value={selectedBlock.styles.backgroundGradient}
                              onChange={(e) => handleUpdateBlockStyle('backgroundGradient', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 font-mono"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 block">Bg Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={selectedBlock.styles.backgroundColor}
                                  onChange={(e) => handleUpdateBlockStyle('backgroundColor', e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.backgroundColor}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 block">Text Color</label>
                              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                                <input 
                                  type="color" 
                                  value={selectedBlock.styles.textColor}
                                  onChange={(e) => handleUpdateBlockStyle('textColor', e.target.value)}
                                  className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.textColor}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 block">Accent Color</label>
                            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                              <input 
                                type="color" 
                                value={selectedBlock.styles.accentColor}
                                onChange={(e) => handleUpdateBlockStyle('accentColor', e.target.value)}
                                className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                              />
                              <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.accentColor}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 block">Btn Color</label>
                            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                              <input 
                                type="color" 
                                value={selectedBlock.styles.buttonBgColor}
                                onChange={(e) => handleUpdateBlockStyle('buttonBgColor', e.target.value)}
                                className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                              />
                              <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.buttonBgColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: TYPOGRAPHY */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <Type size={11} className="text-blue-400" />
                        <span>Typography & Alignment</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Font Family */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Font Family</label>
                          <select 
                            value={selectedBlock.styles.fontFamily}
                            onChange={(e) => handleUpdateBlockStyle('fontFamily', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <optgroup label="SANS-SERIF (Clean & Modern)" className="bg-slate-950 text-slate-300">
                              <option value="Inter">Inter</option>
                              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Montserrat">Montserrat</option>
                              <option value="Open Sans">Open Sans</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Lato">Lato</option>
                              <option value="Raleway">Raleway</option>
                              <option value="DM Sans">DM Sans</option>
                              <option value="Nunito">Nunito</option>
                              <option value="Albert Sans">Albert Sans</option>
                            </optgroup>
                            <optgroup label="SERIF (Classic & Editorial)" className="bg-slate-950 text-slate-300">
                              <option value="Playfair Display">Playfair Display</option>
                              <option value="Merriweather">Merriweather</option>
                              <option value="Lora">Lora</option>
                              <option value="Cormorant Garamond">Cormorant Garamond</option>
                              <option value="EB Garamond">EB Garamond</option>
                              <option value="Georgia">Georgia</option>
                            </optgroup>
                            <optgroup label="DISPLAY (Bold & Distinct)" className="bg-slate-950 text-slate-300">
                              <option value="Space Grotesk">Space Grotesk</option>
                              <option value="Outfit">Outfit</option>
                              <option value="Syne">Syne</option>
                              <option value="Oswald">Oswald</option>
                              <option value="Bebas Neue">Bebas Neue</option>
                              <option value="Cinzel">Cinzel</option>
                              <option value="Lexend">Lexend</option>
                            </optgroup>
                            <optgroup label="MONOSPACE (Tech & Code)" className="bg-slate-950 text-slate-300">
                              <option value="JetBrains Mono">JetBrains Mono</option>
                              <option value="Fira Code">Fira Code</option>
                              <option value="Space Mono">Space Mono</option>
                              <option value="Source Code Pro">Source Code Pro</option>
                            </optgroup>
                            <optgroup label="CREATIVE & HANDWRITING" className="bg-slate-950 text-slate-300">
                              <option value="Caveat">Caveat</option>
                              <option value="Pacifico">Pacifico</option>
                              <option value="Shadows Into Light">Shadows Into Light</option>
                              <option value="Great Vibes">Great Vibes</option>
                              <option value="Architects Daughter">Architects Daughter</option>
                              <option value="Dancing Script">Dancing Script</option>
                            </optgroup>
                          </select>
                        </div>

                        {/* Title Font Size Slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Heading Size</span>
                            <span className="text-blue-400">{selectedBlock.styles.titleSize}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="20" 
                            max="80" 
                            value={selectedBlock.styles.titleSize}
                            onChange={(e) => handleUpdateBlockStyle('titleSize', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Heading Weight */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Heading Weight</label>
                          <select 
                            value={selectedBlock.styles.titleWeight}
                            onChange={(e) => handleUpdateBlockStyle('titleWeight', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none"
                          >
                            <option value="light">Light (300)</option>
                            <option value="normal">Normal (400)</option>
                            <option value="semibold">Semibold (600)</option>
                            <option value="bold">Bold (700)</option>
                            <option value="black">Black (900)</option>
                          </select>
                        </div>

                        {/* Alignment Buttons */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Text Align</label>
                          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                            {['left', 'center', 'right'].map(align => (
                              <button
                                key={align}
                                onClick={() => handleUpdateBlockStyle('textAlign', align)}
                                className={`py-1 rounded text-[10px] font-extrabold capitalize cursor-pointer transition-all ${
                                  selectedBlock.styles.textAlign === align 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {align}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: SPACING */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <SlidersHorizontal size={11} className="text-blue-400" />
                        <span>Figma Spacing</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Padding Top */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Padding Top</span>
                            <span className="text-blue-400">{selectedBlock.styles.paddingTop}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="160" 
                            value={selectedBlock.styles.paddingTop}
                            onChange={(e) => handleUpdateBlockStyle('paddingTop', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Padding Bottom */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Padding Bottom</span>
                            <span className="text-blue-400">{selectedBlock.styles.paddingBottom}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="10" 
                            max="160" 
                            value={selectedBlock.styles.paddingBottom}
                            onChange={(e) => handleUpdateBlockStyle('paddingBottom', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Max Width Container */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Max Content Width</span>
                            <span className="text-blue-400">{selectedBlock.styles.maxWidth}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="600" 
                            max="1400" 
                            value={selectedBlock.styles.maxWidth}
                            onChange={(e) => handleUpdateBlockStyle('maxWidth', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: SHADOWS & CARD DECORATION */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <Layers size={11} className="text-blue-400" />
                        <span>Card styling & Corners</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Card Corners */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Card Radius</span>
                            <span className="text-blue-400">{selectedBlock.styles.cardBorderRadius}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="32" 
                            value={selectedBlock.styles.cardBorderRadius}
                            onChange={(e) => handleUpdateBlockStyle('cardBorderRadius', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        {/* Card Background Color */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 block">Card Bg</label>
                          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                            <input 
                              type="color" 
                              value={selectedBlock.styles.cardBgColor}
                              onChange={(e) => handleUpdateBlockStyle('cardBgColor', e.target.value)}
                              className="w-5 h-5 border-0 rounded cursor-pointer p-0 bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-slate-300 uppercase">{selectedBlock.styles.cardBgColor}</span>
                          </div>
                        </div>

                        {/* Border Radius (Outer, if applicable) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Button Radius</span>
                            <span className="text-blue-400">{selectedBlock.styles.buttonBorderRadius}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="24" 
                            value={selectedBlock.styles.buttonBorderRadius}
                            onChange={(e) => handleUpdateBlockStyle('buttonBorderRadius', Number(e.target.value))}
                            className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ACCORDION GROUP: BACKGROUND TYPE & INTERACTIONS */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                        <ImageIcon size={11} className="text-blue-400" />
                        <span>Interactive Background & Clicks</span>
                      </p>

                      <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
                        {/* Background Mode */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Background Mode</label>
                          <select 
                            value={selectedBlock.styles.bgType || (selectedBlock.styles.useGradient ? 'gradient' : 'color')}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdateBlockStyle('bgType', val);
                              if (val === 'gradient') {
                                handleUpdateBlockStyle('useGradient', true);
                              } else {
                                handleUpdateBlockStyle('useGradient', false);
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="color">Solid Color</option>
                            <option value="gradient">Gradient Flow</option>
                            <option value="image">Custom Background Image</option>
                          </select>
                        </div>

                        {/* If Background Image is selected */}
                        {selectedBlock.styles.bgType === 'image' && (
                          <div className="space-y-3 pt-2 border-t border-slate-800/60">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Bg Image URL</label>
                                <span className="text-[8px] font-bold text-blue-400 bg-blue-950/60 border border-blue-900/30 px-1.5 py-0.5 rounded">📏 Recommended: 1920x1080px</span>
                              </div>
                              <input 
                                type="text"
                                value={selectedBlock.styles.bgImageUrl || ''}
                                onChange={(e) => handleUpdateBlockStyle('bgImageUrl', e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 font-mono outline-none"
                              />
                              <p className="text-[8px] text-slate-500 leading-tight mt-1">Recommended background resolution: 1920x1080px (Full HD) for sharp cover-stretch across wide laptop and desktop viewports.</p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                                <span>Image Opacity</span>
                                <span className="text-blue-400">{selectedBlock.styles.bgImageOpacity !== undefined ? selectedBlock.styles.bgImageOpacity : 50}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="10" 
                                max="100" 
                                value={selectedBlock.styles.bgImageOpacity !== undefined ? selectedBlock.styles.bgImageOpacity : 50}
                                onChange={(e) => handleUpdateBlockStyle('bgImageOpacity', Number(e.target.value))}
                                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Sizing</label>
                                <select 
                                  value={selectedBlock.styles.bgImageSize || 'cover'}
                                  onChange={(e) => handleUpdateBlockStyle('bgImageSize', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 outline-none cursor-pointer"
                                >
                                  <option value="cover">Cover (Fill)</option>
                                  <option value="contain">Contain (Fit)</option>
                                  <option value="auto">Original</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Behavior</label>
                                <select 
                                  value={selectedBlock.styles.bgImageAttachment || 'scroll'}
                                  onChange={(e) => handleUpdateBlockStyle('bgImageAttachment', e.target.value)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 outline-none cursor-pointer"
                                >
                                  <option value="scroll">Scroll</option>
                                  <option value="fixed">Parallax (Fixed)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Click Response */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                          <label className="text-[10px] font-bold text-slate-400">Click Animation Response</label>
                          <select 
                            value={selectedBlock.styles.clickResponse || 'none'}
                            onChange={(e) => handleUpdateBlockStyle('clickResponse', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="none">None (Static)</option>
                            <option value="scale-down">Scale Down Tap (Tactile)</option>
                            <option value="scale-up">Scale Up Tap</option>
                            <option value="bounce">Bounce Up Tap</option>
                            <option value="pulse">Pulse Scaling Tap</option>
                            <option value="flash">Flash Transparency</option>
                            <option value="ripple">Water Ripple Wave (Modern)</option>
                          </select>
                        </div>

                        {/* Hover Effects */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400">Hover Response Card Effect</label>
                          <select 
                            value={selectedBlock.styles.hoverEffect || 'none'}
                            onChange={(e) => handleUpdateBlockStyle('hoverEffect', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="none">None</option>
                            <option value="lift">Hover Lift (Translate Y)</option>
                            <option value="glow">Glow Border Accent (Neon)</option>
                            <option value="tilt">3D Tilt (Card Rotate)</option>
                            <option value="scale">Soft Scale Magnify</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                  </div>
                )}

                {/* 2. CONTENT COPY TAB */}
                {rightInspectorTab === 'content' && (
                  <div className="space-y-4" id="content-inspector-panel">
                    
                    {/* Badge Copy */}
                    {selectedBlock.badge !== undefined && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Header Badge Text</label>
                        <input 
                          type="text" 
                          value={selectedBlock.badge}
                          onChange={(e) => handleUpdateBlockContent('badge', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                          placeholder="EXCLUSIVITY BADGE"
                        />
                      </div>
                    )}

                    {/* Title Copy */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Section Main Title</label>
                      <textarea 
                        rows={2}
                        value={selectedBlock.title}
                        onChange={(e) => handleUpdateBlockContent('title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none"
                        placeholder="Enter premium section header..."
                      />
                    </div>

                    {/* Subtitle Copy */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Subtitle / Supporting Copy</label>
                      <textarea 
                        rows={4}
                        value={selectedBlock.subtitle}
                        onChange={(e) => handleUpdateBlockContent('subtitle', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none"
                        placeholder="Enter description explaining value..."
                      />
                    </div>

                    {/* Button Text */}
                    {selectedBlock.btnText !== undefined && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Button CTA Text</label>
                        <input 
                          type="text" 
                          value={selectedBlock.btnText}
                          onChange={(e) => handleUpdateBlockContent('btnText', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                          placeholder="Action CTA Button"
                        />
                      </div>
                    )}

                    {/* Image URL (Hero & Navigation specific) */}
                    {(selectedBlock.imageUrl !== undefined || selectedBlock.type === 'Navigation') && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">
                            {selectedBlock.type === 'Navigation' ? 'Brand Logo Image URL' : 'Graphic Banner Image URL'}
                          </label>
                          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                            {selectedBlock.type === 'Navigation' ? '📏 Recommended: 200x50px' : '📏 Recommended: 1200x800px'}
                          </span>
                        </div>
                        <input 
                          type="text" 
                          value={selectedBlock.imageUrl || ''}
                          onChange={(e) => handleUpdateBlockContent('imageUrl', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
                          placeholder={selectedBlock.type === 'Navigation' ? 'Logo secure image url...' : 'Unsplash secure image url...'}
                        />
                        <p className="text-[9px] text-slate-500 leading-normal">
                          {selectedBlock.type === 'Navigation' 
                            ? 'Recommended: 200x50px transparent PNG brand logo. Keep it short and compact so it fits perfectly on all mobile & desktop navigation layouts.' 
                            : 'Recommended: 1200x800px (3:2 aspect ratio). Ideal size for hero banners, product illustrations, or mockups.'}
                        </p>
                      </div>
                    )}

                    {/* Contact detail fields */}
                    {selectedBlock.type === 'Contact' && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <p className="text-[10px] font-extrabold text-slate-400">CONTACT DETAILS</p>
                        
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-500 uppercase">Corporate Email</label>
                          <input 
                            type="text" 
                            value={selectedBlock.contactEmail || ''}
                            onChange={(e) => handleUpdateBlockContent('contactEmail', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] text-slate-500 uppercase">Corporate Phone</label>
                          <input 
                            type="text" 
                            value={selectedBlock.contactPhone || ''}
                            onChange={(e) => handleUpdateBlockContent('contactPhone', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                          />
                        </div>
                      </div>
                    )}

                    {/* NESTED CONTENT & GRID ITEM EDITORS */}

                    {/* 1. FEATURES / SERVICES GRIDS */}
                    {selectedBlock.features && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <List size={11} className="text-blue-400" />
                            <span>Nested Grid Features ({selectedBlock.features.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentFeatures = selectedBlock.features || [];
                              const newId = `feat-${Date.now()}`;
                              const newFeat = { 
                                id: newId, 
                                title: 'Interactive Feature Option', 
                                desc: 'Modify this outline description using OnlyPage options.', 
                                icon: 'Sparkles' 
                              };
                              handleUpdateBlockContent('features', [...currentFeatures, newFeat]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Grid
                          </button>
                        </div>

                        <div className="space-y-3">
                          {selectedBlock.features.map((feat, index) => (
                            <div key={feat.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-3 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">GRID ITEM 0{index + 1}</span>
                                <div className="flex items-center gap-1">
                                  {index > 0 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.features || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index - 1];
                                        copy[index - 1] = temp;
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      title="Move Up"
                                    >
                                      <MoveUp size={10} />
                                    </button>
                                  )}
                                  {index < (selectedBlock.features || []).length - 1 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.features || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index + 1];
                                        copy[index + 1] = temp;
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      title="Move Down"
                                    >
                                      <MoveDown size={10} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      const copy = (selectedBlock.features || []).filter(f => f.id !== feat.id);
                                      handleUpdateBlockContent('features', copy);
                                    }}
                                    className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Item Title</label>
                                    <input 
                                      type="text" 
                                      value={feat.title}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.features || [])];
                                        copy[index] = { ...copy[index], title: e.target.value };
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Icon</label>
                                    <select 
                                      value={feat.icon}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.features || [])];
                                        copy[index] = { ...copy[index], icon: e.target.value };
                                        handleUpdateBlockContent('features', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 outline-none cursor-pointer"
                                    >
                                      {['Heart', 'Globe', 'Sliders', 'Type', 'Award', 'Mail', 'Phone', 'MapPin', 'CheckCircle2', 'Star', 'Search', 'Sparkles', 'Calendar', 'ShieldCheck', 'Users', 'MessageSquare', 'Briefcase', 'DollarSign', 'CheckSquare', 'ThumbsUp', 'Layout', 'Settings'].map(iconOpt => (
                                        <option key={iconOpt} value={iconOpt}>{iconOpt}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Item Copy Description</label>
                                  <textarea 
                                    rows={2}
                                    value={feat.desc}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.features || [])];
                                      copy[index] = { ...copy[index], desc: e.target.value };
                                      handleUpdateBlockContent('features', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. PRICING PLANS */}
                    {selectedBlock.pricing && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <DollarSign size={11} className="text-blue-400" />
                            <span>Pricing Plans ({selectedBlock.pricing.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentPricing = selectedBlock.pricing || [];
                              const newId = `price-${Date.now()}`;
                              const newPlan = { 
                                id: newId, 
                                tier: 'Scale Plan', 
                                price: '$49/mo', 
                                features: ['Premium Custom Modules', 'Dedicated Accounts', 'Interactive visual boards'], 
                                btnText: 'Subscribe Now', 
                                popular: false 
                              };
                              handleUpdateBlockContent('pricing', [...currentPricing, newPlan]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Plan
                          </button>
                        </div>

                        <div className="space-y-3">
                          {selectedBlock.pricing.map((plan, index) => (
                            <div key={plan.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-3 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">PLAN TIER 0{index + 1}</span>
                                <div className="flex items-center gap-1">
                                  <input 
                                    type="checkbox" 
                                    checked={plan.popular || false}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.pricing || [])];
                                      copy[index] = { ...copy[index], popular: e.target.checked };
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="cursor-pointer"
                                    title="Recommended/Popular"
                                  />
                                  <span className="text-[8px] font-extrabold text-slate-500 mr-2">POPULAR</span>
                                  {index > 0 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index - 1];
                                        copy[index - 1] = temp;
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveUp size={10} />
                                    </button>
                                  )}
                                  {index < (selectedBlock.pricing || []).length - 1 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index + 1];
                                        copy[index + 1] = temp;
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveDown size={10} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      const copy = (selectedBlock.pricing || []).filter(p => p.id !== plan.id);
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Tier Name</label>
                                    <input 
                                      type="text" 
                                      value={plan.tier}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        copy[index] = { ...copy[index], tier: e.target.value };
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Price</label>
                                    <input 
                                      type="text" 
                                      value={plan.price}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.pricing || [])];
                                        copy[index] = { ...copy[index], price: e.target.value };
                                        handleUpdateBlockContent('pricing', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Plan Features (One per line)</label>
                                  <textarea 
                                    rows={3}
                                    value={(plan.features || []).join('\n')}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.pricing || [])];
                                      copy[index] = { ...copy[index], features: e.target.value.split('\n') };
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 font-mono outline-none"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Button Copy Text</label>
                                  <input 
                                    type="text" 
                                    value={plan.btnText}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.pricing || [])];
                                      copy[index] = { ...copy[index], btnText: e.target.value };
                                      handleUpdateBlockContent('pricing', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. TESTIMONIALS */}
                    {selectedBlock.testimonials && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <ThumbsUp size={11} className="text-blue-400" />
                            <span>Client Reviews ({selectedBlock.testimonials.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentTestimonials = selectedBlock.testimonials || [];
                              const newId = `test-${Date.now()}`;
                              const newTest = { 
                                id: newId, 
                                name: 'Kabir Dev', 
                                role: 'Founder, DesignCo', 
                                content: 'This completely revolutionized our digital presence overnight. Incredible tool!', 
                                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 
                                rating: 5 
                              };
                              handleUpdateBlockContent('testimonials', [...currentTestimonials, newTest]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Review
                          </button>
                        </div>

                        <div className="space-y-3">
                          {selectedBlock.testimonials.map((test, index) => (
                            <div key={test.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-3 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">REVIEWER 0{index + 1}</span>
                                <div className="flex items-center gap-1">
                                  {index > 0 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index - 1];
                                        copy[index - 1] = temp;
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveUp size={10} />
                                    </button>
                                  )}
                                  {index < (selectedBlock.testimonials || []).length - 1 && (
                                    <button 
                                      onClick={() => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        const temp = copy[index];
                                        copy[index] = copy[index + 1];
                                        copy[index + 1] = temp;
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      <MoveDown size={10} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      const copy = (selectedBlock.testimonials || []).filter(t => t.id !== test.id);
                                      handleUpdateBlockContent('testimonials', copy);
                                    }}
                                    className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Full Name</label>
                                    <input 
                                      type="text" 
                                      value={test.name}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], name: e.target.value };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Role / Company</label>
                                    <input 
                                      type="text" 
                                      value={test.role}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], role: e.target.value };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                  <div className="col-span-2 space-y-1">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[8px] font-bold text-slate-500 uppercase">Avatar URL</label>
                                      <span className="text-[7px] font-extrabold text-blue-400 bg-blue-950 px-1 py-0.2 rounded">📏 Rec: 150x150px</span>
                                    </div>
                                    <input 
                                      type="text" 
                                      value={test.avatar}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], avatar: e.target.value };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 font-mono outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Stars (1-5)</label>
                                    <select 
                                      value={test.rating}
                                      onChange={(e) => {
                                        const copy = [...(selectedBlock.testimonials || [])];
                                        copy[index] = { ...copy[index], rating: Number(e.target.value) };
                                        handleUpdateBlockContent('testimonials', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 outline-none cursor-pointer"
                                    >
                                      {[1, 2, 3, 4, 5].map(stars => (
                                        <option key={stars} value={stars}>{stars} Stars</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Review Feedback Copy</label>
                                  <textarea 
                                    rows={2}
                                    value={test.content}
                                    onChange={(e) => {
                                      const copy = [...(selectedBlock.testimonials || [])];
                                      copy[index] = { ...copy[index], content: e.target.value };
                                      handleUpdateBlockContent('testimonials', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. FOOTER QUICK LINKS */}
                    {selectedBlock.links && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <Layers size={11} className="text-blue-400" />
                            <span>Footer Quick Links ({selectedBlock.links.length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentLinks = selectedBlock.links || [];
                              const newId = `link-${Date.now()}`;
                              const newLink = { id: newId, label: 'Resources Support', url: '#' };
                              handleUpdateBlockContent('links', [...currentLinks, newLink]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Link
                          </button>
                        </div>

                        <div className="space-y-2">
                          {selectedBlock.links.map((link, index) => (
                            <div key={link.id} className="grid grid-cols-12 gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 items-center">
                              <div className="col-span-5 space-y-1">
                                <label className="text-[8px] font-bold text-slate-500 uppercase">Label</label>
                                <input 
                                  type="text" 
                                  value={link.label}
                                  onChange={(e) => {
                                    const copy = [...(selectedBlock.links || [])];
                                    copy[index] = { ...copy[index], label: e.target.value };
                                    handleUpdateBlockContent('links', copy);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 outline-none"
                                />
                              </div>

                              <div className="col-span-5 space-y-1">
                                <label className="text-[8px] font-bold text-slate-500 uppercase">URL Link</label>
                                <input 
                                  type="text" 
                                  value={link.url}
                                  onChange={(e) => {
                                    const copy = [...(selectedBlock.links || [])];
                                    copy[index] = { ...copy[index], url: e.target.value };
                                    handleUpdateBlockContent('links', copy);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-200 font-mono outline-none"
                                />
                              </div>

                              <div className="col-span-2 flex justify-end gap-1 mt-3">
                                <button 
                                  onClick={() => {
                                    const copy = (selectedBlock.links || []).filter(l => l.id !== link.id);
                                    handleUpdateBlockContent('links', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. FAQ ACCORDIONS */}
                    {selectedBlock.type === 'Special' && selectedBlock.variant === 'faq-accordions' && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <MessageSquare size={11} className="text-blue-400" />
                            <span>FAQ Accordion List ({(selectedBlock.faqs || []).length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentFaqs = selectedBlock.faqs || [
                                { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                              ];
                              const newFaq = { 
                                id: `faq-${Date.now()}`, 
                                q: 'New Frequently Asked Question?', 
                                a: 'Provide an elegant and clear answers text here.' 
                              };
                              handleUpdateBlockContent('faqs', [...currentFaqs, newFaq]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add FAQ
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(selectedBlock.faqs || [
                            { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                            { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                            { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                          ]).map((faq, index) => (
                            <div key={faq.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">FAQ ITEM 0{index + 1}</span>
                                <button 
                                  onClick={() => {
                                    const currentFaqs = selectedBlock.faqs || [
                                      { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                      { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                      { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                                    ];
                                    const copy = currentFaqs.filter(f => f.id !== faq.id && f.q !== faq.q);
                                    handleUpdateBlockContent('faqs', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>

                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Question</label>
                                  <input 
                                    type="text" 
                                    value={faq.q}
                                    onChange={(e) => {
                                      const currentFaqs = selectedBlock.faqs || [
                                        { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                        { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                        { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                                      ];
                                      const copy = [...currentFaqs];
                                      copy[index] = { ...copy[index], q: e.target.value };
                                      handleUpdateBlockContent('faqs', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Answer</label>
                                  <textarea 
                                    rows={2}
                                    value={faq.a}
                                    onChange={(e) => {
                                      const currentFaqs = selectedBlock.faqs || [
                                        { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                                        { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                                        { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                                      ];
                                      const copy = [...currentFaqs];
                                      copy[index] = { ...copy[index], a: e.target.value };
                                      handleUpdateBlockContent('faqs', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 6. STATS METRICS GRID */}
                    {selectedBlock.type === 'Special' && selectedBlock.variant === 'stats-grid' && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <Briefcase size={11} className="text-blue-400" />
                            <span>Stats Counters ({(selectedBlock.stats || []).length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentStats = selectedBlock.stats || [
                                { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                              ];
                              const newStat = { 
                                id: `stat-${Date.now()}`, 
                                label: 'HOURLY COMMITS', 
                                val: 1500, 
                                suffix: '/hr' 
                              };
                              handleUpdateBlockContent('stats', [...currentStats, newStat]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Stat
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(selectedBlock.stats || [
                            { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                            { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                            { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                          ]).map((stat, index) => (
                            <div key={stat.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">STAT CARD 0{index + 1}</span>
                                <button 
                                  onClick={() => {
                                    const currentStats = selectedBlock.stats || [
                                      { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                      { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                      { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                    ];
                                    const copy = currentStats.filter(s => s.id !== stat.id && s.label !== stat.label);
                                    handleUpdateBlockContent('stats', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Label Title</label>
                                    <input 
                                      type="text" 
                                      value={stat.label}
                                      onChange={(e) => {
                                        const currentStats = selectedBlock.stats || [
                                          { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                          { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                          { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                        ];
                                        const copy = [...currentStats];
                                        copy[index] = { ...copy[index], label: e.target.value };
                                        handleUpdateBlockContent('stats', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Suffix</label>
                                    <input 
                                      type="text" 
                                      value={stat.suffix}
                                      onChange={(e) => {
                                        const currentStats = selectedBlock.stats || [
                                          { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                          { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                          { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                        ];
                                        const copy = [...currentStats];
                                        copy[index] = { ...copy[index], suffix: e.target.value };
                                        handleUpdateBlockContent('stats', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none font-mono"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Numeric Value</label>
                                  <input 
                                    type="number" 
                                    value={stat.val}
                                    onChange={(e) => {
                                      const currentStats = selectedBlock.stats || [
                                        { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                                        { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                                        { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                                      ];
                                      const copy = [...currentStats];
                                      copy[index] = { ...copy[index], val: Number(e.target.value) };
                                      handleUpdateBlockContent('stats', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. ROADMAP STEPS PATH */}
                    {selectedBlock.type === 'Special' && selectedBlock.variant === 'steps-path' && (
                      <div className="space-y-3.5 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                            <Layout size={11} className="text-blue-400" />
                            <span>Roadmap Steps ({(selectedBlock.steps || []).length})</span>
                          </p>
                          <button 
                            onClick={() => {
                              const currentSteps = selectedBlock.steps || [
                                { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                              ];
                              const newStepNum = String((currentSteps.length + 1)).padStart(2, '0');
                              const newStep = { 
                                id: `step-${Date.now()}`, 
                                step: newStepNum, 
                                title: 'Deploy Globally', 
                                desc: 'Serve dynamic routes via standard global CDN relays instantly.' 
                              };
                              handleUpdateBlockContent('steps', [...currentSteps, newStep]);
                            }}
                            className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                          >
                            <Plus size={10} /> Add Step
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(selectedBlock.steps || [
                            { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                            { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                            { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                          ]).map((step, index) => (
                            <div key={step.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                <span className="text-[9px] font-extrabold text-blue-500 uppercase">STEP CARD 0{index + 1}</span>
                                <button 
                                  onClick={() => {
                                    const currentSteps = selectedBlock.steps || [
                                      { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                      { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                      { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                    ];
                                    const copy = currentSteps.filter(s => s.id !== step.id && s.title !== step.title);
                                    handleUpdateBlockContent('steps', copy);
                                  }}
                                  className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="space-y-1 col-span-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Step #</label>
                                    <input 
                                      type="text" 
                                      value={step.step}
                                      onChange={(e) => {
                                        const currentSteps = selectedBlock.steps || [
                                          { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                          { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                          { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                        ];
                                        const copy = [...currentSteps];
                                        copy[index] = { ...copy[index], step: e.target.value };
                                        handleUpdateBlockContent('steps', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none font-mono"
                                    />
                                  </div>
                                  <div className="space-y-1 col-span-2">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Step Title</label>
                                    <input 
                                      type="text" 
                                      value={step.title}
                                      onChange={(e) => {
                                        const currentSteps = selectedBlock.steps || [
                                          { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                          { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                          { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                        ];
                                        const copy = [...currentSteps];
                                        copy[index] = { ...copy[index], title: e.target.value };
                                        handleUpdateBlockContent('steps', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-bold text-slate-500 uppercase">Step Outline Copy</label>
                                  <textarea 
                                    rows={2}
                                    value={step.desc}
                                    onChange={(e) => {
                                      const currentSteps = selectedBlock.steps || [
                                        { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                                        { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                                        { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                                      ];
                                      const copy = [...currentSteps];
                                      copy[index] = { ...copy[index], desc: e.target.value };
                                      handleUpdateBlockContent('steps', copy);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 resize-none outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 8. GALLERY SLIDES & IMAGES */}
                    {(selectedBlock.galleryImages !== undefined || selectedBlock.type === 'Gallery') && (() => {
                      const defaultSlides = [
                        { id: 'slide-1', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', title: 'Marketing Analytics Dashboard', subtitle: 'Advanced UI & Data visualization solutions' },
                        { id: 'slide-2', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600', title: 'Corporate Branding Strategy', subtitle: 'Elevating online presence across modern channels' },
                        { id: 'slide-3', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600', title: 'Interactive SaaS Platforms', subtitle: 'High-performance applications built for hyper-scale' }
                      ];
                      const currentSlides = selectedBlock.galleryImages || defaultSlides;

                      return (
                        <div className="space-y-3.5 pt-4 border-t border-slate-800">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide flex items-center gap-1">
                              <ImageIcon size={11} className="text-blue-400" />
                              <span>Gallery Slides & Images ({currentSlides.length})</span>
                            </p>
                            <button 
                              onClick={() => {
                                const newSlide = { 
                                  id: `slide-${Date.now()}`, 
                                  url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600', 
                                  title: 'Premium Next-Gen Product Design', 
                                  subtitle: 'Sophisticated aesthetics meets performant engineering pipelines' 
                                };
                                handleUpdateBlockContent('galleryImages', [...currentSlides, newSlide]);
                              }}
                              className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase bg-blue-950/40 border border-blue-900/40 px-2 py-1 rounded"
                            >
                              <Plus size={10} /> Add Slide Image
                            </button>
                          </div>

                          <div className="space-y-3">
                            {currentSlides.map((slide, index) => (
                              <div key={slide.id || index} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 relative">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                  <span className="text-[9px] font-extrabold text-blue-500 uppercase">SLIDE CARD 0{index + 1}</span>
                                  <div className="flex items-center gap-1">
                                    {index > 0 && (
                                      <button 
                                        onClick={() => {
                                          const copy = [...currentSlides];
                                          const temp = copy[index];
                                          copy[index] = copy[index - 1];
                                          copy[index - 1] = temp;
                                          handleUpdateBlockContent('galleryImages', copy);
                                        }}
                                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      >
                                        <MoveUp size={10} />
                                      </button>
                                    )}
                                    {index < currentSlides.length - 1 && (
                                      <button 
                                        onClick={() => {
                                          const copy = [...currentSlides];
                                          const temp = copy[index];
                                          copy[index] = copy[index + 1];
                                          copy[index + 1] = temp;
                                          handleUpdateBlockContent('galleryImages', copy);
                                        }}
                                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                      >
                                        <MoveDown size={10} />
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => {
                                        const copy = currentSlides.filter(s => s.id !== slide.id);
                                        handleUpdateBlockContent('galleryImages', copy);
                                      }}
                                      className="p-1 hover:bg-red-900/40 rounded text-slate-400 hover:text-red-400 cursor-pointer"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <label className="text-[8px] font-bold text-slate-500 uppercase">Image URL</label>
                                      <span className="text-[7px] font-extrabold text-blue-400 bg-blue-950 px-1 py-0.2 rounded">📏 Rec: 800x600px</span>
                                    </div>
                                    <input 
                                      type="text" 
                                      value={slide.url}
                                      onChange={(e) => {
                                        const copy = [...currentSlides];
                                        copy[index] = { ...copy[index], url: e.target.value };
                                        handleUpdateBlockContent('galleryImages', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 font-mono outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Slide Header</label>
                                    <input 
                                      type="text" 
                                      value={slide.title}
                                      onChange={(e) => {
                                        const copy = [...currentSlides];
                                        copy[index] = { ...copy[index], title: e.target.value };
                                        handleUpdateBlockContent('galleryImages', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase">Slide Caption Subtext</label>
                                    <input 
                                      type="text" 
                                      value={slide.subtitle}
                                      onChange={(e) => {
                                        const copy = [...currentSlides];
                                        copy[index] = { ...copy[index], subtitle: e.target.value };
                                        handleUpdateBlockContent('galleryImages', copy);
                                      }}
                                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-200 outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                )}

              </div>
            </>
          )}

        </aside>

      </div>

      {/* ==========================================
          MODAL: ONE-CLICK LIVE PUBLISHING SETUP
          ========================================== */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            id="publishing-modal"
          >
            <button 
              onClick={() => setShowPublishModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-900/30 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-pulse">
                <Globe size={24} />
              </div>
              <h2 className="text-lg font-black text-white">Publish Website to Production</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">OnlyPage handles routing, instant Cloud Run containers hosting, and edge CDN cache propagation instantly.</p>
            </div>

            <div className="my-6 space-y-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Deploy Target Target URL:</span>
                  <span className="text-xs font-black text-emerald-400 font-mono">LIVE PRODUCTION</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-500 font-mono select-all">https://my-portfolio.onlypage.in</span>
                </div>
              </div>

              {/* Custom Domain mapping */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Custom DNS Domain Mapping</span>
                  <span className="text-[9px] text-blue-400 normal-case">PRO STUDIO PLAN</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. www.yourdomain.com"
                    disabled
                    className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                  <button className="px-3 py-2 bg-slate-800 text-[10px] font-extrabold uppercase rounded-xl text-slate-400 cursor-not-allowed">Map DNS</button>
                </div>
                <p className="text-[9px] text-slate-500 leading-normal">Setup absolute custom DNS records by routing CNAME records to our server clusters.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowPublishModal(false)}
                className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-slate-300 rounded-xl"
              >
                Cancel Draft
              </button>
              <button 
                onClick={() => {
                  setShowPublishModal(false);
                  triggerToast('🚀 Congratulations! Your portfolio is now LIVE at my-portfolio.onlypage.in!', 'success');
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-black text-white rounded-xl shadow shadow-blue-500/20"
              >
                Deploy Live Release
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ==========================================
          MODAL: LIVE RESPONSIVE PREVIEW INTERACTIVE
          ========================================== */}
      {showLivePreviewModal && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
          
          {/* Preview Navigation Header */}
          <div className="h-14 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-xs font-black text-slate-200">Responsive Site Live Preview Mode</span>
            </div>

            {/* Middle Screen controls */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {['desktop', 'tablet', 'mobile'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewportMode(mode as any)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    viewportMode === mode ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowLivePreviewModal(false);
                triggerToast('Returned to CSS builder space', 'info');
              }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-black rounded-lg text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <X size={12} />
              <span>Exit Preview</span>
            </button>
          </div>

          {/* Interactive Live scroll space */}
          <div className="flex-1 bg-slate-900 overflow-y-auto p-8 flex items-start justify-center">
            
            <div 
              className={`w-full bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                viewportMode === 'tablet' 
                  ? 'max-w-[768px]' 
                  : viewportMode === 'mobile' 
                    ? 'max-w-[390px]'
                    : 'max-w-6xl'
              }`}
            >
              {blocks.map(block => {
                const styles = block.styles;
                const containerStyle: React.CSSProperties = {
                  paddingTop: `${styles.paddingTop}px`,
                  paddingBottom: `${styles.paddingBottom}px`,
                  paddingLeft: `${styles.paddingLeft}px`,
                  paddingRight: `${styles.paddingRight}px`,
                  backgroundColor: styles.useGradient ? undefined : styles.backgroundColor,
                  backgroundImage: styles.useGradient ? styles.backgroundGradient : undefined,
                  color: styles.textColor,
                  fontFamily: styles.fontFamily === 'Inter' ? '"Inter", sans-serif' : 
                              styles.fontFamily === 'Space Grotesk' ? '"Space Grotesk", sans-serif' : 
                              styles.fontFamily === 'Playfair Display' ? '"Playfair Display", serif' : 
                              styles.fontFamily === 'Georgia' ? 'Georgia, serif' : '"JetBrains Mono", monospace',
                  borderRadius: `${styles.borderRadius}px`,
                  borderWidth: `${styles.borderWidth}px`,
                  borderColor: styles.borderColor,
                  borderStyle: styles.borderStyle,
                  boxShadow: styles.boxShadow === 'none' ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.1)',
                  textAlign: styles.textAlign
                };

                return (
                  <div key={block.id} style={containerStyle}>
                    <div className="mx-auto" style={{ maxWidth: `${styles.maxWidth}px`, width: '100%' }}>
                      
                      {block.badge && (
                        <span className="inline-block text-[10px] uppercase tracking-widest font-extrabold mb-4 px-2.5 py-0.5 rounded-full" style={{ backgroundColor: styles.badgeBgColor, color: styles.badgeTextColor }}>
                          {block.badge}
                        </span>
                      )}

                      {block.type === 'Hero' && (
                        <div className={`grid grid-cols-1 ${styles.textAlign === 'left' ? 'lg:grid-cols-2' : ''} gap-8 items-center text-left`}>
                          <div className={styles.textAlign === 'center' ? 'text-center mx-auto' : ''}>
                            <h1 style={{ fontSize: `${styles.titleSize}px`, fontWeight: styles.titleWeight === 'light' ? 300 : styles.titleWeight === 'normal' ? 400 : styles.titleWeight === 'semibold' ? 600 : styles.titleWeight === 'bold' ? 700 : 900, lineHeight: styles.lineHeight }}>{block.title}</h1>
                            <p className="my-6" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>
                            {block.btnText && (
                              <button className="px-6 py-3 font-bold cursor-pointer" style={{ backgroundColor: styles.buttonBgColor, color: styles.buttonTextColor, borderRadius: `${styles.buttonBorderRadius}px` }}>
                                {block.btnText}
                              </button>
                            )}
                          </div>
                          {block.imageUrl && styles.textAlign === 'left' && (
                            <img src={block.imageUrl} className="w-full object-cover rounded-xl" style={{ maxHeight: '380px' }} alt="Hero Visual" />
                          )}
                        </div>
                      )}

                      {block.type === 'Features' && (
                        <div>
                          <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
                          <p className="mb-8" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {block.features?.map(feat => (
                              <div key={feat.id} className="p-6 text-left" style={{ backgroundColor: styles.cardBgColor, color: styles.cardTextColor, borderRadius: `${styles.cardBorderRadius}px`, borderWidth: `${styles.cardBorderWidth}px`, borderColor: styles.cardBorderColor }}>
                                <h3 className="text-base font-bold mb-2">{feat.title}</h3>
                                <p className="text-xs opacity-80 leading-normal">{feat.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {block.type === 'Pricing' && (
                        <div>
                          <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
                          <p className="mb-8" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {block.pricing?.map(plan => (
                              <div key={plan.id} className="p-6 text-left flex flex-col justify-between" style={{ backgroundColor: styles.cardBgColor, color: styles.cardTextColor, borderRadius: `${styles.cardBorderRadius}px`, borderWidth: `${styles.cardBorderWidth}px`, borderColor: styles.cardBorderColor }}>
                                <div>
                                  <h3 className="text-lg font-bold mb-1">{plan.tier}</h3>
                                  <p className="text-2xl font-black mb-4" style={{ color: styles.accentColor }}>{plan.price}</p>
                                  <ul className="space-y-2 mb-6">
                                    {plan.features.map((f, i) => (
                                      <li key={i} className="text-xs flex items-center gap-1.5 opacity-80">
                                        <Check size={12} className="text-emerald-500" />
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <button className="w-full py-2 font-bold text-xs" style={{ backgroundColor: styles.accentColor, color: '#ffffff', borderRadius: `${styles.buttonBorderRadius}px` }}>
                                  {plan.btnText}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {block.type === 'Testimonials' && (
                        <div>
                          <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
                          <p className="mb-8" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {block.testimonials?.map(test => (
                              <div key={test.id} className="p-6 text-left" style={{ backgroundColor: styles.cardBgColor, color: styles.cardTextColor, borderRadius: `${styles.cardBorderRadius}px` }}>
                                <p className="text-xs italic mb-4 font-medium">"{test.content}"</p>
                                <div className="flex items-center gap-3">
                                  <img src={test.avatar} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
                                  <div>
                                    <h4 className="text-xs font-black">{test.name}</h4>
                                    <p className="text-[10px] text-slate-400">{test.role}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {block.type === 'Contact' && (
                        <div>
                          <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
                          <p className="mb-8" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="p-6" style={{ backgroundColor: styles.cardBgColor, borderRadius: `${styles.cardBorderRadius}px` }}>
                              <input type="text" placeholder="Your Name" className="w-full bg-white border p-2 text-xs mb-3 rounded" />
                              <textarea placeholder="Your query..." className="w-full bg-white border p-2 text-xs mb-3 rounded" rows={3} />
                              <button className="w-full py-2 font-bold text-xs" style={{ backgroundColor: styles.buttonBgColor, color: styles.buttonTextColor, borderRadius: `${styles.buttonBorderRadius}px` }}>
                                {block.btnText}
                              </button>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl text-slate-600 text-xs space-y-3">
                              <p>✉ {block.contactEmail}</p>
                              <p>☎ {block.contactPhone}</p>
                              <p>📍 {block.contactAddress}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {block.type === 'Footer' && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
                          <div>
                            <h4 className="text-white font-bold">{block.title}</h4>
                            <p className="text-[11px]">{block.subtitle}</p>
                          </div>
                          <p className="text-[10px]">{block.copyright}</p>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          NOTIFICATION TOAST OUTLINE
          ========================================== */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl border shadow-2xl z-50 flex items-center gap-2.5 text-xs font-bold ${
              toast.type === 'success' 
                ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300' 
                : toast.type === 'error'
                  ? 'bg-red-950/95 border-red-500/30 text-red-300'
                  : 'bg-slate-900/95 border-slate-700/80 text-slate-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            ) : (
              <Info size={14} className="text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default WebsiteBuilderEditor;
