import React from 'react';

// ---------------------------------------------------------------------------
// Realistic mini layout previews — drawn to look like actual rendered blocks
// Each variant draws a mini mockup (48x36 or 64x48px) with real colors,
// layout structure, and visual elements that match the actual block.
// ---------------------------------------------------------------------------

interface VariantMiniPreviewProps {
  type: string;
  variantId?: string;
  index?: number;
  size?: 'sm' | 'md' | 'lg';
}

// Color palettes that match the variant style patches for realistic look
const PALETTES: Record<string, { bg: string; text: string; accent: string; muted: string; card: string }> = {
  editorial: { bg: '#f5f0e8', text: '#211c18', accent: '#9a3412', muted: '#6f6259', card: '#ffffff' },
  local: { bg: '#f7fee7', text: '#1a2e05', accent: '#65a30d', muted: '#4d7c0f', card: '#ffffff' },
  luxury: { bg: '#18181b', text: '#fafafa', accent: '#d6b66b', muted: '#a1a1aa', card: '#27272a' },
  poster: { bg: '#facc15', text: '#111827', accent: '#111827', muted: '#374151', card: '#ffffff' },
  soft: { bg: '#faf5ff', text: '#312e81', accent: '#7c3aed', muted: '#6366f1', card: '#ffffff' },
  mono: { bg: '#fafafa', text: '#09090b', accent: '#09090b', muted: '#52525b', card: '#ffffff' },
  warm: { bg: '#fff7ed', text: '#431407', accent: '#ea580c', muted: '#9a3412', card: '#ffffff' },
  glass: { bg: '#0f172a', text: '#f8fafc', accent: '#c4b5fd', muted: '#cbd5e1', card: '#1e293b' },
  clean: { bg: '#ffffff', text: '#17201c', accent: '#65a30d', muted: '#64748b', card: '#f8fafc' },
  dark: { bg: '#09090b', text: '#fafafa', accent: '#a3e635', muted: '#a1a1aa', card: '#18181b' },
};

function getPalette(variantId: string) {
  if (variantId.includes('editorial')) return PALETTES.editorial;
  if (variantId.includes('local')) return PALETTES.local;
  if (variantId.includes('quiet-luxury')) return PALETTES.luxury;
  if (variantId.includes('bold') || variantId.includes('poster')) return PALETTES.poster;
  if (variantId.includes('soft') || variantId.includes('gradient')) return PALETTES.soft;
  if (variantId.includes('mono')) return PALETTES.mono;
  if (variantId.includes('warm')) return PALETTES.warm;
  if (variantId.includes('glass')) return PALETTES.glass;
  if (variantId.includes('dark') || variantId.includes('aurora') || variantId.includes('3d')) return PALETTES.dark;
  return PALETTES.clean;
}

