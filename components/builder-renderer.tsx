import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  Award, Heart, Check, Globe, Sliders, Layout, Type, Phone, Mail, MapPin, 
  Users, CheckCircle2, MessageSquare, Calendar, ChevronDown, ArrowRight, 
  UploadCloud, ShieldCheck, Star, Play, ArrowUpRight, CheckSquare, 
  ThumbsUp, Menu, Search, Sparkles
} from 'lucide-react';
import { 
  Spotlight, MovingBorder, GridBackground, DotBackground, AuroraBackground, 
  SparkleParticles, InfiniteMarquee, TextReveal, NumberCounter, MouseGlowCard, 
  Magnetic, AnimatedBeams 
} from './builder-effects';
import { WebBlock, BlockCSSStyles } from './website-builder-editor';

// Dynamically render any Lucide icon by name
export function DynamicIcon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  const IconComponent = (LucideIcons as any)[name];
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  // Default fallback icon
  return <Sparkles size={size} className={className} />;
}

interface BuilderRendererProps {
  block: WebBlock;
  isActive: boolean;
  onSelect: () => void;
  selectedSubElement?: string | null;
  onSelectSubElement?: (elementId: 'background' | 'badge' | 'title' | 'subtitle' | 'button' | 'card' | 'media') => void;
}

