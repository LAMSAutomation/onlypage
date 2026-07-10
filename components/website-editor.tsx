import React, { useState, useEffect } from 'react';
import { 
  Undo, Redo, Eye, Globe, Laptop, Tablet, Smartphone, Search, Plus, Trash, 
  Sparkles, Check, ChevronDown, Settings, Layers, Files, Database, Image, 
  Sliders, ChevronRight, MoveUp, MoveDown, Copy, RotateCcw, FileText, 
  CheckCircle2, ArrowLeft, Send, Sparkle, Layout, Type, Palette, SlidersHorizontal,
  PlusCircle, Save, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface CMSItem {
  id: string;
  name: string;
  price?: string;
  desc?: string;
  role?: string;
  image?: string;
}

export interface WebBlock {
  id: string;
  type: 'Hero' | 'Services' | 'Gallery' | 'Reviews' | 'Forms' | 'Footer' | 'Promo';
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string;
  btnText?: string;
  services?: CMSItem[];
  reviews?: CMSItem[];
  images?: string[];
  themeColor?: string;
  fontFamily?: 'Inter' | 'Space Grotesk' | 'Playfair Display';
  paddingSize?: 'small' | 'medium' | 'large';
  layoutStyle?: 'split' | 'centered';
  borderRadius?: 'none' | 'md' | 'full';
  shadowStyle?: 'none' | 'sm' | 'lg';
  animationType?: 'fade' | 'slide' | 'scale';
}

export interface WebPage {
  id: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string;
}

interface WebsiteEditorProps {
  onExit: () => void;
}

// ==========================================
// PRESET STYLES & SAMPLES
// ==========================================

const SAMPLE_SERVICES: CMSItem[] = [
  {
    id: 's-1',
    name: 'Sculpted Signature Cut',
    price: '₹2,499',
    desc: 'Tailored precision cut complete with nourishing organic wash and artisan style.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's-2',
    name: 'Balayage & Couture Color',
    price: '₹6,800',
    desc: 'Hand-painted dimensional color designed to capture natural light and movement.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's-3',
    name: 'Luxury Caviar Therapy',
    price: '₹4,200',
    desc: 'Deep restorative hydration treatment to instantly revitalize hair follicle structure.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400'
  }
];

const SAMPLE_REVIEWS: CMSItem[] = [
  {
    id: 'r-1',
    name: 'Aishwarya Sen',
    role: 'Vogue India Editor',
    desc: 'Absolutely unparalleled service! The stylists here are genuine artists. The ambience is incredibly calming.'
  },
  {
    id: 'r-2',
    name: 'Ranveer Kapoor',
    role: 'Tech Entrepreneur',
    desc: 'A class apart. The signature sculpt cut and bespoke luxury therapy exceeded all expectations. Highly recommended.'
  }
];

const DEFAULT_BLOCKS: WebBlock[] = [
  {
    id: 'b-hero',
    type: 'Hero',
    title: 'The Art of Hair, Refined.',
    subtitle: 'Experience luxury grooming, customized styling, and premium restorative treatments at studio46.',
    badge: 'LUXURY SALON STUDIO',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
    btnText: 'Book Private Session',
    themeColor: '#3b82f6', // blue-500
    fontFamily: 'Space Grotesk',
    paddingSize: 'large',
    layoutStyle: 'split',
    borderRadius: 'full',
    shadowStyle: 'lg',
    animationType: 'slide'
  },
  {
    id: 'b-services',
    type: 'Services',
    title: 'Bespoke Services',
    subtitle: 'Meticulously crafted treatments tailored to your lifestyle and signature look.',
    services: [...SAMPLE_SERVICES],
    themeColor: '#3b82f6',
    fontFamily: 'Inter',
    paddingSize: 'medium',
    layoutStyle: 'centered',
    borderRadius: 'md',
    shadowStyle: 'sm',
    animationType: 'fade'
  },
  {
    id: 'b-gallery',
    type: 'Gallery',
    title: 'Visual Inspirations',
    subtitle: 'An intimate look inside our modern aesthetic workspace and completed couture styling.',
    images: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600'
    ],
    themeColor: '#3b82f6',
    fontFamily: 'Inter',
    paddingSize: 'medium',
    borderRadius: 'md',
    shadowStyle: 'lg'
  },
  {
    id: 'b-reviews',
    type: 'Reviews',
    title: 'Client Appreciations',
    subtitle: 'Read genuine reviews from guests who trust studio46 with their personal aesthetic.',
    reviews: [...SAMPLE_REVIEWS],
    themeColor: '#3b82f6',
    fontFamily: 'Playfair Display',
    paddingSize: 'medium',
    layoutStyle: 'centered',
    borderRadius: 'md',
    shadowStyle: 'sm'
  },
  {
    id: 'b-forms',
    type: 'Forms',
    title: 'Secure Your Appointment',
    subtitle: 'Select your preferred professional stylist and reserve a bespoke session slot today.',
    btnText: 'Send Booking Request',
    themeColor: '#3b82f6',
    fontFamily: 'Space Grotesk',
    paddingSize: 'large',
    layoutStyle: 'centered',
    borderRadius: 'full',
    shadowStyle: 'lg'
  }
];

const PRESET_BLOCK_LIBRARY = [
  {
    type: 'Hero' as const,
    name: 'Premium Splitted Hero',
    desc: 'Wide layout with huge image, tag badge, and premium heading block.',
    badge: 'NEW ACCENT'
  },
  {
    type: 'Services' as const,
    name: 'Modern Service Cards',
    desc: 'Multi-column grid showcase of products or client services.',
    badge: 'CORE'
  },
  {
    type: 'Gallery' as const,
    name: 'Studio Gallery Grid',
    desc: 'A gorgeous multi-image masonry collection for assets.',
    badge: 'VISUAL'
  },
  {
    type: 'Reviews' as const,
    name: 'Editorial Client Reviews',
    desc: 'Elegant typographic layout rendering guest feedback and credentials.',
    badge: 'SOCIAL'
  },
  {
    type: 'Forms' as const,
    name: 'Premium Appointment Form',
    desc: 'Robust inputs, dates, and dynamic pricing summary container.',
    badge: 'CONVERSION'
  },
  {
    type: 'Promo' as const,
    name: 'Festive Banner Offer',
    desc: 'Special high-contrast announcement slot with customized CTA.',
    badge: 'PROMO'
  }
];