// ---------------------------------------------------------------------------
// Hero Preview
// ---------------------------------------------------------------------------
function HeroPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isDark = p.bg === '#09090b' || p.bg === '#18181b' || p.bg === '#0f172a';
  const isSplit = ['split', 'saas-modern', 'video-simulate', 'tailgrids-hero-split', 'untitled-hero-split'].some(v => variantId.includes(v));
  const isUiverse = variantId.includes('uiverse');
  const isMui = variantId.includes('mui');
  const isPoster = p.bg === '#facc15';

  return (
    <div className={`${size} rounded-md overflow-hidden relative shadow-xs`} style={{ backgroundColor: p.bg }}>
      {/* Glow backgrounds */}
      {isUiverse && (
        <>
          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-fuchsia-500/40 blur-xs" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-cyan-400/40 blur-xs" />
        </>
      )}
      {(variantId.includes('aurora') || variantId.includes('glass')) && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
      )}
      <div className={`relative h-full flex ${isSplit ? 'flex-row' : 'flex-col'} items-center justify-center p-1 gap-1`}>
        {isSplit && (
          <div className="w-1/2 h-full rounded-xs flex items-center justify-center p-0.5" style={{ backgroundColor: isDark ? '#ffffff15' : '#e2e8f0' }}>
            <div className="w-full h-full rounded-xs bg-indigo-500/30 flex items-center justify-center text-[5px]">
              {variantId.includes('video') ? '▶' : '📊'}
            </div>
          </div>
        )}
        <div className={`${isSplit ? 'w-1/2' : 'w-full'} flex flex-col gap-0.5 items-center text-center ${isPoster ? 'items-start text-left' : ''}`}>
          {/* Badge */}
          <div className="h-0.5 w-1/3 rounded-full" style={{ backgroundColor: isUiverse ? '#e879f9' : isMui ? '#3b82f6' : p.accent }} />
          {/* Title */}
          <div className="h-1 w-5/6 rounded-xs" style={{ backgroundColor: isPoster ? p.text : isDark ? '#ffffff' : p.text }} />
          {/* Subtitle */}
          <div className="h-0.5 w-2/3 rounded-xs" style={{ backgroundColor: isDark ? '#ffffff77' : p.muted }} />
          {/* CTA Buttons */}
          <div className="flex gap-0.5 mt-0.5">
            <div className="h-1 w-3.5 rounded-xs" style={{ backgroundColor: isPoster ? p.text : p.accent }} />
            <div className="h-1 w-2.5 rounded-xs border" style={{ borderColor: isDark ? '#ffffff44' : '#cbd5e1' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Features / Business Preview
// ---------------------------------------------------------------------------
function FeaturesPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isBento = variantId.includes('bento');
  const isAlt = variantId === 'alternating';
  const isComparison = variantId === 'comparison';
  const isDark = p.bg === '#09090b' || p.bg === '#18181b' || p.bg === '#0f172a';
  const isUiverse = variantId.includes('uiverse');

  return (
    <div className={`${size} rounded-md overflow-hidden p-0.5 relative`} style={{ backgroundColor: p.bg || '#ffffff' }}>
      <div className={`h-full flex ${isAlt ? 'flex-col' : 'flex-row'} gap-0.5`}>
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            className={`${isBento && i === 1 ? 'flex-[1.5]' : 'flex-1'} flex flex-col gap-0.5 p-0.5 ${isComparison ? 'border-r border-slate-200 last:border-r-0' : ''}`}
            style={{ 
              backgroundColor: isUiverse ? '#ffffff0d' : isDark ? '#ffffff08' : '#f8fafc',
              borderRadius: isBento ? 3 : 2,
              border: isUiverse ? '1px solid #ffffff15' : '1px solid #e2e8f010'
            }}
          >
            {/* Icon box */}
            <div className="w-1.5 h-1.5 rounded-xs shrink-0" style={{ backgroundColor: i === 1 ? p.accent : '#94a3b8' }} />
            <div className="h-0.5 w-full rounded-xs" style={{ backgroundColor: isDark ? '#ffffffaa' : '#334155' }} />
            <div className="h-0.5 w-2/3 rounded-xs" style={{ backgroundColor: isDark ? '#ffffff44' : '#cbd5e1' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CTA Preview
// ---------------------------------------------------------------------------
function CTAPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isGradient = variantId.includes('gradient') || variantId === 'soft-gradient';
  const isUiverse = variantId.includes('uiverse');
  const isMui = variantId.includes('mui');

  return (
    <div className={`${size} rounded-md overflow-hidden flex items-center justify-center p-1 relative`}
      style={{
        background: isUiverse 
          ? 'linear-gradient(135deg, #09090b, #3b0764)' 
          : isMui 
          ? '#2563eb' 
          : isGradient 
          ? `linear-gradient(135deg, ${p.bg}, ${p.accent}aa)` 
          : p.accent,
      }}
    >
      <div className="flex flex-col items-center gap-0.5 text-center w-full">
        <div className="h-0.5 w-1/3 rounded-full bg-white/60" />
        <div className="h-1 w-3/4 rounded-xs bg-white" />
        <div className="h-0.5 w-1/2 rounded-xs bg-white/70" />
        <div className="h-1 w-1/3 rounded-xs mt-0.5 bg-white shadow-xs" style={{ color: p.accent }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pricing Preview
// ---------------------------------------------------------------------------
function PricingPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isGlass = variantId.includes('glass') || variantId.includes('uiverse');
  const isDark = p.bg === '#09090b' || p.bg === '#18181b' || p.bg === '#0f172a' || isGlass;

  return (
    <div className={`${size} rounded-md overflow-hidden p-0.5 flex items-end gap-0.5`}
      style={{ backgroundColor: isDark ? p.bg : '#ffffff' }}
    >
      {[0, 1, 2].map(i => (
        <div 
          key={i} 
          className="flex-1 flex flex-col items-center gap-0.5 p-0.5 rounded-xs" 
          style={{ 
            height: i === 1 ? '100%' : '80%',
            backgroundColor: i === 1 ? (isDark ? '#ffffff18' : '#f1f5f9') : (isDark ? '#ffffff08' : '#f8fafc'),
            border: i === 1 ? `1px solid ${p.accent}` : '1px solid #cbd5e130'
          }}
        >
          {/* Badge */}
          {i === 1 && <div className="h-0.5 w-2/3 rounded-xs" style={{ backgroundColor: p.accent }} />}
          {/* Price header */}
          <div className="w-full h-1 rounded-xs" style={{ backgroundColor: i === 1 ? p.accent : isDark ? '#ffffff44' : '#64748b' }} />
          {/* Check lines */}
          {[0, 1].map(j => (
            <div key={j} className="w-3/4 h-0.5 rounded-xs" style={{ backgroundColor: isDark ? '#ffffff22' : '#e2e8f0' }} />
          ))}
          {/* Button */}
          <div className="w-full h-1 rounded-xs mt-auto" style={{ backgroundColor: i === 1 ? p.accent : isDark ? '#ffffff33' : '#cbd5e1' }} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
function TestimonialsPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isDark = p.bg === '#09090b' || p.bg === '#18181b' || p.bg === '#0f172a';
  const isWall = variantId === 'wall-of-love' || variantId === 'editorial-stack';
  return (
    <div className={`${size} rounded-md overflow-hidden p-1 flex ${isWall ? 'flex-col' : 'flex-row'} gap-0.5`}
      style={{ backgroundColor: p.bg || '#ffffff', border: isDark ? '1px solid #ffffff22' : '1px solid #e2e8f0' }}
    >
      {[0, 1, 2].map(i => (
        <div key={i} className={`${isWall ? 'w-full' : 'flex-1'} flex flex-col gap-0.5 p-0.5`}
          style={{ backgroundColor: isDark ? '#ffffff08' : '#f8fafc', borderRadius: 2 }}
        >
          {/* Stars */}
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map(s => (
              <div key={s} className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            ))}
          </div>
          {/* Quote text */}
          <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: isDark ? '#ffffff33' : '#e2e8f0' }} />
          <div className="h-0.5 w-2/3 rounded-sm" style={{ backgroundColor: isDark ? '#ffffff22' : '#f1f5f9' }} />
          {/* Author */}
          <div className="flex items-center gap-0.5 mt-0.5">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: p.accent }} />
            <div className="h-0.5 w-1/2 rounded-sm" style={{ backgroundColor: isDark ? '#ffffff44' : '#cbd5e1' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
function GalleryPreview({ variantId, size }: { variantId: string; size: string }) {
  const isMarquee = variantId === 'marquee-logos';
  const isMasonry = variantId === 'masonry';
  return (
    <div className={`${size} rounded-md overflow-hidden bg-white border border-slate-200 p-0.5 flex ${isMarquee ? 'flex-row items-center' : 'flex-wrap'} gap-0.5`}>
      {isMarquee ? (
        [0, 1, 2, 3].map(i => (
          <div key={i} className="h-2 w-2 rounded-sm" style={{ backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'][i] }} />
        ))
      ) : isMasonry ? (
        <>
          <div className="w-full h-1.5 rounded-sm bg-slate-200" />
          <div className="flex gap-0.5 w-full">
            <div className="flex-1 h-2 rounded-sm bg-slate-100" />
            <div className="flex-[2] h-2 rounded-sm bg-slate-300" />
          </div>
        </>
      ) : (
        [0, 1, 2, 3].map(i => (
          <div key={i} className="w-[calc(50%-1px)] h-[calc(50%-1px)] rounded-sm"
            style={{ backgroundColor: `hsl(${220 + i * 30}, 20%, ${85 - i * 10}%)` }}
          />
        ))
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------
function FormsPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isWhatsApp = variantId.includes('whatsapp');
  const isContact = variantId.includes('complex') || variantId === 'contact-complex';
  const isConsult = variantId === 'quiet-luxury' || variantId === 'local-conversion';
  return (
    <div className={`${size} rounded-md overflow-hidden p-1 flex flex-col justify-center gap-0.5`}
      style={{ backgroundColor: isWhatsApp ? '#25D366' : isConsult ? '#18181b' : isContact ? '#f8fafc' : '#ffffff', border: isWhatsApp || isConsult ? 'none' : '1px solid #e2e8f0' }}
    >
      {/* Label */}
      <div className="h-0.5 w-1/3 rounded-sm" style={{ backgroundColor: isWhatsApp || isConsult ? '#ffffff88' : '#94a3b8' }} />
      {/* Input field */}
      <div className="h-1 w-full rounded-sm" style={{ backgroundColor: isWhatsApp || isConsult ? '#ffffff33' : '#e2e8f0' }} />
      {/* Input field */}
      <div className="h-1 w-3/4 rounded-sm" style={{ backgroundColor: isWhatsApp || isConsult ? '#ffffff22' : '#f1f5f9' }} />
      {/* Button */}
      <div className="h-1 w-1/2 rounded-sm mt-0.5" style={{ backgroundColor: isWhatsApp ? '#ffffff' : isConsult ? '#d6b66b' : '#65a30d' }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function NavPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isDark = p.bg === '#09090b' || p.bg === '#18181b' || p.bg === '#0f172a';
  const isGlass = variantId.includes('glass') || variantId.includes('blur');
  const isCapsule = variantId.includes('pill') || variantId.includes('capsule');
  const isMega = variantId.includes('mega');
  return (
    <div className={`${size} rounded-md overflow-hidden flex items-center px-1 gap-0.5`}
      style={{
        backgroundColor: isGlass ? '#ffffff22' : isDark ? p.bg : '#ffffff',
        border: isGlass ? '1px solid #ffffff33' : '1px solid #e2e8f0',
        backdropFilter: isGlass ? 'blur(2px)' : 'none',
      }}
    >
      {/* Logo */}
      <div className="w-2 h-2 rounded-sm flex items-center justify-center text-[3px] font-bold" style={{ backgroundColor: p.accent, color: '#ffffff' }}>O</div>
      {/* Links */}
      <div className="flex-1 flex justify-center gap-0.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-0.5 w-1.5 rounded-sm" style={{ backgroundColor: isDark ? '#ffffff66' : '#cbd5e1' }} />
        ))}
      </div>
      {/* CTA Button */}
      <div className={`h-1 w-2 rounded-sm ${isCapsule ? 'rounded-full' : ''}`} style={{ backgroundColor: p.accent }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function FooterPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isDark = p.bg === '#09090b' || p.bg === '#18181b' || p.bg === '#0f172a' || variantId.includes('cosmos');
  const isMinimal = variantId.includes('minimal') || variantId.includes('copyright');
  const isBento = variantId.includes('bento');
  const hasMap = variantId.includes('map');
  return (
    <div className={`${size} rounded-md overflow-hidden p-1 flex flex-col justify-end gap-0.5`}
      style={{ backgroundColor: isDark ? p.bg : '#f8fafc', border: isDark ? 'none' : '1px solid #e2e8f0' }}
    >
      {isMinimal ? (
        <div className="h-0.5 w-3/4 mx-auto rounded-sm" style={{ backgroundColor: isDark ? '#ffffff44' : '#cbd5e1' }} />
      ) : (
        <>
          {hasMap && <div className="h-1.5 w-full rounded-sm mb-0.5" style={{ backgroundColor: isDark ? '#ffffff22' : '#d1fae5' }} />}
          <div className="flex gap-0.5">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`${isBento && i === 1 ? 'flex-[2]' : 'flex-1'} flex flex-col gap-0.5`}>
                <div className="h-0.5 rounded-sm" style={{ backgroundColor: isDark ? '#ffffff44' : '#cbd5e1' }} />
                <div className="h-0.5 w-2/3 rounded-sm" style={{ backgroundColor: isDark ? '#ffffff22' : '#e2e8f0' }} />
              </div>
            ))}
          </div>
          <div className="h-0.5 w-full rounded-sm mt-0.5" style={{ backgroundColor: isDark ? '#ffffff22' : '#e2e8f0' }} />
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Special
// ---------------------------------------------------------------------------
function SpecialPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isFaq = variantId === 'faq-accordions' || variantId === 'editorial-stack';
  const isSteps = variantId === 'steps-path';
  const isStats = variantId.includes('stats') || variantId === 'glass-panel' || variantId === 'mono-grid';
  return (
    <div className={`${size} rounded-md overflow-hidden bg-white border border-slate-200 p-1 flex flex-col gap-0.5`}>
      {isSteps ? (
        <div className="flex items-center justify-center gap-1 h-full">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
              <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
              <div className="h-0.5 w-2/3 rounded-sm" style={{ backgroundColor: '#f1f5f9' }} />
            </div>
          ))}
        </div>
      ) : isFaq ? (
        [0, 1, 2].map(i => (
          <div key={i} className="flex items-center gap-0.5">
            <div className="flex-1 h-0.5 rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
            <div className="w-0.5 h-0.5 rounded-sm text-[3px]" style={{ color: '#94a3b8' }}>▼</div>
          </div>
        ))
      ) : isStats ? (
        <div className="flex items-center justify-center gap-1 h-full">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="h-1 w-full rounded-sm" style={{ backgroundColor: p.accent, opacity: i === 1 ? 1 : 0.6 }} />
              <div className="h-0.5 w-2/3 rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="h-0.5 w-3/4 rounded-sm" style={{ backgroundColor: p.accent }} />
          <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
          <div className="h-0.5 w-1/2 rounded-sm" style={{ backgroundColor: '#f1f5f9' }} />
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Map
// ---------------------------------------------------------------------------
function MapPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isDark = p.bg === '#09090b' || p.bg === '#18181b' || p.bg === '#0f172a';
  return (
    <div className={`${size} rounded-md overflow-hidden flex items-center justify-center`}
      style={{ backgroundColor: '#d1fae5', border: '1px solid #a7f3d0' }}
    >
      <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#34d399' }}>
        <span className="text-[4px]">📍</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------
function TextPreview({ variantId, size }: { variantId: string; size: string }) {
  const isQuote = variantId === 'quote-callout';
  return (
    <div className={`${size} rounded-md overflow-hidden bg-white border border-slate-200 p-1 flex flex-col gap-0.5`}>
      {isQuote ? (
        <div className="flex gap-0.5 h-full">
          <div className="w-0.5 rounded-full" style={{ backgroundColor: '#818cf8' }} />
          <div className="flex-1 flex flex-col gap-0.5 justify-center">
            <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
            <div className="h-0.5 w-2/3 rounded-sm" style={{ backgroundColor: '#f1f5f9' }} />
            <div className="h-0.5 w-1/3 rounded-sm mt-0.5" style={{ backgroundColor: '#94a3b8' }} />
          </div>
        </div>
      ) : (
        <>
          <div className="h-0.5 w-3/4 rounded-sm" style={{ backgroundColor: '#0f172a' }} />
          <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: '#e2e8f0' }} />
          <div className="h-0.5 w-1/2 rounded-sm" style={{ backgroundColor: '#f1f5f9' }} />
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EComStore
// ---------------------------------------------------------------------------
function EcomPreview({ variantId, size }: { variantId: string; size: string }) {
  const p = getPalette(variantId);
  const isSingle = variantId === 'single-product-hero';
  const isWhatsApp = variantId.includes('whatsapp');
  return (
    <div className={`${size} rounded-md overflow-hidden p-1 flex ${isSingle ? 'flex-row' : 'flex-col'} gap-0.5`}
      style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
    >
      {isSingle ? (
        <>
          <div className="w-1/2 h-full rounded-sm flex items-center justify-center" style={{ backgroundColor: '#f1f5f9' }}>
            <span className="text-[4px]">🛍</span>
          </div>
          <div className="w-1/2 flex flex-col gap-0.5 justify-center">
            <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: '#0f172a' }} />
            <div className="h-0.5 w-1/2 rounded-sm" style={{ backgroundColor: p.accent }} />
            <div className="h-0.5 w-2/3 rounded-sm mt-0.5" style={{ backgroundColor: p.accent }} />
          </div>
        </>
      ) : isWhatsApp ? (
        <div className="flex items-center justify-center h-full" style={{ backgroundColor: '#25D366', borderRadius: 4 }}>
          <span className="text-[5px] text-white font-bold">WA</span>
        </div>
      ) : (
        <div className="flex gap-0.5 h-full">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-0.5">
              <div className="flex-1 rounded-sm" style={{ backgroundColor: ['#f1f5f9', '#e2e8f0', '#f8fafc'][i] }} />
              <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: '#0f172a' }} />
              <div className="h-0.5 w-1/2 rounded-sm" style={{ backgroundColor: p.accent }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function VariantMiniPreview({ type, variantId = '', index = 0, size = 'sm' }: VariantMiniPreviewProps) {
  const s = size === 'lg' ? 'w-full h-28' : size === 'md' ? 'w-16 h-12' : 'w-12 h-9';

  switch (type) {
    case 'Hero':
      return <HeroPreview variantId={variantId} size={s} />;
    case 'Features':
    case 'Business':
      return <FeaturesPreview variantId={variantId} size={s} />;
    case 'CTA':
      return <CTAPreview variantId={variantId} size={s} />;
    case 'Pricing':
      return <PricingPreview variantId={variantId} size={s} />;
    case 'Testimonials':
      return <TestimonialsPreview variantId={variantId} size={s} />;
    case 'Gallery':
      return <GalleryPreview variantId={variantId} size={s} />;
    case 'Forms':
      return <FormsPreview variantId={variantId} size={s} />;
    case 'Navigation':
      return <NavPreview variantId={variantId} size={s} />;
    case 'Footer':
      return <FooterPreview variantId={variantId} size={s} />;
    case 'Special':
      return <SpecialPreview variantId={variantId} size={s} />;
    case 'Map':
      return <MapPreview variantId={variantId} size={s} />;
    case 'Text':
      return <TextPreview variantId={variantId} size={s} />;
    case 'EComStore':
      return <EcomPreview variantId={variantId} size={s} />;
    default:
      return (
        <div className={`${s} rounded-md overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 border border-slate-200 flex items-center justify-center`}>
          <span className="text-[5px]">✦</span>
        </div>
      );
  }
}