export function BuilderRenderer({ 
  block, 
  isActive, 
  onSelect,
  selectedSubElement = null,
  onSelectSubElement
}: BuilderRendererProps) {
  const styles = block.styles;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({});
  const [activeBeforeAfter, setActiveBeforeAfter] = useState<number>(50); // percentage slider
  const [activeOfferClaimed, setActiveOfferClaimed] = useState(false);

  // Parse font family
  const getFontFamilyClass = (font: string) => {
    const serifFonts = ['Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond', 'EB Garamond', 'Cinzel', 'Georgia'];
    const monoFonts = ['JetBrains Mono', 'Fira Code', 'Space Mono', 'Source Code Pro'];
    if (serifFonts.includes(font)) {
      return 'font-serif';
    }
    if (monoFonts.includes(font)) {
      return 'font-mono text-sm tracking-tight';
    }
    return 'font-sans';
  };

  const getFontFamilyStyle = (font: string) => {
    const serifFonts = ['Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond', 'EB Garamond', 'Cinzel', 'Georgia'];
    const monoFonts = ['JetBrains Mono', 'Fira Code', 'Space Mono', 'Source Code Pro'];
    const cursiveFonts = ['Caveat', 'Pacifico', 'Shadows Into Light', 'Great Vibes', 'Architects Daughter', 'Dancing Script'];
    
    if (serifFonts.includes(font)) {
      return `"${font}", Georgia, serif`;
    }
    if (monoFonts.includes(font)) {
      return `"${font}", monospace`;
    }
    if (cursiveFonts.includes(font)) {
      return `"${font}", cursive`;
    }
    return `"${font}", sans-serif`;
  };

  // ----------------------------------------------------
  // SUB-ELEMENT SELECTED STYLINGS & FALLBACK PATTERNS
  // ----------------------------------------------------
  
  const titleStyle: React.CSSProperties = {
    color: (styles as any).titleColor || styles.textColor,
    fontFamily: getFontFamilyStyle((styles as any).titleFontFamily || styles.fontFamily),
    fontSize: `${(styles as any).titleFontSize || styles.titleSize}px`,
    fontWeight: (styles as any).titleFontWeight === 'light' ? 300 : (styles as any).titleFontWeight === 'normal' ? 400 : (styles as any).titleFontWeight === 'semibold' ? 600 : (styles as any).titleFontWeight === 'black' ? 900 : 700,
    lineHeight: (styles as any).titleLineHeight || styles.lineHeight || 1.2,
    letterSpacing: (styles as any).titleLetterSpacing || 'normal',
    padding: `${(styles as any).titlePadding || 0}px`,
    backgroundColor: (styles as any).titleBackground || 'transparent',
    borderRadius: `${(styles as any).titleBorderRadius || 0}px`,
    borderWidth: `${(styles as any).titleBorderWidth || 0}px`,
    borderColor: (styles as any).titleBorderColor || 'transparent',
    borderStyle: ((styles as any).titleBorderStyle as any) || 'solid',
    textTransform: ((styles as any).titleTransform as any) || 'none',
    textAlign: styles.textAlign,
  };

  const subtitleStyle: React.CSSProperties = {
    color: (styles as any).subtitleColor || styles.textColor,
    fontFamily: getFontFamilyStyle((styles as any).subtitleFontFamily || styles.fontFamily),
    fontSize: `${(styles as any).subtitleFontSize || styles.subtitleSize}px`,
    fontWeight: (styles as any).subtitleFontWeight === 'bold' ? 700 : 'normal',
    padding: `${(styles as any).subtitlePadding || 0}px`,
    lineHeight: (styles as any).subtitleLineHeight || 1.5,
  };

  const badgeStyle: React.CSSProperties = {
    backgroundColor: (styles as any).badgeBgColor || styles.badgeBgColor,
    color: (styles as any).badgeTextColor || styles.badgeTextColor,
    fontFamily: getFontFamilyStyle((styles as any).badgeFontFamily || styles.fontFamily),
    borderRadius: `${(styles as any).badgeBorderRadius !== undefined ? (styles as any).badgeBorderRadius : 9999}px`,
    borderWidth: `${(styles as any).badgeBorderWidth || 1}px`,
    borderColor: (styles as any).badgeBorderColor || `${styles.accentColor}30`,
    fontSize: `${(styles as any).badgeFontSize || 10}px`,
    padding: (styles as any).badgePadding || '4px 12px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: (styles as any).buttonBgColor || styles.buttonBgColor,
    color: (styles as any).buttonTextColor || styles.buttonTextColor,
    fontFamily: getFontFamilyStyle((styles as any).buttonFontFamily || styles.fontFamily),
    borderRadius: `${(styles as any).buttonBorderRadius !== undefined ? (styles as any).buttonBorderRadius : 8}px`,
    borderWidth: `${(styles as any).buttonBorderWidth || 0}px`,
    borderColor: (styles as any).buttonBorderColor || 'transparent',
    fontSize: `${(styles as any).buttonFontSize || 14}px`,
    padding: (styles as any).buttonPadding || '12px 24px',
    boxShadow: (styles as any).buttonShadow === 'none' ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: (styles as any).cardBgColor || styles.cardBgColor,
    color: (styles as any).cardTextColor || styles.cardTextColor,
    borderRadius: `${(styles as any).cardBorderRadius !== undefined ? (styles as any).cardBorderRadius : 12}px`,
    borderWidth: `${(styles as any).cardBorderWidth !== undefined ? (styles as any).cardBorderWidth : 1}px`,
    borderColor: (styles as any).cardBorderColor || styles.cardBorderColor,
    boxShadow: (styles as any).cardShadow === 'none' ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)',
    padding: `${(styles as any).cardPadding !== undefined ? (styles as any).cardPadding : 32}px`,
  };

  const mediaStyle: React.CSSProperties = {
    borderRadius: `${(styles as any).mediaBorderRadius !== undefined ? (styles as any).mediaBorderRadius : 16}px`,
    borderWidth: `${(styles as any).mediaBorderWidth || 0}px`,
    borderColor: (styles as any).mediaBorderColor || 'transparent',
    boxShadow: (styles as any).mediaShadow === 'none' ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.1)',
    filter: (styles as any).mediaFilter === 'grayscale' ? 'grayscale(1)' : (styles as any).mediaFilter === 'blur' ? 'blur(4px)' : (styles as any).mediaFilter === 'sepia' ? 'sepia(1)' : 'none',
  };

  const mediaShape = (styles as any).mediaShape || 'none';
  let mediaClipPath = undefined;
  if (mediaShape === 'circle') {
    mediaClipPath = 'circle(50% at 50% 50%)';
  } else if (mediaShape === 'hexagon') {
    mediaClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
  } else if (mediaShape === 'triangle') {
    mediaClipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
  } else if (mediaShape === 'star') {
    mediaClipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
  }
  if (mediaClipPath) {
    mediaStyle.clipPath = mediaClipPath;
  }

  // Visual outline indicator for sub-elements
  const SelectableElement = ({ 
    elementId, 
    children, 
    className = "", 
    style 
  }: { 
    elementId: 'background' | 'badge' | 'title' | 'subtitle' | 'button' | 'card' | 'media'; 
    children: React.ReactNode; 
    className?: string;
    style?: React.CSSProperties;
    key?: React.Key;
  }) => {
    const isSubActive = selectedSubElement === elementId;
    const isSelectedBlock = isActive;
    
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectSubElement) {
            onSelectSubElement(elementId);
          } else {
            onSelect();
          }
        }}
        style={style}
        className={`relative transition-all duration-200 cursor-pointer group/subel rounded-lg ${className} ${
          isSubActive && isSelectedBlock
            ? 'ring-2 ring-blue-500 shadow-md ring-offset-1 ring-offset-white' 
            : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-blue-400 hover:outline-offset-2'
        }`}
      >
        {/* Figma label overlay on hover/active */}
        <div className={`absolute -top-4 left-0 text-[8px] font-mono font-bold uppercase px-1 rounded pointer-events-none transition-opacity z-20 ${
          isSubActive && isSelectedBlock
            ? 'bg-blue-500 text-white opacity-100'
            : 'bg-blue-400/80 text-white opacity-0 group-hover/subel:opacity-100'
        }`}>
          {elementId}
        </div>
        {children}
      </div>
    );
  };

  const bgType = (styles as any).bgType || (styles.useGradient ? 'gradient' : 'color');
  const bgImageUrl = (styles as any).bgImageUrl || '';
  const bgImageOpacity = (styles as any).bgImageOpacity !== undefined ? (styles as any).bgImageOpacity : 50;
  const bgImageAttachment = (styles as any).bgImageAttachment || 'scroll';
  const bgImageSize = (styles as any).bgImageSize || 'cover';

  const clickResponse = (styles as any).clickResponse || 'none';
  const hoverEffect = (styles as any).hoverEffect || 'none';

  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  // Build the outer container styles
  const containerStyle: React.CSSProperties = {
    paddingTop: `${styles.paddingTop}px`,
    paddingBottom: `${styles.paddingBottom}px`,
    paddingLeft: `${styles.paddingLeft}px`,
    paddingRight: `${styles.paddingRight}px`,
    backgroundColor: bgType === 'color' ? styles.backgroundColor : undefined,
    backgroundImage: bgType === 'gradient' ? styles.backgroundGradient : undefined,
    color: styles.textColor,
    fontFamily: getFontFamilyStyle(styles.fontFamily),
    borderRadius: `${styles.borderRadius}px`,
    borderWidth: `${styles.borderWidth}px`,
    borderColor: styles.borderColor,
    borderStyle: styles.borderStyle,
    boxShadow: styles.boxShadow === 'none' ? 'none' : '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
    textAlign: styles.textAlign,
    position: 'relative',
    cursor: clickResponse !== 'none' ? 'pointer' : 'default',
  };

  // tap configuration based on selection
  const whileTapConfig = clickResponse === 'scale-down' 
    ? { scale: 0.98 }
    : clickResponse === 'scale-up'
    ? { scale: 1.02 }
    : clickResponse === 'bounce'
    ? { y: -6 }
    : clickResponse === 'pulse'
    ? { scale: [1, 1.03, 1] }
    : clickResponse === 'flash'
    ? { opacity: 0.6 }
    : undefined;

  const whileHoverConfig = hoverEffect === 'lift'
    ? { y: -5 }
    : hoverEffect === 'glow'
    ? { boxShadow: `0 20px 30px -5px ${styles.accentColor}30, 0 10px 15px -5px ${styles.accentColor}20` }
    : hoverEffect === 'tilt'
    ? { rotateX: 1, rotateY: 1 }
    : hoverEffect === 'scale'
    ? { scale: 1.01 }
    : undefined;

  // Elements Entrance Animation Config (Aceternity style)
  const elementVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  // Pre-configured mock lists for rich variants
  const defaultLogos = [
    <span className="text-sm font-black tracking-widest text-slate-400">VERCEL</span>,
    <span className="text-sm font-black tracking-widest text-slate-400">STRIPE</span>,
    <span className="text-sm font-black tracking-widest text-slate-400">APPLE</span>,
    <span className="text-sm font-black tracking-widest text-slate-400">LINEAR</span>,
    <span className="text-sm font-black tracking-widest text-slate-400">FIGMA</span>,
    <span className="text-sm font-black tracking-widest text-slate-400">SUPABASE</span>,
    <span className="text-sm font-black tracking-widest text-slate-400">FRAMER</span>,
  ];

  return (
    <motion.div 
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
        if (clickResponse === 'ripple') {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const id = Date.now();
          setRipples(prev => [...prev, { x, y, id }]);
          setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
          }, 600);
        }
      }}
      whileTap={whileTapConfig}
      whileHover={whileHoverConfig}
      style={containerStyle}
      className={`relative group transition-all duration-300 select-none overflow-hidden ${
        isActive ? 'ring-2 ring-blue-500 shadow-2xl scale-[1.002] z-20' : 'hover:ring-1 hover:ring-slate-300'
      }`}
    >
      {/* Dynamic Background Image Layer (absolute to avoid text opacity inheritance) */}
      {bgType === 'image' && bgImageUrl && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: bgImageSize,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: bgImageAttachment,
            opacity: bgImageOpacity / 100
          }}
        />
      )}

      {/* Dynamic Click Ripples */}
      {ripples.map(ripple => (
        <span 
          key={ripple.id}
          className="absolute bg-white/20 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
            transform: 'scale(4)',
            animationDuration: '600ms',
            zIndex: 5
          }}
        />
      ))}
      {/* Visual background accents depending on variants */}
      {block.variant === 'gradient-glow' && <Spotlight />}
      {block.variant === '3d-mesh' && <DotBackground />}
      {block.variant === 'aurora-sky' && <AuroraBackground />}
      {styles.fontFamily === 'JetBrains Mono' && <GridBackground />}
      {block.variant === 'gradient-glow' && <SparkleParticles count={15} />}

      <div className="mx-auto relative z-10" style={{ maxWidth: `${styles.maxWidth}px`, width: '100%' }}>
        
        {/* ==================== BADGE ==================== */}
        {block.badge && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <SelectableElement elementId="badge">
              <span 
                className="inline-block text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border shadow-sm"
                style={badgeStyle}
              >
                {block.badge}
              </span>
            </SelectableElement>
          </motion.div>
        )}

        {/* ==========================================================
            CATEGORY: HERO
            ========================================================== */}
        {block.type === 'Hero' && (
          <div>
            {/* Split layout or centered layout depending on variant */}
            {(block.variant === 'split' || block.variant === 'saas-modern' || block.variant === 'video-simulate') ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
                <div>
                  <SelectableElement elementId="title">
                    <h1 
                      className="leading-tight font-black"
                      style={titleStyle}
                    >
                      {block.title}
                    </h1>
                  </SelectableElement>
                  
                  <SelectableElement elementId="subtitle" className="my-6">
                    <p className="leading-relaxed" style={subtitleStyle}>
                      {block.subtitle}
                    </p>
                  </SelectableElement>

                  <div className="flex flex-wrap gap-4 mt-8">
                    {block.btnText && (
                      <SelectableElement elementId="button">
                        <Magnetic>
                          <button 
                            className="font-extrabold cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                            style={buttonStyle}
                          >
                            {block.btnText}
                          </button>
                        </Magnetic>
                      </SelectableElement>
                    )}
                    <button className="px-6 py-4 font-bold text-sm rounded-lg hover:bg-slate-500/10 transition flex items-center gap-1.5 opacity-90">
                      Learn More <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right side graphical previews */}
                <div className="relative">
                  <SelectableElement elementId="media">
                    {block.variant === 'saas-modern' ? (
                      <MouseGlowCard className="p-1 bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-md">
                        <div className="bg-slate-950 rounded-xl overflow-hidden aspect-video relative flex flex-col" style={mediaStyle}>
                          <div className="h-6 bg-slate-900 border-b border-slate-800 flex items-center px-3 gap-1.5">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div className="h-4 w-1/3 bg-blue-500/20 rounded" />
                            <div className="space-y-2">
                              <div className="h-3 w-full bg-slate-800 rounded" />
                              <div className="h-3 w-5/6 bg-slate-800 rounded" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="h-10 bg-slate-900 border border-slate-800 rounded" />
                              <div className="h-10 bg-slate-900 border border-slate-800 rounded" />
                              <div className="h-10 bg-slate-900 border border-slate-800 rounded" />
                            </div>
                          </div>
                        </div>
                      </MouseGlowCard>
                    ) : block.variant === 'video-simulate' ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group" style={mediaStyle}>
                        <img src={block.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <button className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition duration-300 z-10">
                          <Play size={20} fill="currentColor" className="ml-1" />
                        </button>
                      </div>
                    ) : (
                      block.imageUrl && (
                        <motion.img 
                          whileHover={{ scale: 1.02 }}
                          src={block.imageUrl} 
                          className="w-full object-cover shadow-2xl border border-slate-100/10" 
                          style={{ ...mediaStyle, maxHeight: '420px' }} 
                          alt="Hero Visual" 
                        />
                      )
                    )}
                  </SelectableElement>
                </div>
              </div>
            ) : (
              // Centered or alternative (gradient-glow, aurora-sky, 3d-mesh)
              <div className="max-w-3xl mx-auto flex flex-col items-center">
                {block.variant === '3d-mesh' && <AnimatedBeams />}
                <SelectableElement elementId="title">
                  <h1 
                    className="leading-tight font-black mb-6"
                    style={titleStyle}
                  >
                    {block.variant === 'aurora-sky' ? <TextReveal text={block.title} /> : block.title}
                  </h1>
                </SelectableElement>
                
                <SelectableElement elementId="subtitle" className="mb-8">
                  <p className="leading-relaxed max-w-2xl opacity-90" style={subtitleStyle}>
                    {block.subtitle}
                  </p>
                </SelectableElement>

                {block.btnText && (
                  <SelectableElement elementId="button">
                    <Magnetic>
                      <button 
                        className="font-extrabold cursor-pointer transition-all duration-300 shadow-2xl hover:translate-y-[-2px]"
                        style={buttonStyle}
                      >
                        {block.btnText}
                      </button>
                    </Magnetic>
                  </SelectableElement>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: FEATURES
            ========================================================== */}
        {block.type === 'Features' && (
          <div>
            <SelectableElement elementId="title">
              <h2 style={titleStyle} className="tracking-tight">{block.title}</h2>
            </SelectableElement>
            <SelectableElement elementId="subtitle" className="mb-12">
              <p style={subtitleStyle} className="max-w-2xl mx-auto">{block.subtitle}</p>
            </SelectableElement>
            
            {block.variant === 'bento-box' ? (
              // BENTO GRID LAYOUT
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {block.features?.map((feat, i) => (
                  <SelectableElement key={feat.id} elementId="card" className={i === 0 ? 'md:col-span-2 md:row-span-1' : ''}>
                    <MouseGlowCard 
                      className="p-8 flex flex-col justify-between h-full"
                      style={cardStyle}
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500 mb-6">
                          <DynamicIcon name={feat.icon} size={20} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                        <p className="text-sm opacity-80 leading-relaxed">{feat.desc}</p>
                      </div>
                      {i === 0 && (
                        <div className="mt-8 border-t border-slate-100/10 pt-4 flex items-center gap-1.5 text-xs font-bold text-blue-500">
                          Explore Bento Module <ArrowUpRight size={14} />
                        </div>
                      )}
                    </MouseGlowCard>
                  </SelectableElement>
                ))}
              </div>
            ) : block.variant === 'alternating' ? (
              // ALTERNATING SECTIONS
              <div className="space-y-16 text-left">
                {block.features?.map((feat, i) => (
                  <div key={feat.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                      <span className="text-xs font-bold tracking-widest text-blue-500 mb-2 block uppercase">STEP 0{i + 1}</span>
                      <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
                      <p className="text-sm leading-relaxed opacity-80 mb-6">{feat.desc}</p>
                    </div>
                    <SelectableElement elementId="media">
                      <div className="bg-slate-100 dark:bg-slate-800 h-64 flex items-center justify-center overflow-hidden shadow-md" style={mediaStyle}>
                        <div className="text-center p-6">
                          <DynamicIcon name={feat.icon} size={48} className="mx-auto text-slate-400 mb-4 animate-bounce" />
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interactive Media Slot</span>
                        </div>
                      </div>
                    </SelectableElement>
                  </div>
                ))}
              </div>
            ) : (
              // DEFAULT CARD GRID
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {block.features?.map(feat => (
                  <SelectableElement key={feat.id} elementId="card">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="text-left relative overflow-hidden flex flex-col justify-between group h-full" 
                      style={cardStyle}
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                          <DynamicIcon name={feat.icon} size={18} />
                        </div>
                        <h3 className="text-lg font-bold mb-3">{feat.title}</h3>
                        <p className="text-sm opacity-85 leading-relaxed">{feat.desc}</p>
                      </div>
                    </motion.div>
                  </SelectableElement>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: CTA
            ========================================================== */}
        {block.type === 'CTA' && (
          <div className="p-1">
            {block.variant === 'gradient-cta' ? (
              <MovingBorder containerClassName="rounded-3xl" className="p-12 text-center relative overflow-hidden bg-slate-950 border border-slate-900 rounded-3xl">
                <Spotlight />
                <SelectableElement elementId="title">
                  <h2 className="text-3xl font-black mb-4 tracking-tight text-white">{block.title}</h2>
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="mb-8">
                  <p className="text-base text-slate-300 max-w-xl mx-auto">{block.subtitle}</p>
                </SelectableElement>
                {block.btnText && (
                  <SelectableElement elementId="button">
                    <Magnetic>
                      <button className="font-bold hover:shadow-2xl transition" style={buttonStyle}>
                        {block.btnText}
                      </button>
                    </Magnetic>
                  </SelectableElement>
                )}
              </MovingBorder>
            ) : block.variant === 'app-download' ? (
              <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
                <div>
                  <SelectableElement elementId="title">
                    <h2 className="text-3xl font-black mb-4">{block.title}</h2>
                  </SelectableElement>
                  <SelectableElement elementId="subtitle" className="mb-6">
                    <p className="text-slate-300 text-sm">{block.subtitle}</p>
                  </SelectableElement>
                  <div className="flex flex-wrap gap-4">
                    <SelectableElement elementId="button">
                      <button className="px-6 py-3 bg-white text-slate-950 font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition text-xs">
                        <Play size={14} fill="currentColor" /> App Store
                      </button>
                    </SelectableElement>
                    <button className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-700 transition text-xs border border-slate-700">
                      <Globe size={14} /> Google Play
                    </button>
                  </div>
                </div>
                <SelectableElement elementId="media">
                  <div className="aspect-square bg-slate-950/80 flex items-center justify-center p-6 border border-slate-800" style={mediaStyle}>
                    <ShieldCheck size={72} className="text-emerald-500 animate-pulse" />
                  </div>
                </SelectableElement>
              </div>
            ) : (
              <div className="p-10 flex flex-col items-center text-center rounded-2xl border border-slate-200/10" style={cardStyle}>
                <SelectableElement elementId="title">
                  <h2 style={titleStyle} className="mb-4">{block.title}</h2>
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="mb-8">
                  <p className="text-sm max-w-xl mx-auto" style={subtitleStyle}>{block.subtitle}</p>
                </SelectableElement>
                {block.btnText && (
                  <SelectableElement elementId="button">
                    <button className="font-bold cursor-pointer hover:opacity-90 transition text-sm" style={buttonStyle}>
                      {block.btnText}
                    </button>
                  </SelectableElement>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: GALLERY
            ========================================================== */}
        {block.type === 'Gallery' && (
          <div>
            <SelectableElement elementId="title">
              <h2 style={titleStyle}>{block.title}</h2>
            </SelectableElement>
            <SelectableElement elementId="subtitle" className="mb-12">
              <p style={subtitleStyle} className="max-w-2xl mx-auto">{block.subtitle}</p>
            </SelectableElement>
            
            {block.variant === 'marquee-logos' ? (
              <InfiniteMarquee items={defaultLogos} speed="normal" />
            ) : block.variant === 'slider' ? (
              // BEFORE AFTER INTERACTIVE COMPONENT
              <SelectableElement elementId="media">
                <div className="max-w-2xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl aspect-video border border-slate-100/10 bg-slate-900" style={mediaStyle}>
                  <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center text-white font-black z-0">
                    AFTER: Designed with OnlyPage
                  </div>
                  <div 
                    className="absolute inset-y-0 left-0 bg-red-950/80 z-10 overflow-hidden"
                    style={{ width: `${activeBeforeAfter}%` }}
                  >
                    <div className="w-[640px] h-full flex items-center justify-center text-slate-300 font-bold">
                      BEFORE: Unstructured Raw CSS Code
                    </div>
                  </div>
                  {/* Sliders handle */}
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={activeBeforeAfter} 
                    onChange={(e) => setActiveBeforeAfter(Number(e.target.value))}
                    className="absolute inset-x-0 bottom-4 mx-auto w-11/12 z-20 cursor-pointer accent-blue-500"
                  />
                </div>
              </SelectableElement>
            ) : (
              // MASONRY / GRID USING DYNAMIC IMAGES
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(block.galleryImages || [
                  { id: 'slide-1', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', title: 'Marketing Analytics Dashboard', subtitle: 'Advanced UI & Data visualization solutions' },
                  { id: 'slide-2', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600', title: 'Corporate Branding Strategy', subtitle: 'Elevating online presence across modern channels' },
                  { id: 'slide-3', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600', title: 'Interactive SaaS Platforms', subtitle: 'High-performance applications built for hyper-scale' }
                ]).map((imgItem, index) => (
                  <SelectableElement key={imgItem.id || index} elementId="media">
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="relative aspect-square overflow-hidden shadow-md group cursor-pointer bg-slate-900"
                      style={mediaStyle}
                    >
                      <img src={imgItem.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300" alt={imgItem.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition duration-300 flex items-end p-6 text-left">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400">{imgItem.subtitle || 'Design Mockup'}</span>
                          <h4 className="text-sm font-bold text-white mt-1">{imgItem.title || 'High-Fidelity Project Case'}</h4>
                        </div>
                      </div>
                    </motion.div>
                  </SelectableElement>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: BUSINESS
            ========================================================== */}
        {block.type === 'Business' && (
          <div>
            <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
            <p className="mb-12 max-w-2xl mx-auto" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>
            
            {block.variant === 'treatment-list' ? (
              // LUXURY DETAILED LIST
              <div className="max-w-2xl mx-auto space-y-4 text-left">
                {block.features?.map(feat => (
                  <div key={feat.id} className="p-5 flex justify-between items-center border-b border-slate-200/10 hover:bg-slate-500/5 rounded-xl transition duration-300">
                    <div>
                      <h4 className="text-base font-extrabold flex items-center gap-2">
                        <DynamicIcon name={feat.icon || 'CheckCircle2'} size={16} className="text-blue-500" /> {feat.title}
                      </h4>
                      <p className="text-xs opacity-75 mt-1 ml-6">{feat.desc}</p>
                    </div>
                    <span className="text-sm font-black text-blue-500 tracking-wider">RESERVE</span>
                  </div>
                ))}
              </div>
            ) : (
              // ACTIVE OFFERS / FLASH DISCOUNT
              <div className="max-w-xl mx-auto p-8 rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 text-center">
                <span className="bg-red-500 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full tracking-widest">FLASH ACTIVE OFFER</span>
                <h3 className="text-2xl font-black mt-4 text-red-500">30% OFF YOUR FIRST RESERVATION</h3>
                <p className="text-xs opacity-80 my-4">Claim this code to activate a 30% discount automatically applied during clinic or salon consultation reservations.</p>
                <button 
                  onClick={() => setActiveOfferClaimed(true)}
                  className={`px-6 py-3 font-bold text-xs rounded-xl transition-all duration-300 ${
                    activeOfferClaimed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white hover:shadow-lg'
                  }`}
                >
                  {activeOfferClaimed ? '✓ CODE ACTIVATED' : 'CLAIM D50-DISCOUNT CODE'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: PRICING
            ========================================================== */}
        {block.type === 'Pricing' && (
          <div>
            <SelectableElement elementId="title">
              <h2 style={titleStyle}>{block.title}</h2>
            </SelectableElement>
            <SelectableElement elementId="subtitle" className="mb-12">
              <p style={subtitleStyle} className="max-w-2xl mx-auto">{block.subtitle}</p>
            </SelectableElement>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {block.pricing?.map(plan => (
                <SelectableElement key={plan.id} elementId="card" className={plan.popular ? 'md:scale-[1.03] z-10' : ''}>
                  <div 
                    className={`p-8 text-left flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-2xl h-full ${
                      plan.popular ? 'ring-2 ring-blue-500' : ''
                    }`} 
                    style={cardStyle}
                  >
                    {plan.popular && (
                      <span className="absolute top-4 right-4 bg-blue-500 text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                        RECOMMENDED
                      </span>
                    )}
                    <div>
                      <h3 className="text-lg font-extrabold mb-1">{plan.tier}</h3>
                      <p className="text-3xl font-black mb-6" style={{ color: styles.accentColor }}>{plan.price}</p>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f, i) => (
                          <li key={i} className="text-xs flex items-center gap-2 opacity-90">
                            <Check size={14} className="text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="w-full py-3 font-bold text-xs cursor-pointer transition-all duration-300" style={{ backgroundColor: plan.popular ? styles.accentColor : 'transparent', color: plan.popular ? '#ffffff' : styles.accentColor, border: `1.5px solid ${styles.accentColor}`, borderRadius: `${styles.buttonBorderRadius}px` }}>
                      {plan.btnText}
                    </button>
                  </div>
                </SelectableElement>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================
            CATEGORY: TESTIMONIALS
            ========================================================== */}
        {block.type === 'Testimonials' && (
          <div>
            <SelectableElement elementId="title">
              <h2 style={titleStyle}>{block.title}</h2>
            </SelectableElement>
            <SelectableElement elementId="subtitle" className="mb-12">
              <p style={subtitleStyle} className="max-w-2xl mx-auto">{block.subtitle}</p>
            </SelectableElement>
            
            {block.variant === 'wall-of-love' ? (
              // WALL OF LOVE GRID
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
                {block.testimonials?.map(test => (
                  <SelectableElement key={test.id} elementId="card">
                    <div className="rounded-2xl flex flex-col justify-between h-full" style={cardStyle}>
                      <div>
                        <div className="flex gap-1 mb-4 text-amber-500">
                          {Array.from({ length: test.rating }).map((_, rIdx) => <Star key={rIdx} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-xs leading-relaxed italic opacity-90 font-medium">"{test.content}"</p>
                      </div>
                      <div className="flex items-center gap-3 mt-6">
                        <img src={test.avatar} className="w-8 h-8 rounded-full object-cover shrink-0" alt="Avatar" />
                        <div>
                          <h4 className="text-xs font-black">{test.name}</h4>
                          <p className="text-[10px] text-slate-400">{test.role}</p>
                        </div>
                      </div>
                    </div>
                  </SelectableElement>
                ))}
              </div>
            ) : (
              // CLASSIC CAROUSEL STYLE TILES
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {block.testimonials?.map(test => (
                  <SelectableElement key={test.id} elementId="card">
                    <div className="rounded-2xl flex flex-col justify-between h-full border border-slate-100/10" style={cardStyle}>
                      <div>
                        <div className="flex gap-1 mb-4 text-amber-500">
                          {Array.from({ length: test.rating }).map((_, rIdx) => <Star key={rIdx} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-sm italic leading-relaxed opacity-90">"{test.content}"</p>
                      </div>
                      <div className="flex items-center gap-3 mt-8">
                        <img src={test.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" alt="Avatar" />
                        <div>
                          <h4 className="text-xs font-black">{test.name}</h4>
                          <p className="text-[10px] text-slate-400">{test.role}</p>
                        </div>
                      </div>
                    </div>
                  </SelectableElement>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: FORMS / CONTACT
            ========================================================== */}
        {block.type === 'Contact' && (
          <div>
            <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
            <p className="mb-12 max-w-2xl mx-auto" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>
            
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-md mx-auto p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
                >
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-xl font-bold text-emerald-400">Request Received Successfully!</h3>
                  <p className="text-xs text-slate-400 mt-2">Our coordinators will reach out using the provided credentials shortly.</p>
                  <button onClick={() => setFormSubmitted(false)} className="mt-6 text-xs text-blue-500 font-extrabold hover:underline">
                    Submit Another Query
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                  {/* Styled Input card */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormSubmitted(true);
                    }}
                    className="p-8 flex flex-col gap-4"
                    style={{ backgroundColor: styles.cardBgColor, borderRadius: `${styles.cardBorderRadius}px` }}
                  >
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1.5">FULL NAME</label>
                      <input required type="text" placeholder="Kabir Mehta" className="w-full bg-slate-500/10 border border-slate-500/20 p-3 text-xs rounded-xl focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1.5">EMAIL ADDRESS</label>
                      <input required type="email" placeholder="kabir@designco.com" className="w-full bg-slate-500/10 border border-slate-500/20 p-3 text-xs rounded-xl focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1.5">MESSAGE QUERY</label>
                      <textarea required placeholder="Outline your project goals..." className="w-full bg-slate-500/10 border border-slate-500/20 p-3 text-xs rounded-xl focus:ring-1 focus:ring-blue-500 outline-none" rows={4} />
                    </div>
                    <button type="submit" className="w-full py-4 font-bold text-xs cursor-pointer hover:opacity-95 transition" style={{ backgroundColor: styles.buttonBgColor, color: styles.buttonTextColor, borderRadius: `${styles.buttonBorderRadius}px` }}>
                      {block.btnText || 'Submit Request'}
                    </button>
                  </form>

                  {/* Informational Panel */}
                  <div className="flex flex-col justify-between py-4">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold">Contact Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <Mail size={14} />
                          </div>
                          <span>{block.contactEmail || 'hello@onlypage.in'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <Phone size={14} />
                          </div>
                          <span>{block.contactPhone || '+91 98765 43210'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <MapPin size={14} />
                          </div>
                          <span>{block.contactAddress || 'Bengaluru, India'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-slate-500/5 rounded-2xl border border-slate-200/10">
                      <h4 className="text-xs font-bold mb-1">Response Guarantee</h4>
                      <p className="text-[10px] text-slate-400">All submissions are monitored by real account handlers. Standard response times are within 15 minutes flat.</p>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ==========================================================
            CATEGORY: FORMS (Lead/Newsletter/Appointments)
            ========================================================== */}
        {block.type === 'Forms' && (
          <div>
            <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
            <p className="mb-12 max-w-2xl mx-auto" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>

            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
                >
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-emerald-400">Action Confirmed Successfully!</h3>
                  <p className="text-xs text-slate-400 mt-2">The request data was processed and recorded securely into the local JSON cache.</p>
                  <button onClick={() => setFormSubmitted(false)} className="mt-6 text-xs text-blue-500 font-extrabold hover:underline">
                    Reset Form
                  </button>
                </motion.div>
              ) : (
                <div className="max-w-md mx-auto">
                  {block.variant === 'newsletter' ? (
                    // NEWSLETTER BAR
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setFormSubmitted(true);
                      }}
                      className="p-1 flex items-center gap-2 bg-slate-500/5 border border-slate-500/20 rounded-2xl w-full"
                    >
                      <input required type="email" placeholder="kabir@designco.com" className="flex-1 bg-transparent px-4 py-3 text-xs outline-none text-white placeholder-slate-500" />
                      <button type="submit" className="px-6 py-3 font-bold text-xs whitespace-nowrap cursor-pointer transition" style={{ backgroundColor: styles.buttonBgColor, color: styles.buttonTextColor, borderRadius: `${styles.buttonBorderRadius}px` }}>
                        {block.btnText || 'Join List'}
                      </button>
                    </form>
                  ) : (
                    // APPOINTMENT BOOKER
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setFormSubmitted(true);
                      }}
                      className="p-8 text-left space-y-4"
                      style={{ backgroundColor: styles.cardBgColor, borderRadius: `${styles.cardBorderRadius}px` }}
                    >
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1.5">FULL NAME</label>
                        <input required type="text" placeholder="Dr. Sonal" className="w-full bg-slate-500/10 border border-slate-500/20 p-3 text-xs rounded-xl focus:ring-1 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1.5">DATE</label>
                          <input required type="date" className="w-full bg-slate-500/10 border border-slate-500/20 p-3 text-xs rounded-xl focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 block mb-1.5">TIME</label>
                          <input required type="time" className="w-full bg-slate-500/10 border border-slate-500/20 p-3 text-xs rounded-xl focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-4 mt-4 font-bold text-xs cursor-pointer" style={{ backgroundColor: styles.buttonBgColor, color: styles.buttonTextColor, borderRadius: `${styles.buttonBorderRadius}px` }}>
                        {block.btnText || 'Schedule Session'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ==========================================================
            CATEGORY: NAVIGATION (21 VARIANTS)
            ========================================================== */}
        {block.type === 'Navigation' && (
          <div className="w-full relative select-none" style={{ fontFamily: getFontFamilyStyle(styles.fontFamily) }}>
            {/* nav-minimal */}
            {block.variant === 'nav-minimal' && (
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: styles.cardBgColor, border: `1px solid ${styles.cardBorderColor || 'rgba(255,255,255,0.05)'}`, borderRadius: `${styles.cardBorderRadius}px` }}>
                <SelectableElement elementId="title">
                  {block.imageUrl ? (
                    <img src={block.imageUrl} className="h-6 max-w-[200px] object-contain" alt="Brand Logo" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="font-black text-sm uppercase tracking-widest" style={{ color: styles.accentColor }}>{block.title || 'OnlyPage'}</span>
                  )}
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="hidden md:flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="hover:text-white cursor-pointer transition">Services</span>
                  <span className="hover:text-white cursor-pointer transition">Features</span>
                  <span className="hover:text-white cursor-pointer transition">Templates</span>
                  <span className="hover:text-white cursor-pointer transition">Pricing</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="font-extrabold cursor-pointer transition" style={{ ...buttonStyle, padding: '8px 16px', fontSize: '10px' }}>{block.btnText || 'Sign In'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-glass */}
            {block.variant === 'nav-glass' && (
              <div className="flex items-center justify-between p-3 px-6 backdrop-blur-xl bg-slate-900/40 border border-slate-100/10 shadow-2xl rounded-full">
                <SelectableElement elementId="title" className="flex items-center gap-1.5">
                  {block.imageUrl ? (
                    <img src={block.imageUrl} className="h-5 max-w-[150px] object-contain" alt="Brand Logo" referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[10px] text-blue-400 font-bold">O</span>
                      <span className="font-black text-xs tracking-tight text-white">{block.title || 'Glass.io'}</span>
                    </>
                  )}
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
                  <span className="hover:text-blue-400 cursor-pointer transition">Platform</span>
                  <span className="hover:text-blue-400 cursor-pointer transition">Pricing</span>
                  <span className="hover:text-blue-400 cursor-pointer transition">Company</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="px-4 py-1.5 bg-white text-slate-950 font-bold rounded-full text-[10px] hover:bg-slate-100 transition shadow">{block.btnText || 'Launch Console'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-centered-logo */}
            {block.variant === 'nav-centered-logo' && (
              <div className="grid grid-cols-3 items-center p-4" style={{ backgroundColor: styles.cardBgColor, borderBottom: `1.5px solid ${styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
                <SelectableElement elementId="subtitle" className="flex gap-4 text-xs font-semibold text-slate-400">
                  <span className="hover:text-white cursor-pointer">Product</span>
                  <span className="hover:text-white cursor-pointer">Blog</span>
                </SelectableElement>
                <SelectableElement elementId="title" className="text-center">
                  <span className="font-black text-sm tracking-widest uppercase border-b-2 border-blue-500 pb-0.5" style={{ color: styles.textColor }}>{block.title || 'BrandCentred'}</span>
                </SelectableElement>
                <div className="flex justify-end">
                  <SelectableElement elementId="button">
                    <button className="text-xs font-bold hover:underline" style={{ color: styles.accentColor }}>{block.btnText || 'Join Today'}</button>
                  </SelectableElement>
                </div>
              </div>
            )}

            {/* nav-sidebar-toggle */}
            {block.variant === 'nav-sidebar-toggle' && (
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: styles.cardBgColor }}>
                <SelectableElement elementId="title">
                  <span className="font-extrabold text-sm" style={{ color: styles.textColor }}>{block.title || 'Minimalist'}</span>
                </SelectableElement>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold tracking-widest text-slate-500">SYSTEM DECK ACTIVE</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-slate-700 transition">
                    <span className="w-4 h-0.5 bg-white" />
                    <span className="w-4 h-0.5 bg-white" />
                    <span className="w-4 h-0.5 bg-white" />
                  </div>
                </div>
              </div>
            )}

            {/* nav-mega-menu */}
            {block.variant === 'nav-mega-menu' && (
              <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <SelectableElement elementId="title">
                  <span className="font-black text-sm text-white">{block.title || 'ApexSaaS'}</span>
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-bold">
                  <div className="group/mega relative py-2 cursor-pointer hover:text-white flex items-center gap-1">
                    <span>Products</span> <ChevronDown size={12} />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/mega:opacity-100 group-hover/mega:translate-y-0 group-hover/mega:pointer-events-auto transition-all duration-300 z-50 text-left grid grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-extrabold text-[9px] text-blue-500 tracking-wider">ENGINE</h5>
                        <p className="text-[9px] text-slate-400 mt-1">Real-time DB synchronization.</p>
                      </div>
                      <div>
                        <h5 className="font-extrabold text-[9px] text-emerald-500 tracking-wider">DEPLOY</h5>
                        <p className="text-[9px] text-slate-400 mt-1">Instant serverless CDN endpoints.</p>
                      </div>
                    </div>
                  </div>
                  <span className="hover:text-white cursor-pointer transition">Pricing</span>
                  <span className="hover:text-white cursor-pointer transition">Docs</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="font-extrabold text-xs px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition">{block.btnText || 'Start Free Trial'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-search-bar */}
            {block.variant === 'nav-search-bar' && (
              <div className="flex items-center justify-between p-3.5 gap-4" style={{ backgroundColor: styles.cardBgColor, borderBottom: `1px solid ${styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
                <SelectableElement elementId="title">
                  <span className="font-black text-sm" style={{ color: styles.textColor }}>{block.title || 'Lookup'}</span>
                </SelectableElement>
                <div className="flex-1 max-w-sm hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <Search size={14} className="text-slate-500" />
                  <input disabled type="text" placeholder="Search templates, components or CSS..." className="bg-transparent text-[11px] outline-none text-slate-300 w-full" />
                </div>
                <SelectableElement elementId="button">
                  <button className="px-4 py-1.5 text-xs font-bold rounded bg-slate-800 text-white hover:bg-slate-700 transition">{block.btnText || 'Console'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-social-icons */}
            {block.variant === 'nav-social-icons' && (
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: styles.cardBgColor }}>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 hover:text-white cursor-pointer">𝕏</div>
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 hover:text-white cursor-pointer">📸</div>
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-400 hover:text-white cursor-pointer">🐙</div>
                </div>
                <SelectableElement elementId="title">
                  <span className="font-extrabold text-xs uppercase tracking-widest text-slate-500">{block.title || 'SOCIAL.CORP'}</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="px-3 py-1.5 border border-slate-700 rounded-md font-bold text-[10px] text-slate-300 hover:text-white transition">{block.btnText || 'Contact Us'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-double-header */}
            {block.variant === 'nav-double-header' && (
              <div className="w-full flex flex-col border-b border-slate-800">
                <div className="bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase p-1.5 text-center flex items-center justify-center gap-1">
                  <span>🚀 NEW VERSION 2.5 BRUTALIST DESIGN KITS ARE LIVE</span>
                  <span className="underline hover:opacity-85 cursor-pointer ml-1">EXPLORE BUNDLES {"→"}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950">
                  <SelectableElement elementId="title">
                    <span className="font-extrabold text-sm">{block.title || 'DoubleDeck'}</span>
                  </SelectableElement>
                  <SelectableElement elementId="subtitle" className="flex items-center gap-5 text-xs text-slate-400">
                    <span className="hover:text-white cursor-pointer">Enterprise</span>
                    <span className="hover:text-white cursor-pointer">Pricing</span>
                    <span className="hover:text-white cursor-pointer">Blueprint</span>
                  </SelectableElement>
                </div>
              </div>
            )}

            {/* nav-retro-mono */}
            {block.variant === 'nav-retro-mono' && (
              <div className="flex items-center justify-between p-3 border-4 border-black bg-white text-black font-mono">
                <SelectableElement elementId="title">
                  <span className="font-black text-sm uppercase tracking-tight">[ {block.title || 'BRUTAL_MONO'} ]</span>
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="hidden md:flex items-center gap-4 text-xs font-bold uppercase">
                  <span className="hover:underline cursor-pointer">_GRID</span>
                  <span className="hover:underline cursor-pointer">_CORE</span>
                  <span className="hover:underline cursor-pointer">_STAT</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="px-4 py-2 border-2 border-black font-bold text-xs bg-[#ffff00] active:translate-y-0.5 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{block.btnText || 'GO_LIVE'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-pill-shaped */}
            {block.variant === 'nav-pill-shaped' && (
              <div className="max-w-md mx-auto p-2 bg-slate-950/80 border border-slate-800 rounded-full shadow-2xl flex items-center justify-between px-4">
                <SelectableElement elementId="title">
                  <span className="font-bold text-[10px] tracking-widest text-slate-300 uppercase">{block.title || 'Capsule'}</span>
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="flex gap-3 text-[10px] text-slate-400 font-semibold">
                  <span className="hover:text-white cursor-pointer">Home</span>
                  <span className="hover:text-white cursor-pointer">Works</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="bg-white text-slate-950 rounded-full font-black text-[9px] px-3 py-1 hover:opacity-95">{block.btnText || 'Ping'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-blur-reveal */}
            {block.variant === 'nav-blur-reveal' && (
              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-500/10 bg-slate-950/80 shadow-[0_0_25px_-5px_rgba(59,130,246,0.15)]">
                <SelectableElement elementId="title">
                  <span className="font-extrabold text-sm flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                    <span>{block.title || 'NovaGlow'}</span>
                  </span>
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="hidden md:flex items-center gap-5 text-xs text-slate-300">
                  <span className="hover:text-blue-400 cursor-pointer transition">Solutions</span>
                  <span className="hover:text-blue-400 cursor-pointer transition">Pricing</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="px-4 py-2 bg-slate-900 border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 font-bold text-xs rounded-lg transition">{block.btnText || 'Enter Space'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-with-avatar */}
            {block.variant === 'nav-with-avatar' && (
              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <SelectableElement elementId="title">
                  <span className="font-black text-sm tracking-tight text-white">{block.title || 'OnlyAdmin'}</span>
                </SelectableElement>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">DEV MODE</span>
                  <div className="h-4 w-px bg-slate-800" />
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full border border-slate-700 object-cover" alt="User" />
                </div>
              </div>
            )}

            {/* nav-dark-neon */}
            {block.variant === 'nav-dark-neon' && (
              <div className="flex items-center justify-between p-4 bg-slate-950 border border-violet-500/20 shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)] rounded-xl">
                <SelectableElement elementId="title">
                  <span className="font-black text-xs tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase">{block.title || 'Cosmos'}</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-extrabold text-xs rounded-lg transition shadow-[0_0_15px_rgba(139,92,246,0.4)]">{block.btnText || 'Sync Cosmos'}</button>
                </SelectableElement>
              </div>
            )}

            {/* nav-badge-alert */}
            {block.variant === 'nav-badge-alert' && (
              <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <SelectableElement elementId="title">
                  <span className="font-black text-sm text-slate-200">{block.title || 'Storefront'}</span>
                </SelectableElement>
                <div className="flex items-center gap-3">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest animate-pulse">HOT SALE</span>
                  <SelectableElement elementId="button">
                    <button className="px-3.5 py-1.5 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-500 transition">{block.btnText || 'Buy Now'}</button>
                  </SelectableElement>
                </div>
              </div>
            )}

            {/* nav-burger-only */}
            {block.variant === 'nav-burger-only' && (
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: styles.cardBgColor }}>
                <SelectableElement elementId="title">
                  <span className="font-extrabold text-xs tracking-wider opacity-70 uppercase">{block.title || 'MenuOnly'}</span>
                </SelectableElement>
                <div className="flex flex-col gap-1 w-6 cursor-pointer group">
                  <span className="h-0.5 w-full bg-slate-300 group-hover:bg-blue-500 transition-all duration-300" />
                  <span className="h-0.5 w-full bg-slate-300 group-hover:bg-blue-500 transition-all duration-300" />
                  <span className="h-0.5 w-full bg-slate-300 group-hover:bg-blue-500 transition-all duration-300" />
                </div>
              </div>
            )}

            {/* nav-with-phone */}
            {block.variant === 'nav-with-phone' && (
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: styles.cardBgColor, borderBottom: `1.5px solid ${styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
                <SelectableElement elementId="title">
                  <span className="font-black text-sm">{block.title || 'CallClinic'}</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition">
                    <Phone size={12} fill="currentColor" /> {block.btnText || '+91 98840 12003'}
                  </button>
                </SelectableElement>
              </div>
            )}

            {/* nav-gradient-border */}
            {block.variant === 'nav-gradient-border' && (
              <div className="w-full relative flex flex-col">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />
                <div className="flex items-center justify-between p-4 bg-slate-950">
                  <SelectableElement elementId="title">
                    <span className="font-extrabold text-sm">{block.title || 'BorderGlow'}</span>
                  </SelectableElement>
                  <SelectableElement elementId="subtitle" className="flex gap-4 text-xs font-bold text-slate-300">
                    <span className="border-b-2 border-blue-500 pb-0.5">Explore</span>
                    <span className="hover:text-blue-500 cursor-pointer">Solutions</span>
                  </SelectableElement>
                </div>
              </div>
            )}

            {/* nav-language-picker */}
            {block.variant === 'nav-language-picker' && (
              <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <SelectableElement elementId="title">
                  <span className="font-black text-sm">{block.title || 'GlobalHQ'}</span>
                </SelectableElement>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                  <Globe size={12} className="text-slate-400" />
                  <select className="bg-transparent text-[10px] text-slate-300 font-extrabold outline-none cursor-pointer">
                    <option value="en">ENGLISH (US)</option>
                    <option value="hi">HINDI (IN)</option>
                    <option value="ka">KANNADA (KA)</option>
                  </select>
                </div>
              </div>
            )}

            {/* nav-ecommerce-cart */}
            {block.variant === 'nav-ecommerce-cart' && (
              <div className="flex items-center justify-between p-4" style={{ backgroundColor: styles.cardBgColor }}>
                <SelectableElement elementId="title">
                  <span className="font-black text-sm">{block.title || 'ShopKart'}</span>
                </SelectableElement>
                <div className="flex items-center gap-4">
                  <div className="relative cursor-pointer">
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                      3
                    </div>
                    <span className="text-lg">🛒</span>
                  </div>
                  <SelectableElement elementId="button">
                    <button className="px-3.5 py-1.5 bg-slate-800 text-white font-extrabold text-[11px] rounded">{block.btnText || 'Checkout'}</button>
                  </SelectableElement>
                </div>
              </div>
            )}

            {/* nav-command-k */}
            {block.variant === 'nav-command-k' && (
              <div className="flex items-center justify-between p-3 px-5 bg-slate-950 border border-slate-800 rounded-2xl max-w-xl mx-auto">
                <SelectableElement elementId="title">
                  <span className="font-bold text-xs tracking-wider uppercase text-blue-500">{block.title || 'OnlySearch'}</span>
                </SelectableElement>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md font-mono">
                  <span>Press</span>
                  <span className="bg-slate-950 border border-slate-700 px-1 rounded text-slate-300">Cmd</span>
                  <span>+</span>
                  <span className="bg-slate-950 border border-slate-700 px-1.5 rounded text-slate-300">K</span>
                  <span>to query...</span>
                </div>
              </div>
            )}

            {/* nav-glowing-glow */}
            {block.variant === 'nav-glowing-glow' && (
              <div className="flex items-center justify-between p-4 bg-slate-950 border-b-2 border-cyan-500/40 shadow-[0_4px_30px_rgba(6,182,212,0.1)]">
                <SelectableElement elementId="title">
                  <span className="font-mono text-xs font-black tracking-widest text-cyan-400 uppercase">{block.title || 'CYBER.NET'}</span>
                </SelectableElement>
                <SelectableElement elementId="button">
                  <button className="px-4 py-2 bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold text-xs rounded transition uppercase tracking-widest font-mono">{block.btnText || 'CONNECT_DECK'}</button>
                </SelectableElement>
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: FOOTER (21 VARIANTS)
            ========================================================== */}
        {block.type === 'Footer' && (
          <div className="w-full relative select-none" style={{ fontFamily: getFontFamilyStyle(styles.fontFamily) }}>
            {/* footer-classic */}
            {block.variant === 'footer-classic' && (
              <div className="p-8 text-left space-y-12 bg-slate-950 border border-slate-800 rounded-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-4 col-span-2 md:col-span-1">
                    <SelectableElement elementId="title">
                      <h4 className="font-black text-base text-white">{block.title || 'OnlyPage'}</h4>
                    </SelectableElement>
                    <SelectableElement elementId="subtitle">
                      <p className="text-[11px] text-slate-400 leading-relaxed">{block.subtitle || 'Build elegant websites, schedule reservation calendars and gather customer feedback easily.'}</p>
                    </SelectableElement>
                  </div>
                  {['Products', 'Solutions', 'Legal'].map((col, cIdx) => (
                    <div key={cIdx} className="space-y-3">
                      <h5 className="font-extrabold text-[10px] text-slate-200 uppercase tracking-widest">{col}</h5>
                      <ul className="space-y-1.5 text-[11px] text-slate-400 font-semibold">
                        <li className="hover:text-blue-400 cursor-pointer">Feature Links</li>
                        <li className="hover:text-blue-400 cursor-pointer">Pricing Matrix</li>
                        <li className="hover:text-blue-400 cursor-pointer">Support Desk</li>
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>© {new Date().getFullYear()} ONLYPAGE IN. ALL RIGHTS RESERVED.</span>
                  <div className="flex gap-4 mt-3 md:mt-0">
                    <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
                    <span className="hover:text-slate-300 cursor-pointer">Terms</span>
                  </div>
                </div>
              </div>
            )}

            {/* footer-minimal */}
            {block.variant === 'footer-minimal' && (
              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: styles.cardBgColor, borderTop: `1px solid ${styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
                <SelectableElement elementId="title">
                  <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">{block.title || 'MINIMAL.FOOT'}</span>
                </SelectableElement>
                <SelectableElement elementId="subtitle">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">© {new Date().getFullYear()} REVOLUTIONARY CODEBASE</span>
                </SelectableElement>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">𝕏</div>
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">🐙</div>
                </div>
              </div>
            )}

            {/* footer-brand-huge */}
            {block.variant === 'footer-brand-huge' && (
              <div className="p-10 text-left bg-slate-950 border border-slate-900 rounded-3xl space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {['Modules', 'Sitemap', 'Company'].map((col, cIdx) => (
                    <div key={cIdx} className="space-y-3">
                      <h5 className="font-extrabold text-[10px] text-blue-500 tracking-wider uppercase">{col}</h5>
                      <ul className="space-y-1 text-xs text-slate-400">
                        <li className="hover:text-white cursor-pointer">Lego Sandbox</li>
                        <li className="hover:text-white cursor-pointer">Theme Customization</li>
                        <li className="hover:text-white cursor-pointer">Figma Exporters</li>
                      </ul>
                    </div>
                  ))}
                </div>
                <SelectableElement elementId="title">
                  <h1 className="text-7xl font-black text-slate-800 tracking-tight leading-none mt-8 select-none hover:text-blue-500/20 transition duration-300">{block.title || 'ONLYPAGE'}</h1>
                </SelectableElement>
              </div>
            )}

            {/* footer-retro-wire */}
            {block.variant === 'footer-retro-wire' && (
              <div className="border-4 border-black p-6 bg-white text-black text-left font-mono space-y-6">
                <SelectableElement elementId="title">
                  <h4 className="font-black text-base uppercase">_INDEX: {block.title || 'RETRO_WIRE'}</h4>
                </SelectableElement>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase">
                  <div>
                    <h5 className="border-b-2 border-black pb-1">_SYSTEMS</h5>
                    <ul className="mt-2 space-y-1">
                      <li>{"•"} CDN_STARTER</li>
                      <li>{"•"} EXPORT_WIDGET</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="border-b-2 border-black pb-1">_REPORTS</h5>
                    <ul className="mt-2 space-y-1">
                      <li>{"•"} STATUS_OK</li>
                      <li>{"•"} TELEMETRY_OFF</li>
                    </ul>
                  </div>
                </div>
                <div className="text-[10px] font-black border-t-2 border-black pt-4">
                  © {new Date().getFullYear()} WIREFRAME STACKS INC
                </div>
              </div>
            )}

            {/* footer-newsletter-focus */}
            {block.variant === 'footer-newsletter-focus' && (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
                <SelectableElement elementId="title">
                  <h3 className="text-lg font-black text-white">{block.title || 'Stay Ahead of the Curve'}</h3>
                </SelectableElement>
                <SelectableElement elementId="subtitle" className="max-w-md mx-auto">
                  <p className="text-xs text-slate-400">{block.subtitle || 'Subscribe to receive clean HTML/CSS snippets, system updates and template drops.'}</p>
                </SelectableElement>
                <div className="max-w-sm mx-auto flex gap-2">
                  <input required disabled type="email" placeholder="enter email..." className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 outline-none" />
                  <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition uppercase tracking-wider">Join</button>
                </div>
              </div>
            )}

            {/* footer-social-wall */}
            {block.variant === 'footer-social-wall' && (
              <div className="p-6 text-left space-y-6" style={{ backgroundColor: styles.cardBgColor }}>
                <h5 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500">DYNAMIC SOCIAL MEDIA WIRE</h5>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=120',
                    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=120',
                    'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=120',
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=120'
                  ].map((url, uIdx) => (
                    <div key={uIdx} className="aspect-square bg-slate-900 overflow-hidden rounded-lg border border-slate-800">
                      <img src={url} className="w-full h-full object-cover hover:scale-110 transition duration-300" alt="mock social" />
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-slate-500 text-center font-bold">FOLLOW @ONLYPAGE_IN FOR HOURLY INSPIRATIONS</p>
              </div>
            )}

            {/* footer-compact-badge */}
            {block.variant === 'footer-compact-badge' && (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="font-extrabold text-xs text-white">{block.title || 'OnlyPage secured'}</span>
                  <p className="text-[9px] text-slate-500 mt-1">© {new Date().getFullYear()} Encrypted endpoints routing standard.</p>
                </div>
                <div className="flex gap-3">
                  <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] text-emerald-500 font-extrabold tracking-widest flex items-center gap-1">🔒 SSL ENCRYPTED</span>
                  <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] text-blue-500 font-extrabold tracking-widest flex items-center gap-1">💳 STRIPE DIRECT</span>
                </div>
              </div>
            )}

            {/* footer-three-col-cta */}
            {block.variant === 'footer-three-col-cta' && (
              <div className="w-full space-y-8 text-left">
                <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-sm text-white">Create your professional visual space.</h4>
                    <p className="text-[10px] text-slate-300 mt-0.5">Publish your custom domain live in exactly 2 minutes flat.</p>
                  </div>
                  <SelectableElement elementId="button">
                    <button className="px-4 py-2 bg-white text-slate-950 font-bold text-xs rounded-lg shadow-xl">{block.btnText || 'Launch Now'}</button>
                  </SelectableElement>
                </div>
                <div className="grid grid-cols-3 gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-extrabold border-t border-slate-800 pt-6">
                  <span>© ONLYPAGE IN</span>
                  <span className="text-center">SECURED NETWORKS</span>
                  <span className="text-right">BENGALURU HEADQUARTERS</span>
                </div>
              </div>
            )}

            {/* footer-dark-cosmos */}
            {block.variant === 'footer-dark-cosmos' && (
              <div className="p-8 text-center bg-slate-950 relative overflow-hidden rounded-2xl border border-violet-500/15 shadow-[0_-10px_40px_rgba(139,92,246,0.1)]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                <SelectableElement elementId="title">
                  <h4 className="font-black text-base text-violet-400 uppercase tracking-wider mb-2">{block.title || 'Cosmic Deck'}</h4>
                </SelectableElement>
                <SelectableElement elementId="subtitle">
                  <p className="text-[10px] text-slate-400 max-w-sm mx-auto mb-6">Designed with precision for developers, designers, and visual layout architects.</p>
                </SelectableElement>
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent w-full my-4" />
                <span className="text-[9px] font-mono text-slate-500">LAUNCHING ORBITS AT COLD SPEEDS DECK V2.5</span>
              </div>
            )}

            {/* footer-accordion */}
            {block.variant === 'footer-accordion' && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-left">
                {['01. MODULE CAPABILITIES', '02. DOCUMENTATION REPO', '03. LEGAL COMPLIANCE'].map((hdr, hIdx) => (
                  <div key={hIdx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center cursor-pointer hover:border-slate-700">
                    <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">{hdr}</span>
                    <ChevronDown size={14} className="text-slate-500" />
                  </div>
                ))}
              </div>
            )}

            {/* footer-split-legal */}
            {block.variant === 'footer-split-legal' && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex gap-4">
                  <span className="hover:text-white cursor-pointer">Privacy Charter</span>
                  <span className="hover:text-white cursor-pointer">Cookie Settings</span>
                  <span className="hover:text-white cursor-pointer">TOS</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-slate-300 font-mono">ALL SYSTEMS EXECUTING GREEN (100%)</span>
                </div>
              </div>
            )}

            {/* footer-with-map */}
            {block.variant === 'footer-with-map' && (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="aspect-video bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <span className="text-3xl">📍</span>
                  <span className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded text-[9px] font-mono text-slate-300">Bengaluru Workspace, India</span>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <SelectableElement elementId="title">
                      <h4 className="font-extrabold text-sm text-white">{block.title || 'Location Headquarters'}</h4>
                    </SelectableElement>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Visit our workspace salon or development hub to grab custom visual mockups or consultation packages.</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-4">24/7 RESERVATIONS CORES ACTIVE</span>
                </div>
              </div>
            )}

            {/* footer-bento-footer */}
            {block.variant === 'footer-bento-footer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl md:col-span-2 space-y-2">
                  <SelectableElement elementId="title">
                    <h4 className="font-black text-sm text-white">{block.title || 'OnlyPage Builder'}</h4>
                  </SelectableElement>
                  <p className="text-[11px] text-slate-400">Stack lego layout pieces, custom style details with CSS values and publish instantly.</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-xl flex flex-col justify-between">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">WIDGET</span>
                  <SelectableElement elementId="button">
                    <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded font-bold text-[10px] mt-4 shadow">{block.btnText || 'Launch Platform'}</button>
                  </SelectableElement>
                </div>
              </div>
            )}

            {/* footer-multilingual */}
            {block.variant === 'footer-multilingual' && (
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-slate-400">© {new Date().getFullYear()} INTERNATIONAL INCORPORATION</span>
                <div className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] font-bold text-slate-300">
                  🌐 LOCALE SELECT: <span className="text-blue-400 underline cursor-pointer">ENGLISH (US)</span>
                </div>
              </div>
            )}

            {/* footer-quick-booking */}
            {block.variant === 'footer-quick-booking' && (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-4">
                <SelectableElement elementId="title">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">{block.title || 'Instant Schedule Footer'}</h4>
                </SelectableElement>
                <div className="flex gap-2 max-w-sm">
                  <input required disabled type="date" className="bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none" />
                  <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded">Lock Seat</button>
                </div>
                <p className="text-[9px] text-slate-500 font-bold">RESERVATIONS LOCK SECURELY INTO SYSTEM ACCORDIONS</p>
              </div>
            )}

            {/* footer-trustpilot-rating */}
            {block.variant === 'footer-trustpilot-rating' && (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div>
                  <h5 className="font-black text-xs text-white">Rated Excellent on Trust Networks</h5>
                  <div className="flex gap-1 mt-1 text-emerald-500 text-xs">
                    {Array.from({ length: 5 }).map((_, rIdx) => <span key={rIdx}>★</span>)}
                    <span className="text-slate-400 ml-1 text-[10px] font-bold">4.9 / 5.0 SCORE</span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono tracking-widest font-black uppercase">TRUSTED BY 12,500+ SOLOPRENEURS</span>
              </div>
            )}

            {/* footer-with-backtotop */}
            {block.variant === 'footer-with-backtotop' && (
              <div className="p-4 flex items-center justify-between" style={{ backgroundColor: styles.cardBgColor, borderTop: `1px solid ${styles.cardBorderColor || 'rgba(255,255,255,0.05)'}` }}>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">© {new Date().getFullYear()} ONLYPAGE AUTO-ANCHORS</span>
                <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 hover:text-white transition">
                  ▲
                </button>
              </div>
            )}

            {/* footer-gradient-glow */}
            {block.variant === 'footer-gradient-glow' && (
              <div className="w-full space-y-4">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full" />
                <div className="p-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>© SYSTEM_CORE // 2026</span>
                  <span className="text-cyan-400 tracking-widest font-bold">HORIZON EDGE DETECTED</span>
                </div>
              </div>
            )}

            {/* footer-jobs-hiring */}
            {block.variant === 'footer-jobs-hiring' && (
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-extrabold text-white">We are actively hiring remote UX designers!</span>
                </div>
                <span className="text-[10px] text-blue-500 font-black underline cursor-pointer">VIEW OPENINGS {"→"}</span>
              </div>
            )}

            {/* footer-social-pill */}
            {block.variant === 'footer-social-pill' && (
              <div className="p-6 text-center space-y-4 bg-slate-950 border border-slate-900 rounded-3xl">
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black rounded-full cursor-pointer hover:bg-blue-500/20">𝕏 TWITTER</span>
                  <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-black rounded-full cursor-pointer hover:bg-pink-500/20">📸 INSTAGRAM</span>
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black rounded-full cursor-pointer hover:bg-indigo-500/20">💬 DISCORD</span>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">© {new Date().getFullYear()} STACKED CAPSULE SHARING PLATFORMS</p>
              </div>
            )}

            {/* footer-copyright-only */}
            {block.variant === 'footer-copyright-only' && (
              <div className="p-3 border-t border-slate-800/40 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                © {new Date().getFullYear()} {block.title || 'OnlyPage'}. All rights reserved under local visual licensing.
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            CATEGORY: SPECIAL (FAQ/Steps/Stats)
            ========================================================== */}
        {block.type === 'Special' && (
          <div>
            <h2 style={{ fontSize: `${styles.titleSize}px`, fontWeight: 'bold' }}>{block.title}</h2>
            <p className="mb-12 max-w-2xl mx-auto" style={{ color: styles.subtitleColor, fontSize: `${styles.subtitleSize}px` }}>{block.subtitle}</p>

            {block.variant === 'faq-accordions' ? (
              // FAQ ACCORDIONS
              <div className="max-w-2xl mx-auto space-y-4 text-left">
                {(block.faqs || [
                  { id: 'faq-1', q: 'Is there a setup or domain routing fee?', a: 'Absolutely not. Custom DNS mappings, hosting assets, and CDN caching are bundled entirely free of cost.' },
                  { id: 'faq-2', q: 'Can I export the clean React or Tailwind code?', a: 'Yes! Select export from the builder settings to export standard standalone React files containing your configurations.' },
                  { id: 'faq-3', q: 'Are visual effects responsive?', a: 'Every moving border, spotlight mask, and particle wave recalculates dynamically depending on the active device viewport.' }
                ]).map((faq, index) => {
                  const isOpen = faqOpen[index] || false;
                  return (
                    <div 
                      key={faq.id || index} 
                      className="p-5 rounded-xl border border-slate-200/10 bg-slate-500/5 cursor-pointer transition"
                      onClick={() => setFaqOpen({ ...faqOpen, [index]: !isOpen })}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <h4 className="text-sm font-bold">{faq.q}</h4>
                        <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.25 }, opacity: { duration: 0.2 } } }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-slate-400 mt-4 leading-relaxed border-t border-slate-500/10 pt-4">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : block.variant === 'stats-grid' ? (
              // STATS ANIMATED COUNTERS
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {(block.stats || [
                  { id: 'stat-1', label: 'ACTIVE USERS', val: 12400, suffix: '+' },
                  { id: 'stat-2', label: 'WEBSITES PUBLISHED', val: 9940, suffix: '' },
                  { id: 'stat-3', label: 'CDN COLD STARTS', val: 24, suffix: 'ms' }
                ]).map((stat, sIdx) => (
                  <div key={stat.id || sIdx} className="p-6 rounded-2xl bg-slate-500/5 border border-slate-200/10">
                    <h4 className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 mb-2">{stat.label}</h4>
                    <span className="text-4xl font-black text-blue-500">
                      <NumberCounter value={stat.val} suffix={stat.suffix} />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // ROADMAP STEPS
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
                {(block.steps || [
                  { id: 'step-1', step: '01', title: 'Pick Lego Blocks', desc: 'Browse the categories marketplace to stack premium blocks.' },
                  { id: 'step-2', step: '02', title: 'Tweak CSS Properties', desc: 'Customize padding, typography families, and borders.' },
                  { id: 'step-3', step: '03', title: 'Publish Instantly', desc: 'Click publish to route to live production-grade cloud servers.' }
                ]).map((step, idx) => (
                  <div key={step.id || idx} className="p-6 rounded-xl bg-slate-500/5 relative overflow-hidden group">
                    <span className="text-4xl font-black text-blue-500/20 absolute right-4 top-4 group-hover:scale-110 transition duration-300">{step.step}</span>
                    <h4 className="text-base font-extrabold mb-3 mt-4">{step.title}</h4>
                    <p className="text-xs opacity-80 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