export function WebsiteEditor({ onExit }: WebsiteEditorProps) {
  // --- STATE SYSTEM ---
  const [blocks, setBlocks] = useState<WebBlock[]>(DEFAULT_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('b-hero');
  const [activeLeftTab, setActiveLeftTab] = useState<'sections' | 'pages' | 'cms'>('sections');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'content' | 'design' | 'settings'>('content');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Page manager states
  const [pages, setPages] = useState<WebPage[]>([
    { id: 'p-1', name: 'Home', slug: '/', seoTitle: 'studio46 | Premium Grooming & Hair Salon', seoDesc: 'Bespoke grooming and luxury hair treatment in Bengaluru.', seoKeywords: 'salon, hair, beauty, luxury' },
    { id: 'p-2', name: 'About', slug: '/about', seoTitle: 'About studio46 | Master Artists', seoDesc: 'Meet our professional award-winning stylists.', seoKeywords: 'stylist, barber, premium salon' },
    { id: 'p-3', name: 'Services', slug: '/services', seoTitle: 'Our Services | Couture Styling', seoDesc: 'Pricing matrix of customized hair care therapy.', seoKeywords: 'haircut, coloring, hair wash' },
    { id: 'p-4', name: 'Contact', slug: '/contact', seoTitle: 'Contact Us | studio46 Salon', seoDesc: 'Locate us or book a priority slot reservation.', seoKeywords: 'booking, address, phone' }
  ]);
  const [activePageId, setActivePageId] = useState<string>('p-1');
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [showSeoModal, setShowSeoModal] = useState<string | null>(null); // Page ID

  // Undo/Redo & Saving states
  const [undoStack, setUndoStack] = useState<WebBlock[][]>([]);
  const [redoStack, setRedoStack] = useState<WebBlock[][]>([]);
  const [lastSaved, setLastSaved] = useState<string>('Saved 10s ago');
  const [historyOpen, setHistoryOpen] = useState(false);

  // Search filter for blocks
  const [blockSearch, setBlockSearch] = useState('');

  // CMS dynamic content manager
  const [cmsCollection, setCmsCollection] = useState<'services' | 'reviews'>('services');

  // AI Assistant states
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiWorking, setAiWorking] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Toast Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger undo/redo state captures
  const pushToUndo = (currentBlocks: WebBlock[]) => {
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(currentBlocks))]);
    setRedoStack([]); // Clear redo
    setLastSaved('Changes pending...');
    setTimeout(() => {
      setLastSaved('Saved just now');
    }, 1200);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(blocks))]);
    setBlocks(previous);
    triggerToast('Undo successful');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(blocks))]);
    setBlocks(next);
    triggerToast('Redo successful');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- INTERMEDIATE MODIFIERS ---
  const updateBlockProperty = (blockId: string, key: string, value: any) => {
    pushToUndo(blocks);
    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        return { ...b, [key]: value };
      }
      return b;
    }));
  };

  // Add Page logic
  const handleCreatePage = () => {
    if (!newPageName.trim()) return;
    const slug = '/' + newPageName.toLowerCase().replace(/\s+/g, '-');
    const newPage: WebPage = {
      id: 'p-' + Date.now(),
      name: newPageName,
      slug,
      seoTitle: `${newPageName} | studio46 Premium Salon`,
      seoDesc: `Bespoke curated ${newPageName} page content.`,
      seoKeywords: 'styling, studio, luxury, beauty'
    };
    setPages([...pages, newPage]);
    setNewPageName('');
    setShowAddPageModal(false);
    triggerToast(`Page "${newPageName}" created successfully!`);
  };

  // Duplicate Block
  const handleDuplicateBlock = (block: WebBlock, index: number) => {
    pushToUndo(blocks);
    const duplicated: WebBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: 'b-' + Date.now(),
      title: `${block.title} (Copy)`
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    setBlocks(updated);
    setSelectedBlockId(duplicated.id);
    triggerToast(`Duplicated ${block.type} section`);
  };

  // Move Block Order
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    pushToUndo(blocks);
    const updated = [...blocks];
    const temp = updated[index];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setBlocks(updated);
    triggerToast('Section order re-arranged');
  };

  // Delete Block
  const handleDeleteBlock = (blockId: string) => {
    pushToUndo(blocks);
    const remaining = blocks.filter(b => b.id !== blockId);
    setBlocks(remaining);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(remaining[0]?.id || null);
    }
    triggerToast('Section block removed');
  };

  // Append new block from preset library
  const handleAppendBlock = (type: WebBlock['type']) => {
    pushToUndo(blocks);
    let newBlock: WebBlock;
    if (type === 'Hero') {
      newBlock = {
        id: 'b-' + Date.now(),
        type: 'Hero',
        title: 'Crafted Aesthetic Masterpieces',
        subtitle: 'Experience bespoke organic grooming sessions formulated with botanical oils.',
        badge: 'NEW ANNIVERSARY SPECIALS',
        imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=600',
        btnText: 'Book Dynamic Session',
        themeColor: '#3b82f6',
        fontFamily: 'Space Grotesk',
        paddingSize: 'medium',
        layoutStyle: 'centered',
        borderRadius: 'md',
        shadowStyle: 'sm'
      };
    } else if (type === 'Services') {
      newBlock = {
        id: 'b-' + Date.now(),
        type: 'Services',
        title: 'New Service Lineup',
        subtitle: 'Custom tailored experiences focused on health and longevity.',
        services: [...SAMPLE_SERVICES],
        themeColor: '#3b82f6',
        fontFamily: 'Inter',
        paddingSize: 'medium',
        borderRadius: 'md'
      };
    } else if (type === 'Gallery') {
      newBlock = {
        id: 'b-' + Date.now(),
        type: 'Gallery',
        title: 'Visual Masterpieces',
        subtitle: 'Candid reflections of the styling chair experience.',
        images: [
          'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600'
        ],
        themeColor: '#3b82f6',
        fontFamily: 'Inter',
        paddingSize: 'medium'
      };
    } else if (type === 'Reviews') {
      newBlock = {
        id: 'b-' + Date.now(),
        type: 'Reviews',
        title: 'Words of Appreciation',
        subtitle: 'Honest testimonials on craft excellence.',
        reviews: [...SAMPLE_REVIEWS],
        themeColor: '#3b82f6',
        fontFamily: 'Playfair Display',
        paddingSize: 'medium'
      };
    } else if (type === 'Forms') {
      newBlock = {
        id: 'b-' + Date.now(),
        type: 'Forms',
        title: 'Inquire Instantly',
        subtitle: 'Leave your contact information and get prioritized in the waitlist.',
        btnText: 'Join priority list',
        themeColor: '#3b82f6',
        fontFamily: 'Inter',
        paddingSize: 'medium'
      };
    } else {
      newBlock = {
        id: 'b-' + Date.now(),
        type: 'Promo',
        title: '✨ Festive Launch Offer: Save 20%',
        subtitle: 'Get customized sculpting hair treatment and deep steam conditioning at a celebratory rate.',
        btnText: 'Claim 20% discount coupon',
        themeColor: '#8b5cf6', // Indigo/purple accent
        fontFamily: 'Space Grotesk',
        paddingSize: 'small',
        layoutStyle: 'centered'
      };
    }

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    triggerToast(`Added ${type} section to canvas!`);
  };

  // --- DYNAMIC CMS EDIT HANDLING ---
  // When editing CMS, we directly update the nested items inside blocks inUse!
  const updateCMSItem = (itemId: string, field: string, value: string) => {
    pushToUndo(blocks);
    setBlocks(prev => prev.map(b => {
      if (b.type === 'Services' && b.services) {
        return {
          ...b,
          services: b.services.map(s => s.id === itemId ? { ...s, [field]: value } : s)
        };
      }
      if (b.type === 'Reviews' && b.reviews) {
        return {
          ...b,
          reviews: b.reviews.map(r => r.id === itemId ? { ...r, [field]: value } : r)
        };
      }
      return b;
    }));
  };

  // --- AI SUGGESTION CO-PILOT ---
  const runAiAdjustment = (option: string) => {
    setAiWorking(true);
    setAiFeedback(null);
    
    setTimeout(() => {
      pushToUndo(blocks);
      
      if (option === 'luxury') {
        // Change fonts to luxury (Playfair Display) + Charcoal Dark/Gold Styling
        setBlocks(prev => prev.map((b, idx) => {
          if (idx === 0) {
            return {
              ...b,
              title: "The Aesthetics of Bespoke Grooming.",
              subtitle: "Step into studio46. A sanctuary of handcrafted hairstyles, premium organic steam therapies, and classic razor details.",
              fontFamily: 'Playfair Display',
              themeColor: '#d97706', // gold
              paddingSize: 'large'
            };
          }
          return {
            ...b,
            fontFamily: 'Playfair Display',
            themeColor: '#d97706'
          };
        }));
        setAiFeedback("Successfully applied 'Luxe Heritage' design tokens: Applied Playfair Display serif fonts, Gold color values (#d97706), and deep breathing spacing coefficients to all active blocks.");
      } else if (option === 'blue') {
        // Change accents to electric blue
        setBlocks(prev => prev.map(b => ({
          ...b,
          themeColor: '#2563eb' // royal blue
        })));
        setAiFeedback("Applied 'Ultramarine Electric' styles: Preset theme color parameters shifted to bright blue (#2563eb) with deep high-contrast text rendering.");
      } else if (option === 'diwali') {
        // Add diwali promo block
        const promoBlock: WebBlock = {
          id: 'b-diwali',
          type: 'Promo',
          title: '🪔 studio46 Festive Celebration Offer!',
          subtitle: 'Experience our royal hot towel shave and gold scalp massage package at flat 30% off. Claim slots before standard schedule fills.',
          btnText: 'Claim Festive Invitation slot',
          themeColor: '#f97316', // orange/amber
          fontFamily: 'Space Grotesk',
          paddingSize: 'medium',
          layoutStyle: 'centered',
          borderRadius: 'full',
          shadowStyle: 'lg'
        };
        // Insert second position
        const updated = [...blocks];
        updated.splice(1, 0, promoBlock);
        setBlocks(updated);
        setSelectedBlockId(promoBlock.id);
        setAiFeedback("Injected 'Festive Celebration' micro-conversion card after the Hero block: Formatted text contents, bright warm amber visual styling, and CTA triggers.");
      } else if (option === 'seo') {
        // Improve SEO checklist
        setPages(prev => prev.map(p => {
          if (p.id === activePageId) {
            return {
              ...p,
              seoTitle: "Best Premium Hair Salon & Grooming Bengaluru | studio46 Salon",
              seoDesc: "studio46 is Bengaluru's premier bespoke salon. Specializing in precision styling, sculpted signature haircuts, balayage couture coloring, and deep restorative treatments.",
              seoKeywords: "best hair salon bangalore, luxury grooming studio46, bridal coloring, bespoke haircut bengaluru"
            };
          }
          return p;
        }));
        setAiFeedback("Optimized page HTML meta structures: Inserted keyword density, created a 160-character description tag, and appended structural headers to index.html definitions.");
      } else {
        // Custom request
        setBlocks(prev => prev.map((b, idx) => {
          if (idx === 0) {
            return {
              ...b,
              title: "Modern Aesthetics, Sculpted Style.",
              subtitle: `Optimized via user command: "${aiPrompt}"`
            };
          }
          return b;
        }));
        setAiFeedback(`Executed custom AI layout optimization: "${aiPrompt}". Generated refined copy, verified contrast ratio compliance, and structured button layouts.`);
        setAiPrompt('');
      }
      
      setAiWorking(false);
      triggerToast('AI Optimizations successfully applied!');
    }, 1800);
  };

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Filter block presets
  const filteredPresets = PRESET_BLOCK_LIBRARY.filter(p => 
    p.name.toLowerCase().includes(blockSearch.toLowerCase()) || 
    p.type.toLowerCase().includes(blockSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 font-sans overflow-hidden select-none">
      
      {/* ==========================================
          TOP BAR (64px)
          ========================================== */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between shrink-0 z-40">
        
        {/* Left: Brand logo & live domain */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </button>
          
          <div className="h-4 w-px bg-slate-800" />
          
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-tight text-white flex items-center gap-1">
              <span className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white">O</span>
              <span>OnlyPage</span>
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 font-semibold">studio46.onlypage.in</span>
              <ExternalLink size={10} className="text-slate-500" />
            </div>
          </div>
        </div>

        {/* Middle: Page & Device Controls */}
        <div className="flex items-center gap-6">
          {/* Page dropdown selector */}
          <div className="relative">
            <span className="text-[10px] font-bold text-slate-500 block absolute -top-3.5 left-0 uppercase tracking-widest">Active Page</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-200">
              <FileText size={12} className="text-blue-500" />
              <select 
                value={activePageId}
                onChange={(e) => {
                  setActivePageId(e.target.value);
                  triggerToast(`Switched active view to ${pages.find(p => p.id === e.target.value)?.name}`);
                }}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer text-slate-200 pr-1"
              >
                {pages.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Device toggle switches */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {[
              { id: 'desktop' as const, icon: Laptop, label: 'Desktop' },
              { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
              { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' }
            ].map(dev => {
              const Icon = dev.icon;
              const isSelected = viewportMode === dev.id;
              return (
                <button
                  key={dev.id}
                  onClick={() => {
                    setViewportMode(dev.id);
                    triggerToast(`Viewport scaled to ${dev.label}`);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  title={dev.label}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline text-[10px]">{dev.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Actions, History & Publish */}
        <div className="flex items-center gap-3">
          {/* Saved status & History Trigger */}
          <div className="relative">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 hover:bg-slate-800/40 rounded-md cursor-pointer"
            >
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
              <span>{lastSaved}</span>
              <ChevronDown size={10} />
            </button>

            {historyOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setHistoryOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-3 z-40 space-y-2 text-slate-200">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Version History</p>
                  <div className="space-y-1">
                    {[
                      { time: 'Just now', desc: 'Current Active Draft', active: true },
                      { time: '2 mins ago', desc: 'AI Luxury Adaptation', active: false },
                      { time: '10 mins ago', desc: 'Created Services Section', active: false },
                      { time: 'Yesterday', desc: 'Initial Template Import', active: false }
                    ].map((hist, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setHistoryOpen(false);
                          if (i > 0) {
                            pushToUndo(blocks);
                            // Simulate restore
                            setBlocks(DEFAULT_BLOCKS);
                            triggerToast('Restored historic backup successfully!');
                          }
                        }}
                        className={`w-full text-left p-2 rounded-lg text-[11px] transition-colors flex justify-between items-center ${
                          hist.active ? 'bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20' : 'hover:bg-slate-900 text-slate-400'
                        }`}
                      >
                        <div>
                          <p className="text-[10px] font-black">{hist.time}</p>
                          <p className="text-[9px] text-slate-500 leading-none mt-0.5">{hist.desc}</p>
                        </div>
                        <RotateCcw size={10} className="text-slate-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Undo/Redo */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                undoStack.length > 0 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Undo change"
            >
              <Undo size={14} />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                redoStack.length > 0 ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Redo change"
            >
              <Redo size={14} />
            </button>
          </div>

          {/* Preview & Publish */}
          <button 
            onClick={() => triggerToast('Launching live responsive preview in new modal tab...')}
            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
          
          <button 
            onClick={() => triggerToast('🚀 studio46.onlypage.in is now LIVE and deployed to production Cloud servers!')}
            className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
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
            LEFT SIDEBAR (280px)
            ========================================== */}
        <aside className="w-[280px] bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0 z-10">
          
          {/* Category Tabs: Sections, Pages, CMS */}
          <div className="grid grid-cols-3 border-b border-slate-800 p-1.5 bg-slate-950">
            {[
              { id: 'sections' as const, label: 'Blocks', icon: Layers },
              { id: 'pages' as const, label: 'Pages', icon: Files },
              { id: 'cms' as const, label: 'CMS Data', icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeLeftTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id)}
                  className={`py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected 
                      ? 'bg-slate-900 text-white border border-slate-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-panels depending on selection */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            
            {/* 1. SECTIONS / BLOCKS ACCORDION */}
            {activeLeftTab === 'sections' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">Section Library</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Append or drag curated responsive blocks directly into your canvas.</p>
                </div>

                <div className="relative">
                  <Search size={12} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search block categories..."
                    value={blockSearch}
                    onChange={(e) => setBlockSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-xs bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-blue-500 placeholder:text-slate-600 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  {filteredPresets.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAppendBlock(preset.type)}
                      className="group p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-blue-500 hover:bg-slate-900/100 transition-all cursor-pointer text-left flex justify-between items-center"
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black text-slate-200 group-hover:text-blue-400 transition-colors">{preset.name}</span>
                          <span className="text-[8px] font-black bg-blue-900/40 text-blue-400 border border-blue-900/40 px-1 py-0.5 rounded uppercase tracking-wider">{preset.badge}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-tight">{preset.desc}</p>
                      </div>
                      <PlusCircle size={14} className="text-slate-600 group-hover:text-blue-400 group-hover:scale-110 transition-all shrink-0" />
                    </div>
                  ))}
                  {filteredPresets.length === 0 && (
                    <p className="text-center text-[11px] text-slate-600 py-4">No matching block designs found.</p>
                  )}
                </div>
              </div>
            )}

            {/* 2. PAGES MANAGER */}
            {activeLeftTab === 'pages' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">Website Pages</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Control routes & SEO settings.</p>
                  </div>
                  <button
                    onClick={() => setShowAddPageModal(true)}
                    className="p-1 bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-md cursor-pointer transition-colors"
                    title="Add Page"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Page List items */}
                <div className="space-y-1.5">
                  {pages.map((p) => (
                    <div
                      key={p.id}
                      className={`group p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                        activePageId === p.id 
                          ? 'bg-blue-600/10 border-blue-600/50 text-blue-200 font-bold'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setActivePageId(p.id);
                          triggerToast(`Switched active canvas layout to ${p.name}`);
                        }}
                        className="flex-1 text-[11px] font-bold cursor-pointer text-left truncate flex items-center gap-1.5"
                      >
                        <FileText size={11} className={activePageId === p.id ? 'text-blue-400' : 'text-slate-500'} />
                        <span className="truncate">{p.name}</span>
                        <span className="text-[9px] text-slate-600 font-semibold">{p.slug}</span>
                      </button>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setShowSeoModal(p.id)}
                          className="p-1 text-[9px] font-black text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer uppercase"
                          title="SEO Tags Config"
                        >
                          SEO
                        </button>
                        {p.id !== 'p-1' && (
                          <button
                            onClick={() => {
                              pushToUndo(blocks);
                              setPages(pages.filter(item => item.id !== p.id));
                              if (activePageId === p.id) setActivePageId('p-1');
                              triggerToast(`Deleted page ${p.name}`);
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                            title="Delete page"
                          >
                            <Trash size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CMS DATA CONTROLLER */}
            {activeLeftTab === 'cms' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wide">CMS Collections</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Editing content items updates all associated web page visual modules in real-time!</p>
                </div>

                {/* Collection selector */}
                <div className="grid grid-cols-2 bg-slate-900 p-0.5 border border-slate-800 rounded-lg">
                  <button
                    onClick={() => setCmsCollection('services')}
                    className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                      cmsCollection === 'services' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Services (Products)
                  </button>
                  <button
                    onClick={() => setCmsCollection('reviews')}
                    className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                      cmsCollection === 'reviews' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Reviews (Social)
                  </button>
                </div>

                {/* Items in collection list */}
                {cmsCollection === 'services' ? (
                  <div className="space-y-3.5 pt-1">
                    {/* Fetch service items from block */}
                    {blocks.find(b => b.type === 'Services')?.services?.map((serv) => (
                      <div key={serv.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-left">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Service Item</span>
                          <span className="text-[9px] text-slate-500 font-semibold">{serv.id}</span>
                        </div>
                        <div className="space-y-1.5">
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Service Name</label>
                            <input
                              type="text"
                              value={serv.name}
                              onChange={(e) => updateCMSItem(serv.id, 'name', e.target.value)}
                              className="w-full h-8 px-2 text-[10px] bg-slate-950 border border-slate-800 rounded outline-none focus:border-blue-600 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Rate (Price)</label>
                            <input
                              type="text"
                              value={serv.price || ''}
                              onChange={(e) => updateCMSItem(serv.id, 'price', e.target.value)}
                              className="w-full h-8 px-2 text-[10px] bg-slate-950 border border-slate-800 rounded outline-none focus:border-blue-600 text-slate-200 font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Description</label>
                            <textarea
                              value={serv.desc || ''}
                              onChange={(e) => updateCMSItem(serv.id, 'desc', e.target.value)}
                              className="w-full h-12 p-1.5 text-[9px] bg-slate-950 border border-slate-800 rounded outline-none focus:border-blue-600 text-slate-300 resize-none leading-normal"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-1">
                    {blocks.find(b => b.type === 'Reviews')?.reviews?.map((rev) => (
                      <div key={rev.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-left">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                          <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">Google Reviewer</span>
                          <span className="text-[9px] text-slate-500 font-semibold">{rev.id}</span>
                        </div>
                        <div className="space-y-1.5">
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Reviewer Name</label>
                            <input
                              type="text"
                              value={rev.name}
                              onChange={(e) => updateCMSItem(rev.id, 'name', e.target.value)}
                              className="w-full h-8 px-2 text-[10px] bg-slate-950 border border-slate-800 rounded outline-none focus:border-blue-600 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Designation / Role</label>
                            <input
                              type="text"
                              value={rev.role || ''}
                              onChange={(e) => updateCMSItem(rev.id, 'role', e.target.value)}
                              className="w-full h-8 px-2 text-[10px] bg-slate-950 border border-slate-800 rounded outline-none focus:border-blue-600 text-slate-200"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Feedback Comment</label>
                            <textarea
                              value={rev.desc || ''}
                              onChange={(e) => updateCMSItem(rev.id, 'desc', e.target.value)}
                              className="w-full h-12 p-1.5 text-[9px] bg-slate-950 border border-slate-800 rounded outline-none focus:border-blue-600 text-slate-300 resize-none leading-normal"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[10px] text-slate-500">
            <span>Powered by OnlyPage Engine</span>
            <span className="font-bold text-slate-400">Draft v2.84</span>
          </div>
        </aside>

        {/* ==========================================
            CENTER CANVAS
            ========================================== */}
        <main className="flex-1 bg-[#12131a] flex flex-col items-center justify-center p-6 overflow-hidden relative">
          
          {/* Floating Instruction Banner */}
          <div className="absolute top-4 left-6 right-6 flex justify-between items-center select-none pointer-events-none z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full backdrop-blur">
              Click any component to open the Properties Panel
            </span>
            <span className="text-[10px] font-extrabold text-blue-400 bg-blue-950/80 border border-blue-900/60 px-3 py-1 rounded-full backdrop-blur">
              Live Connection Node
            </span>
          </div>

          {/* Visual Responsive Screen Frame Wrapper */}
          <div 
            className={`w-full h-full flex flex-col transition-all duration-500 ease-in-out relative border border-slate-800 bg-slate-950 shadow-2xl rounded-2xl overflow-hidden ${
              viewportMode === 'desktop' ? 'max-w-full' :
              viewportMode === 'tablet' ? 'max-w-[768px]' : 'max-w-[375px]'
            }`}
          >
            {/* Browser frame decoration */}
            <div className="h-10 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between select-none">
              <div className="flex items-center space-x-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              
              {/* Browser Address Bar */}
              <div className="w-96 max-w-xs md:max-w-md h-6 bg-slate-950 border border-slate-850 rounded-md text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <span className="text-emerald-500 text-[11px] font-black leading-none">🔒</span>
                <span>studio46.onlypage.in</span>
                <span className="text-slate-600">{activePage.slug}</span>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <span className="text-[10px] font-black text-slate-500 px-2 py-0.5 bg-slate-950 rounded border border-slate-850">HTML5</span>
              </div>
            </div>

            {/* Inner iframe simulator view */}
            <div className="flex-1 bg-white overflow-y-auto scrollbar-none scroll-smooth relative p-0 text-slate-800">
              
              {blocks.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Layers size={24} className="text-slate-300" />
                  </div>
                  <h4 className="text-sm font-black text-slate-700">Empty Page Canvas</h4>
                  <p className="text-xs text-slate-400 text-center max-w-xs mt-1">Select responsive blocks from the Left Sidebar menu to assemble your high-end design.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 bg-white">
                  {blocks.map((block, index) => {
                    const isSelected = selectedBlockId === block.id;
                    const blockFontClass = 
                      block.fontFamily === 'Space Grotesk' ? 'font-sans tracking-tight' :
                      block.fontFamily === 'Playfair Display' ? 'serif-style italic' : 'font-sans';
                    
                    const blockPaddingClass = 
                      block.paddingSize === 'small' ? 'py-8 px-6' :
                      block.paddingSize === 'large' ? 'py-20 px-8' : 'py-14 px-6';

                    return (
                      <div
                        key={block.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlockId(block.id);
                          triggerToast(`Selected ${block.type} component`);
                        }}
                        className={`relative transition-all duration-300 group ${
                          isSelected 
                            ? 'ring-4 ring-blue-500 ring-offset-2 z-10' 
                            : 'hover:ring-2 hover:ring-blue-400/50 hover:ring-offset-1'
                        }`}
                        style={{
                          fontFamily: block.fontFamily === 'Playfair Display' ? '"Playfair Display", Georgia, serif' : 
                                      block.fontFamily === 'Space Grotesk' ? '"Space Grotesk", sans-serif' : '"Inter", sans-serif'
                        }}
                      >
                        
                        {/* Selected Block floating toolbars */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-25 bg-slate-950 border border-slate-800 shadow-2xl p-1 rounded-lg">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'up'); }}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp size={11} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveBlock(index, 'down'); }}
                            disabled={index === blocks.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown size={11} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDuplicateBlock(block, index); }}
                            className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy size={11} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded cursor-pointer"
                            title="Remove"
                          >
                            <Trash size={11} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); setAiOpen(true); }}
                            className="p-1 text-blue-400 hover:text-white hover:bg-blue-600 rounded cursor-pointer"
                            title="AI Optimize"
                          >
                            <Sparkles size={11} />
                          </button>
                        </div>

                        {/* Visual indicator tag */}
                        <div className="absolute top-2 left-2 pointer-events-none select-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[8px] font-black uppercase tracking-wider text-white bg-blue-600/90 px-2 py-0.5 rounded-full shadow-md">
                            {block.type} Block
                          </span>
                        </div>

                        {/* RENDER LOGICS FOR GORGEOUS HIGH END BLOCKS */}
                        
                        {/* 1. HERO BLOCK */}
                        {block.type === 'Hero' && (
                          <div className={`${blockPaddingClass} bg-slate-50/50 overflow-hidden`}>
                            <div className={`max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 ${
                              block.layoutStyle === 'centered' ? 'text-center md:flex-col' : 'text-left'
                            }`}>
                              
                              <div className="flex-1 space-y-4">
                                {block.badge && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[10px] font-black tracking-wide uppercase rounded-full"
                                    style={{ color: block.themeColor, backgroundColor: `${block.themeColor}12` }}
                                  >
                                    <Sparkle size={10} className="animate-spin" style={{ color: block.themeColor }} />
                                    <span>{block.badge}</span>
                                  </span>
                                )}
                                <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                                  {block.title}
                                </h1>
                                <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                                  {block.subtitle}
                                </p>
                                <div className={`pt-2 flex flex-wrap gap-3 ${block.layoutStyle === 'centered' ? 'justify-center' : ''}`}>
                                  <button 
                                    className={`px-6 h-12 text-white font-extrabold text-xs transition-transform active:scale-95 shadow-md flex items-center gap-2`}
                                    style={{ 
                                      backgroundColor: block.themeColor, 
                                      borderRadius: block.borderRadius === 'full' ? '9999px' : block.borderRadius === 'md' ? '12px' : '0px'
                                    }}
                                  >
                                    <span>{block.btnText || 'Book appointment'}</span>
                                    <ChevronRight size={14} />
                                  </button>
                                  <button className="px-5 h-12 bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 text-xs font-bold transition-colors"
                                    style={{ borderRadius: block.borderRadius === 'full' ? '9999px' : block.borderRadius === 'md' ? '12px' : '0px' }}
                                  >
                                    Explore Treatments
                                  </button>
                                </div>
                              </div>

                              {block.imageUrl && (
                                <div className="flex-1 w-full max-w-sm shrink-0">
                                  <img 
                                    src={block.imageUrl} 
                                    alt="Luxury Hair Salon Craft" 
                                    referrerPolicy="no-referrer"
                                    className={`w-full aspect-[4/3] object-cover border border-slate-100 ${
                                      block.borderRadius === 'full' ? 'rounded-3xl' : block.borderRadius === 'md' ? 'rounded-xl' : 'rounded-none'
                                    } ${
                                      block.shadowStyle === 'lg' ? 'shadow-2xl' : block.shadowStyle === 'sm' ? 'shadow-md' : 'shadow-none'
                                    }`}
                                  />
                                </div>
                              )}

                            </div>
                          </div>
                        )}

                        {/* 2. SERVICES BLOCK */}
                        {block.type === 'Services' && (
                          <div className={`${blockPaddingClass} bg-white`}>
                            <div className="max-w-5xl mx-auto space-y-8">
                              <div className="text-center space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block" style={{ color: block.themeColor }}>
                                  Signature Menu
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                  {block.title}
                                </h2>
                                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                  {block.subtitle}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {block.services?.map((serv, i) => (
                                  <div 
                                    key={serv.id || i}
                                    className={`bg-slate-50 border border-slate-100 p-5 space-y-3.5 hover:shadow-lg transition-all ${
                                      block.borderRadius === 'full' ? 'rounded-2xl' : block.borderRadius === 'md' ? 'rounded-xl' : 'rounded-none'
                                    }`}
                                  >
                                    {serv.image && (
                                      <img 
                                        src={serv.image} 
                                        alt={serv.name} 
                                        className="w-full h-40 object-cover rounded-lg border border-slate-100"
                                      />
                                    )}
                                    <div className="space-y-1">
                                      <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-xs font-black text-slate-950 truncate leading-tight">{serv.name}</h3>
                                        <span className="text-xs font-black shrink-0" style={{ color: block.themeColor }}>{serv.price}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 font-medium leading-normal">{serv.desc}</p>
                                    </div>
                                    <button 
                                      className="w-full py-2 bg-white hover:bg-slate-100 border text-[9px] font-bold text-center tracking-wide uppercase transition-colors"
                                      style={{ 
                                        borderColor: block.themeColor, 
                                        color: block.themeColor,
                                        borderRadius: block.borderRadius === 'full' ? '9999px' : block.borderRadius === 'md' ? '6px' : '0px'
                                      }}
                                    >
                                      Select service
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. GALLERY GRID BLOCK */}
                        {block.type === 'Gallery' && (
                          <div className={`${blockPaddingClass} bg-slate-50/30`}>
                            <div className="max-w-5xl mx-auto space-y-8">
                              <div className="text-center space-y-2">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                  {block.title}
                                </h2>
                                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                  {block.subtitle}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {block.images?.map((img, i) => (
                                  <div key={i} className="aspect-square relative overflow-hidden group/img border border-slate-100 rounded-xl">
                                    <img 
                                      src={img} 
                                      alt="Studio Interior Asset" 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="text-[10px] font-bold text-white uppercase tracking-widest border border-white/20 px-3 py-1 rounded">View details</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. REVIEWS BLOCK */}
                        {block.type === 'Reviews' && (
                          <div className={`${blockPaddingClass} bg-white`}>
                            <div className="max-w-5xl mx-auto space-y-8">
                              <div className="text-center space-y-2">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                  {block.title}
                                </h2>
                                <p className="text-xs text-slate-500 max-w-md mx-auto">
                                  {block.subtitle}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {block.reviews?.map((rev, i) => (
                                  <div 
                                    key={rev.id || i}
                                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm"
                                  >
                                    <div className="space-y-2">
                                      {/* Stars */}
                                      <div className="flex text-amber-500 text-xs">★ ★ ★ ★ ★</div>
                                      <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                                        "{rev.desc}"
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-600 border border-blue-200">
                                        {rev.name.charAt(0)}
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-black text-slate-900 leading-none">{rev.name}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold mt-1 block">{rev.role}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. APPOINTMENT LEAD FORM BLOCK */}
                        {block.type === 'Forms' && (
                          <div className={`${blockPaddingClass} bg-slate-50/50`}>
                            <div className="max-w-xl mx-auto bg-white border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6">
                              <div className="text-center space-y-1">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                  {block.title}
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                  {block.subtitle}
                                </p>
                              </div>

                              <form className="space-y-4 text-left" onSubmit={(e) => { e.preventDefault(); triggerToast('Demo booking submission captured successfully!'); }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">Your Full Name</label>
                                    <input 
                                      type="text" 
                                      placeholder="Rathnavel Karthi" 
                                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 bg-slate-50/50"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">WhatsApp Mobile</label>
                                    <input 
                                      type="tel" 
                                      placeholder="+91 98765 43210" 
                                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 bg-slate-50/50"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">Select Treatment</label>
                                    <select className="w-full h-10 px-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 bg-slate-50/50">
                                      <option>Sculpted Signature Cut (₹2,499)</option>
                                      <option>Balayage & Couture Color (₹6,800)</option>
                                      <option>Luxury Caviar Therapy (₹4,200)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide block mb-1">Priority Booking Date</label>
                                    <input 
                                      type="date" 
                                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 bg-slate-50/50"
                                      required
                                    />
                                  </div>
                                </div>

                                <button 
                                  type="submit"
                                  className="w-full h-12 text-white font-extrabold text-xs transition-transform active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                  style={{ 
                                    backgroundColor: block.themeColor,
                                    borderRadius: block.borderRadius === 'full' ? '9999px' : block.borderRadius === 'md' ? '10px' : '0px'
                                  }}
                                >
                                  <span>{block.btnText || 'Book appointment slot'}</span>
                                  <Check size={14} />
                                </button>
                              </form>
                            </div>
                          </div>
                        )}

                        {/* 6. PROMO CODE BLOCK */}
                        {block.type === 'Promo' && (
                          <div className={`${blockPaddingClass}`} style={{ backgroundColor: `${block.themeColor}08` }}>
                            <div className="max-w-4xl mx-auto text-center space-y-4">
                              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-full animate-pulse">
                                Limited Festive Celebration Slot
                              </span>
                              <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
                                {block.title}
                              </h2>
                              <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                                {block.subtitle}
                              </p>
                              <button 
                                onClick={() => triggerToast('Diwali coupon unlocked: FESTIVE30. Copied to clipboard.')}
                                className="px-6 h-11 text-white font-extrabold text-xs transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                                style={{ 
                                  backgroundColor: block.themeColor,
                                  borderRadius: block.borderRadius === 'full' ? '9999px' : block.borderRadius === 'md' ? '10px' : '0px'
                                }}
                              >
                                <span>{block.btnText || 'Claim Coupon Code'}</span>
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

          {/* ==========================================
              AI FLOATING ASSISTANT
              ========================================== */}
          <div className="absolute bottom-6 right-6 z-30">
            <button
              onClick={() => setAiOpen(!aiOpen)}
              className="px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce hover:scale-105 transition-all cursor-pointer border border-blue-400/20"
            >
              <Sparkles size={14} className="animate-spin" />
              <span>Ask OnlyPage AI</span>
            </button>

            <AnimatePresence>
              {aiOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setAiOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute right-0 bottom-14 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-40 p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Sparkles size={12} className="text-white" />
                        </div>
                        <span className="text-xs font-black text-white">OnlyPage Designer Co-pilot</span>
                      </div>
                      <span className="text-[9px] font-bold text-purple-400 bg-purple-950/40 border border-purple-900/30 px-2 py-0.5 rounded-full uppercase">Active</span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        I can automatically generate copy, restructure layouts, update color systems, and optimize SEO structures. Try a quick prompt:
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => runAiAdjustment('luxury')}
                          className="px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                        >
                          💎 Make sections luxury
                        </button>
                        <button
                          onClick={() => runAiAdjustment('blue')}
                          className="px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                        >
                          🎨 Change accents to blue
                        </button>
                        <button
                          onClick={() => runAiAdjustment('diwali')}
                          className="px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                        >
                          🎁 Add Diwali promo offer
                        </button>
                        <button
                          onClick={() => runAiAdjustment('seo')}
                          className="px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                        >
                          📈 Instantly optimize SEO
                        </button>
                      </div>

                      <div className="h-px bg-slate-800" />

                      {aiFeedback && (
                        <div className="p-2.5 bg-blue-950/20 border border-blue-900/40 rounded-xl space-y-1 text-[10px]">
                          <p className="text-blue-400 font-black flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            <span>AI Execution Complete</span>
                          </p>
                          <p className="text-slate-300 leading-normal font-semibold">{aiFeedback}</p>
                        </div>
                      )}

                      {aiWorking ? (
                        <div className="space-y-2 py-2">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span className="flex items-center gap-1.5 animate-pulse">
                              <Sparkle size={10} className="animate-spin text-purple-400" />
                              <span>Generative code restructuring...</span>
                            </span>
                            <span>84%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-4/5 animate-pulse" />
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={(e) => { e.preventDefault(); if (aiPrompt.trim()) runAiAdjustment('custom'); }} className="flex gap-2">
                          <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Type customized instruction, e.g. Make button colors orange..."
                            className="flex-1 h-9 px-3 text-xs bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-blue-500 text-slate-200"
                          />
                          <button
                            type="submit"
                            disabled={!aiPrompt.trim()}
                            className="h-9 w-9 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send size={12} />
                          </button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </main>

        {/* ==========================================
            RIGHT PROPERTIES INSPECTOR (320px)
            ========================================== */}
        <aside className="w-[320px] bg-slate-950 border-l border-slate-800 flex flex-col h-full shrink-0 z-10 text-slate-200 select-none">
          
          <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-1.5">
              <Sliders size={13} className="text-blue-500" />
              <span>Inspector Panel</span>
            </span>
            {selectedBlock ? (
              <span className="text-[9px] font-black text-blue-400 bg-blue-900/30 border border-blue-900/40 px-2 py-0.5 rounded uppercase">
                {selectedBlock.type} Selected
              </span>
            ) : (
              <span className="text-[9px] font-black text-slate-500 uppercase">None Selected</span>
            )}
          </div>

          {selectedBlock ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Properties Tab selector */}
              <div className="grid grid-cols-3 border-b border-slate-800 p-1.5 bg-slate-950 shrink-0">
                {[
                  { id: 'content' as const, label: 'Content', icon: Type },
                  { id: 'design' as const, label: 'Design', icon: Palette },
                  { id: 'settings' as const, label: 'Layout', icon: SlidersHorizontal }
                ].map(propTab => {
                  const Icon = propTab.icon;
                  const isSelected = activeInspectorTab === propTab.id;
                  return (
                    <button
                      key={propTab.id}
                      onClick={() => setActiveInspectorTab(propTab.id)}
                      className={`py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected 
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={12} />
                      <span>{propTab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab scrolling area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-left">
                
                {/* A. CONTENT TAB */}
                {activeInspectorTab === 'content' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={selectedBlock.badge || ''}
                        onChange={(e) => updateBlockProperty(selectedBlock.id, 'badge', e.target.value)}
                        placeholder="Tagline text..."
                        className="w-full h-9 px-3 text-xs bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-blue-500 text-slate-200 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1">Headline text</label>
                      <textarea
                        value={selectedBlock.title}
                        onChange={(e) => updateBlockProperty(selectedBlock.id, 'title', e.target.value)}
                        rows={2}
                        className="w-full p-2.5 text-xs bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-blue-500 text-slate-200 font-extrabold resize-none leading-normal"
                      />
                    </div>

                    {selectedBlock.subtitle !== undefined && (
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1">Subtitle narrative</label>
                        <textarea
                          value={selectedBlock.subtitle}
                          onChange={(e) => updateBlockProperty(selectedBlock.id, 'subtitle', e.target.value)}
                          rows={3}
                          className="w-full p-2.5 text-xs bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-blue-500 text-slate-300 resize-none leading-normal font-semibold"
                        />
                      </div>
                    )}

                    {selectedBlock.btnText !== undefined && (
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1">Button text CTA</label>
                        <input
                          type="text"
                          value={selectedBlock.btnText}
                          onChange={(e) => updateBlockProperty(selectedBlock.id, 'btnText', e.target.value)}
                          className="w-full h-9 px-3 text-xs bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-blue-500 text-slate-200 font-bold"
                        />
                      </div>
                    )}

                    {selectedBlock.imageUrl !== undefined && (
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1">Cover Image Source URL</label>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={selectedBlock.imageUrl}
                            onChange={(e) => updateBlockProperty(selectedBlock.id, 'imageUrl', e.target.value)}
                            className="w-full h-9 px-3 text-[10px] bg-slate-900 border border-slate-800 rounded-lg outline-none focus:border-blue-500 text-slate-400"
                          />
                          <div className="flex gap-2">
                            {[
                              'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400',
                              'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=400',
                              'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400'
                            ].map((url) => (
                              <button
                                key={url}
                                onClick={() => updateBlockProperty(selectedBlock.id, 'imageUrl', url)}
                                className="flex-1 h-10 border border-slate-800 hover:border-blue-500 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                              >
                                <img src={url} alt="preset preview" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* B. DESIGN STYLE TAB */}
                {activeInspectorTab === 'design' && (
                  <div className="space-y-4">
                    {/* Theme accent colors */}
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Accent Palette Token</label>
                      <div className="flex gap-2">
                        {[
                          { val: '#3b82f6', name: 'Royal Blue' },
                          { val: '#ec4899', name: 'Rose pink' },
                          { val: '#d97706', name: 'Bronze Gold' },
                          { val: '#10b981', name: 'Organic Green' },
                          { val: '#8b5cf6', name: 'Luxe Violet' }
                        ].map(col => (
                          <button
                            key={col.val}
                            onClick={() => updateBlockProperty(selectedBlock.id, 'themeColor', col.val)}
                            className={`w-7 h-7 rounded-full border transition-all hover:scale-110 cursor-pointer flex items-center justify-center ${
                              selectedBlock.themeColor === col.val ? 'border-white scale-105' : 'border-slate-800'
                            }`}
                            style={{ backgroundColor: col.val }}
                            title={col.name}
                          >
                            {selectedBlock.themeColor === col.val && <Check size={10} className="text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Pairings */}
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1">Typography Pairing</label>
                      <div className="space-y-1">
                        {[
                          { id: 'Inter', name: 'Inter (Swiss/Modern)', sub: 'Default sans-serif typography' },
                          { id: 'Space Grotesk', name: 'Space Grotesk (Tech/Mono)', sub: 'Avant-garde structure headings' },
                          { id: 'Playfair Display', name: 'Playfair Display (Editorial/Serif)', sub: 'Elite classic publication luxury' }
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => updateBlockProperty(selectedBlock.id, 'fontFamily', f.id)}
                            className={`w-full text-left p-2 rounded-lg border transition-colors cursor-pointer ${
                              selectedBlock.fontFamily === f.id 
                                ? 'bg-slate-900 border-blue-500/50 text-white'
                                : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900'
                            }`}
                          >
                            <p className="text-[10px] font-black">{f.name}</p>
                            <p className="text-[8px] text-slate-500 mt-0.5 leading-none">{f.sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Padding space */}
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Section Spacing Padding</label>
                      <div className="grid grid-cols-3 bg-slate-950 p-0.5 border border-slate-800 rounded-lg">
                        {[
                          { id: 'small', label: 'Compact' },
                          { id: 'medium', label: 'Spacious' },
                          { id: 'large', label: 'Bespoke' }
                        ].map(p => (
                          <button
                            key={p.id}
                            onClick={() => updateBlockProperty(selectedBlock.id, 'paddingSize', p.id)}
                            className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                              selectedBlock.paddingSize === p.id ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Border radius */}
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Card Border Radius</label>
                      <div className="grid grid-cols-3 bg-slate-950 p-0.5 border border-slate-800 rounded-lg">
                        {[
                          { id: 'none', label: 'Angular' },
                          { id: 'md', label: 'Smooth' },
                          { id: 'full', label: 'Pill' }
                        ].map(b => (
                          <button
                            key={b.id}
                            onClick={() => updateBlockProperty(selectedBlock.id, 'borderRadius', b.id)}
                            className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                              selectedBlock.borderRadius === b.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Premium Shadows */}
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Visual depth shadow</label>
                      <div className="grid grid-cols-3 bg-slate-950 p-0.5 border border-slate-800 rounded-lg">
                        {[
                          { id: 'none', label: 'Flat' },
                          { id: 'sm', label: 'Classic' },
                          { id: 'lg', label: 'Elevated' }
                        ].map(s => (
                          <button
                            key={s.id}
                            onClick={() => updateBlockProperty(selectedBlock.id, 'shadowStyle', s.id)}
                            className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                              selectedBlock.shadowStyle === s.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* C. SETTINGS & LAYOUT TAB */}
                {activeInspectorTab === 'settings' && (
                  <div className="space-y-4">
                    {/* Layout mode switcher */}
                    {selectedBlock.layoutStyle !== undefined && (
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Visual Matrix alignment</label>
                        <div className="grid grid-cols-2 bg-slate-950 p-0.5 border border-slate-800 rounded-lg">
                          {[
                            { id: 'centered', label: 'Centered Focus' },
                            { id: 'split', label: 'Two-column Split' }
                          ].map(lay => (
                            <button
                              key={lay.id}
                              onClick={() => updateBlockProperty(selectedBlock.id, 'layoutStyle', lay.id)}
                              className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                                selectedBlock.layoutStyle === lay.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {lay.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Entrance Animation triggers */}
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Motion Entrance effect</label>
                      <div className="grid grid-cols-3 bg-slate-950 p-0.5 border border-slate-800 rounded-lg">
                        {[
                          { id: 'fade', label: 'Fade' },
                          { id: 'slide', label: 'Slide Up' },
                          { id: 'scale', label: 'Scale In' }
                        ].map(anim => (
                          <button
                            key={anim.id}
                            onClick={() => updateBlockProperty(selectedBlock.id, 'animationType', anim.id)}
                            className={`py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                              selectedBlock.animationType === anim.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {anim.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-slate-800" />

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Block telemetry metadata</span>
                      <div className="space-y-1 text-[10px] text-slate-500">
                        <div className="flex justify-between">
                          <span>Unique Node ID:</span>
                          <span className="font-mono text-slate-400">{selectedBlock.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Render Layer:</span>
                          <span className="text-slate-400">Flex Grid Layout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
              <Sliders size={20} className="text-slate-700" />
              <p className="text-xs font-bold">No active component selected</p>
              <p className="text-[10px] text-slate-600 leading-normal max-w-xs">
                Select any block inside the middle canvas workspace to dynamically populate and adjust parameters.
              </p>
            </div>
          )}

        </aside>

      </div>

      {/* ==========================================
          TOAST ALERT FEEDBACK
          ========================================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-full text-slate-200 text-xs font-black shadow-2xl z-55 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          ADD PAGE MODAL
          ========================================== */}
      {showAddPageModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="w-96 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl text-slate-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-black uppercase text-slate-300">Create New Route Page</span>
              <button 
                onClick={() => setShowAddPageModal(false)}
                className="text-slate-500 hover:text-white font-extrabold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Page Name</label>
                <input
                  type="text"
                  placeholder="e.g. Gallery, Team, Pricing"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-slate-200 font-bold"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                This will automatically configure a responsive URL route (e.g. <span className="font-mono">studio46.onlypage.in/{newPageName.toLowerCase()}</span>) and import pre-formatted design structures.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowAddPageModal(false)}
                className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                disabled={!newPageName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-extrabold text-white cursor-pointer"
              >
                Generate Page Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SEO METADATA SETTINGS MODAL
          ========================================== */}
      {showSeoModal && (() => {
        const targetPage = pages.find(p => p.id === showSeoModal);
        if (!targetPage) return null;
        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="w-[450px] bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl text-slate-200 text-left">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-black uppercase text-slate-300">Google SEO Co-pilot: {targetPage.name} Route</span>
                <button 
                  onClick={() => setShowSeoModal(null)}
                  className="text-slate-500 hover:text-white font-extrabold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Meta HTML Title</label>
                  <input
                    type="text"
                    value={targetPage.seoTitle}
                    onChange={(e) => {
                      setPages(pages.map(p => p.id === showSeoModal ? { ...p, seoTitle: e.target.value } : p));
                    }}
                    className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-slate-200 font-semibold"
                  />
                  <p className="text-[9px] text-slate-500 mt-0.5">Recommended scale: 50-60 characters for best Google click rates.</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Meta HTML Description</label>
                  <textarea
                    value={targetPage.seoDesc}
                    onChange={(e) => {
                      setPages(pages.map(p => p.id === showSeoModal ? { ...p, seoDesc: e.target.value } : p));
                    }}
                    rows={3}
                    className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-slate-300 resize-none leading-normal"
                  />
                  <p className="text-[9px] text-slate-500 mt-0.5">Recommended limit: 150-160 characters for maximum search description snippets.</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Primary Keywords</label>
                  <input
                    type="text"
                    value={targetPage.seoKeywords}
                    onChange={(e) => {
                      setPages(pages.map(p => p.id === showSeoModal ? { ...p, seoKeywords: e.target.value } : p));
                    }}
                    className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-blue-500 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    // Quick AI fix inside SEO modal
                    setPages(pages.map(p => p.id === showSeoModal ? {
                      ...p,
                      seoTitle: `Best Premium ${p.name} Bangalore | studio46 Salon`,
                      seoDesc: `Discover premium customized ${p.name} therapy at studio46 Salon. Award-winning styling specialists and precision hair treatments designed for you.`,
                      seoKeywords: `best salon, bangalore grooming, priority ${p.name.toLowerCase()}`
                    } : p));
                    triggerToast('AI optimized SEO metadata successfully!');
                  }}
                  className="mr-auto px-3.5 py-2 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-800 hover:from-purple-800/60 rounded-xl text-xs font-black text-purple-300 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles size={11} />
                  <span>AI Auto-Optimize</span>
                </button>

                <button
                  onClick={() => setShowSeoModal(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-extrabold text-white cursor-pointer"
                >
                  Save SEO Meta Tags
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

export default WebsiteEditor;
