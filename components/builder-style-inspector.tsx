import React, { useState } from 'react';
import { 
  Sliders, Type, Palette, Layout, Box, Move, Eye, Shield, Sparkles, 
  ChevronDown, Layers, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Maximize2, Circle, Sun, Moon, Image as ImageIcon, CornerDownRight
} from 'lucide-react';
import { WebBlock, BlockCSSStyles } from './builder-types';

interface BuilderStyleInspectorProps {
  block: WebBlock | null;
  selectedSubElement?: string | null;
  onUpdateStyles: (updatedStyles: Partial<BlockCSSStyles>) => void;
  onUpdateSubElementStyles?: (subElementId: string, styles: Record<string, any>) => void;
}

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Outfit', 'Plus Jakarta Sans', 'Playfair Display', 
  'Merriweather', 'Lora', 'Cormorant Garamond', 'Cinzel', 'JetBrains Mono', 
  'Fira Code', 'Space Mono', 'Caveat', 'Great Vibes'
];

export function BuilderStyleInspector({
  block,
  selectedSubElement,
  onUpdateStyles,
  onUpdateSubElementStyles,
}: BuilderStyleInspectorProps) {
  const [activeSection, setActiveSection] = useState<'layout' | 'spacing' | 'typography' | 'color' | 'border'>('layout');

  if (!block) {
    return (
      <div className="p-6 text-center text-slate-500 space-y-3 font-sans">
        <Sliders className="w-8 h-8 mx-auto opacity-30 text-lime-600" />
        <p className="text-xs font-bold text-slate-500">No Block Selected</p>
        <p className="text-[10px] text-slate-500">Click any block or element on the canvas to open Webstudio Style Inspector controls.</p>
      </div>
    );
  }

  const styles = (block.styles || {}) as Record<string, any>;

  const handleStyleChange = (key: keyof BlockCSSStyles | string, value: any) => {
    if (selectedSubElement && onUpdateSubElementStyles) {
      onUpdateSubElementStyles(selectedSubElement, { [key]: value });
    } else {
      onUpdateStyles({ [key]: value });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans select-none text-left">
      
      {/* Inspector Target Header */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded bg-lime-500/10 text-lime-600 border border-lime-500/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
            {selectedSubElement ? 'SUB' : 'NODE'}
          </span>
          <span className="text-xs font-black text-slate-700 truncate">
            {selectedSubElement ? `${selectedSubElement} Element` : `${block.type} Section`}
          </span>
        </div>
        <span className="text-[8px] font-mono text-slate-500 uppercase px-1.5 py-0.5 bg-white border border-slate-200 rounded">
          {block.variant || 'default'}
        </span>
      </div>

      {/* Accordion Category Navigation Bar */}
      <div className="grid grid-cols-5 border-b border-slate-200 bg-white p-1 gap-1 shrink-0">
        {[
          { id: 'layout' as const, icon: Layout, label: 'Layout' },
          { id: 'spacing' as const, icon: Box, label: 'Box' },
          { id: 'typography' as const, icon: Type, label: 'Type' },
          { id: 'color' as const, icon: Palette, label: 'Colors' },
          { id: 'border' as const, icon: Sliders, label: 'Border' }
        ].map(cat => {
          const Icon = cat.icon;
          const isActive = activeSection === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveSection(cat.id)}
              className={`py-2 rounded-lg text-[9px] font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                isActive 
                  ? 'bg-lime-600 text-white shadow shadow-lime-500/20' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon size={13} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Style Controls Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        
        {/* 1. LAYOUT & FLEXBOX/GRID CONTROLS */}
        {activeSection === 'layout' && (
          <div className="space-y-4">
            
            {/* Display property */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Display Mode</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['block', 'flex', 'grid'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleStyleChange('display' as any, mode)}
                    className={`py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition cursor-pointer ${
                      (styles as any).display === mode || (!styles as any).display && mode === 'block'
                        ? 'bg-lime-600 text-white shadow'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Flex Alignment (if flex selected) */}
            {((styles as any).display === 'flex' || !(styles as any).display) && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Flex Direction</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => handleStyleChange('flexDirection' as any, 'row')}
                      className={`py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition cursor-pointer ${
                        (styles as any).flexDirection === 'row' || !(styles as any).flexDirection
                          ? 'bg-lime-600 text-white shadow'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Row →
                    </button>
                    <button
                      onClick={() => handleStyleChange('flexDirection' as any, 'column')}
                      className={`py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition cursor-pointer ${
                        (styles as any).flexDirection === 'column'
                          ? 'bg-lime-600 text-white shadow'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Column ↓
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Justify Content</label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {[
                      { id: 'flex-start', label: 'Start' },
                      { id: 'center', label: 'Center' },
                      { id: 'flex-end', label: 'End' },
                      { id: 'space-between', label: 'Between' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleStyleChange('justifyContent' as any, item.id)}
                        className={`py-1 text-[8px] font-extrabold uppercase rounded transition cursor-pointer ${
                          (styles as any).justifyContent === item.id || (!styles as any).justifyContent && item.id === 'center'
                            ? 'bg-lime-600 text-white shadow'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Container Max Width */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                <span>Max Width</span>
                <span className="font-mono text-lime-600">{styles.maxWidth || 1200}px</span>
              </div>
              <input
                type="range"
                min={400}
                max={1600}
                step={20}
                value={styles.maxWidth || 1200}
                onChange={(e) => handleStyleChange('maxWidth', Number(e.target.value))}
                className="w-full accent-lime-600 bg-slate-100 cursor-pointer h-1.5 rounded-lg"
              />
            </div>

            {/* Text Alignment */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Text Alignment</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[
                  { id: 'left' as const, icon: AlignLeft, label: 'Left' },
                  { id: 'center' as const, icon: AlignCenter, label: 'Center' },
                  { id: 'right' as const, icon: AlignRight, label: 'Right' }
                ].map(align => {
                  const Icon = align.icon;
                  return (
                    <button
                      key={align.id}
                      onClick={() => handleStyleChange('textAlign', align.id)}
                      className={`py-1.5 flex items-center justify-center gap-1 text-[9px] font-extrabold uppercase rounded-lg transition cursor-pointer ${
                        styles.textAlign === align.id
                          ? 'bg-lime-600 text-white shadow'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon size={11} />
                      <span>{align.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* 2. VISUAL BOX MODEL (PADDING & MARGIN) */}
        {activeSection === 'spacing' && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Webstudio Visual Box Model</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Drag sliders or enter exact pixel spacing.</p>
            </div>

            {/* Interactive Visual Box Diagram */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3">
              <div className="text-[8px] font-mono font-bold text-amber-600 uppercase text-center mb-1">SECTION PADDING</div>
              
              {/* Padding Top */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Padding Top</span>
                  <span className="text-lime-600 font-bold">{styles.paddingTop ?? 64}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={styles.paddingTop ?? 64}
                  onChange={(e) => handleStyleChange('paddingTop', Number(e.target.value))}
                  className="w-full accent-lime-600 bg-slate-200 cursor-pointer h-1.5 rounded-lg"
                />
              </div>

              {/* Padding Horizontal */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>Left</span>
                    <span className="text-lime-600 font-bold">{styles.paddingLeft ?? 24}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    value={styles.paddingLeft ?? 24}
                    onChange={(e) => handleStyleChange('paddingLeft', Number(e.target.value))}
                    className="w-full accent-lime-600 bg-slate-200 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>Right</span>
                    <span className="text-lime-600 font-bold">{styles.paddingRight ?? 24}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    value={styles.paddingRight ?? 24}
                    onChange={(e) => handleStyleChange('paddingRight', Number(e.target.value))}
                    className="w-full accent-lime-600 bg-slate-200 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
              </div>

              {/* Padding Bottom */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Padding Bottom</span>
                  <span className="text-lime-600 font-bold">{styles.paddingBottom ?? 64}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={styles.paddingBottom ?? 64}
                  onChange={(e) => handleStyleChange('paddingBottom', Number(e.target.value))}
                  className="w-full accent-lime-600 bg-slate-200 cursor-pointer h-1.5 rounded-lg"
                />
              </div>

            </div>

          </div>
        )}

        {/* 3. TYPOGRAPHY CONTROLS */}
        {activeSection === 'typography' && (
          <div className="space-y-4">
            
            {/* Font Family Selector */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Font Family</label>
              <select
                value={styles.fontFamily || 'Inter'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full bg-slate-100 text-xs text-slate-700 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-lime-500 font-sans"
              >
                {GOOGLE_FONTS.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            {/* Title Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                <span>Title Font Size</span>
                <span className="font-mono text-lime-600">{styles.titleSize || 48}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={96}
                value={styles.titleSize || 48}
                onChange={(e) => handleStyleChange('titleSize', Number(e.target.value))}
                className="w-full accent-lime-600 bg-slate-100 cursor-pointer h-1.5 rounded-lg"
              />
            </div>

            {/* Subtitle Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                <span>Subtitle Font Size</span>
                <span className="font-mono text-lime-600">{styles.subtitleSize || 18}px</span>
              </div>
              <input
                type="range"
                min={12}
                max={36}
                value={styles.subtitleSize || 18}
                onChange={(e) => handleStyleChange('subtitleSize', Number(e.target.value))}
                className="w-full accent-lime-600 bg-slate-100 cursor-pointer h-1.5 rounded-lg"
              />
            </div>

            {/* Line Height & Letter Spacing */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase block">Line Height</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="2.5"
                  value={(styles as any).lineHeight || 1.2}
                  onChange={(e) => handleStyleChange('lineHeight' as any, Number(e.target.value))}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs text-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase block">Transform</label>
                <select
                  value={(styles as any).titleTransform || 'none'}
                  onChange={(e) => handleStyleChange('titleTransform' as any, e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs text-white outline-none"
                >
                  <option value="none">None</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="capitalize">Capitalize</option>
                  <option value="lowercase">lowercase</option>
                </select>
              </div>
            </div>

          </div>
        )}

        {/* 4. COLOR & BACKGROUND SYSTEM */}
        {activeSection === 'color' && (
          <div className="space-y-4">
            
            {/* Text Color */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Text Color</label>
              <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                <input
                  type="color"
                  value={styles.textColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={styles.textColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="flex-1 bg-transparent text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Background Color</label>
              <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                <input
                  type="color"
                  value={styles.backgroundColor || '#0f172a'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={styles.backgroundColor || '#0f172a'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 bg-transparent text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            {/* Background Image URL */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Background Image URL</label>
              <input
                type="text"
                placeholder="e.g. https://images.unsplash.com/photo-..."
                value={(styles as any).bgImageUrl || ''}
                onChange={(e) => handleStyleChange('bgImageUrl' as any, e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-white outline-none focus:border-lime-500 font-mono"
              />
            </div>

            {/* Accent & Button Colors */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase block">Button BG</label>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="color"
                    value={styles.buttonBgColor || '#2563eb'}
                    onChange={(e) => handleStyleChange('buttonBgColor', e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[9px] font-mono text-slate-600">{styles.buttonBgColor || '#2563eb'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase block">Accent Glow</label>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="color"
                    value={styles.accentColor || '#3b82f6'}
                    onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[9px] font-mono text-slate-600">{styles.accentColor || '#3b82f6'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 5. BORDERS, CORNERS & SHADOWS */}
        {activeSection === 'border' && (
          <div className="space-y-4">
            
            {/* Border Radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                <span>Corner Border Radius</span>
                <span className="font-mono text-lime-600">{styles.borderRadius || 0}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={48}
                value={styles.borderRadius || 0}
                onChange={(e) => handleStyleChange('borderRadius', Number(e.target.value))}
                className="w-full accent-lime-600 bg-slate-100 cursor-pointer h-1.5 rounded-lg"
              />
            </div>

            {/* Border Width & Color */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase block">Border Width</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={styles.borderWidth || 0}
                  onChange={(e) => handleStyleChange('borderWidth', Number(e.target.value))}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs text-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase block">Border Color</label>
                <input
                  type="color"
                  value={styles.borderColor || '#334155'}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="w-full h-8 rounded cursor-pointer border border-slate-200 bg-slate-100 p-1"
                />
              </div>
            </div>

            {/* Box Shadow Presets */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Box Shadow Effect</label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'sm', label: 'Soft Shadow' },
                  { id: 'lg', label: 'Elevated' },
                  { id: 'glow', label: 'Neon Glow' }
                ].map(shadow => (
                  <button
                    key={shadow.id}
                    onClick={() => handleStyleChange('boxShadow', shadow.id)}
                    className={`py-1.5 text-[9px] font-extrabold uppercase rounded-lg transition cursor-pointer ${
                      styles.boxShadow === shadow.id || (!styles.boxShadow && shadow.id === 'none')
                        ? 'bg-lime-600 text-white shadow'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {shadow.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
