import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, Layers, Eye, EyeOff, Lock, Unlock, 
  Trash2, Copy, ArrowUp, ArrowDown, Plus, Sparkles, Type, Image as ImageIcon, Box
} from 'lucide-react';
import { WebBlock } from './builder-types';

interface BuilderTreeNavigatorProps {
  blocks: WebBlock[];
  globalHeader: WebBlock | null;
  globalFooter: WebBlock | null;
  selectedBlockId: string | null;
  selectedSubElement?: string | null;
  onSelectBlock: (blockId: string) => void;
  onSelectSubElement?: (subElementId: string | null) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onOpenAddSectionModal: () => void;
}

export function BuilderTreeNavigator({
  blocks,
  globalHeader,
  globalFooter,
  selectedBlockId,
  selectedSubElement,
  onSelectBlock,
  onSelectSubElement,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onOpenAddSectionModal,
}: BuilderTreeNavigatorProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({
    'global-header': false,
    'global-footer': false,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBlocks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSubElementsForBlock = (block: WebBlock): { id: string; label: string; icon: any }[] => {
    const list = [];
    if (block.badge) list.push({ id: 'badge', label: 'Badge Overlay', icon: Sparkles });
    if (block.title) list.push({ id: 'title', label: 'Headline Text', icon: Type });
    if (block.subtitle) list.push({ id: 'subtitle', label: 'Subtitle Text', icon: Type });
    if (block.btnText) list.push({ id: 'button', label: 'Primary CTA Button', icon: Box });
    if (block.secondaryBtnText) list.push({ id: 'secondaryButton', label: 'Secondary Button', icon: Box });
    if (block.features && block.features.length > 0) list.push({ id: 'features', label: `Feature Items (${block.features.length})`, icon: Layers });
    if (block.pricing && block.pricing.length > 0) list.push({ id: 'pricing', label: `Pricing Cards (${block.pricing.length})`, icon: Box });
    return list;
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans select-none text-left">
      
      {/* Header Bar */}
      <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
            <Layers size={13} className="text-lime-600" />
            <span>DOM Tree Navigator</span>
          </h3>
          <p className="text-[9px] text-slate-500 mt-0.5">Webstudio-grade tree layout inspector</p>
        </div>
        <button
          onClick={onOpenAddSectionModal}
          className="p-1.5 bg-lime-600 hover:bg-lime-500 text-white rounded-lg transition shadow shadow-lime-500/20 cursor-pointer"
          title="Add New Layout Section"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Tree Node List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        
        {/* Global Header Node */}
        {globalHeader && (
          <div className="space-y-0.5">
            <div
              onClick={() => {
                onSelectBlock('global-header');
                onSelectSubElement?.(null);
              }}
              className={`group px-2.5 py-2 rounded-xl cursor-pointer transition flex items-center justify-between border text-xs font-bold ${
                selectedBlockId === 'global-header'
                  ? 'bg-lime-500/10 border-lime-500 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-mono shrink-0">
                  L
                </span>
                <span className="truncate text-xs font-bold text-slate-700">Global Header</span>
              </div>
              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-500">
                LOCKED
              </span>
            </div>
          </div>
        )}

        {/* Page Section Block Nodes */}
        {blocks.map((block, index) => {
          const isSelected = selectedBlockId === block.id;
          const isExpanded = expandedBlocks[block.id];
          const subElements = getSubElementsForBlock(block);

          return (
            <div key={block.id} className="space-y-0.5">
              
              {/* Root Section Node */}
              <div
                onClick={() => {
                  onSelectBlock(block.id);
                  onSelectSubElement?.(null);
                }}
                className={`group px-2.5 py-2 rounded-xl cursor-pointer transition flex items-center justify-between border text-xs ${
                  isSelected 
                    ? 'bg-lime-500/10 border-lime-500 text-slate-900 shadow-sm' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {subElements.length > 0 ? (
                    <button
                      onClick={(e) => toggleExpand(block.id, e)}
                      className="p-0.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                  ) : (
                    <span className="w-3.5" />
                  )}
                  
                  <span className="w-5 h-5 rounded bg-slate-100 text-lime-600 font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                    #{index + 1}
                  </span>
                  
                  <div className="min-w-0">
                    <span className="block text-xs font-black truncate text-slate-900">
                      {block.type} Section
                    </span>
                    <span className="block text-[8px] font-mono text-slate-500 truncate">
                      {block.variant || 'default'}
                    </span>
                  </div>
                </div>

                {/* Layer Action Controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveBlock(index, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={11} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveBlock(index, 'down');
                    }}
                    disabled={index === blocks.length - 1}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={11} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateBlock(block.id);
                    }}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                    title="Duplicate Block"
                  >
                    <Copy size={11} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBlock(block.id);
                    }}
                    className="p-1 rounded hover:bg-rose-50 text-slate-500 hover:text-rose-600 cursor-pointer"
                    title="Delete Block"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {/* Nested Sub-Elements Tree */}
              {isExpanded && subElements.length > 0 && (
                <div className="pl-6 space-y-0.5 border-l-2 border-slate-200 ml-4 py-1">
                  {subElements.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubSelected = isSelected && selectedSubElement === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBlock(block.id);
                          onSelectSubElement?.(sub.id);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-2 border ${
                          isSubSelected
                            ? 'bg-lime-600 text-white border-lime-500 shadow-xs'
                            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
                        }`}
                      >
                        <SubIcon size={11} className={isSubSelected ? 'text-white' : 'text-lime-600'} />
                        <span className="truncate">{sub.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}

        {/* Global Footer Node */}
        {globalFooter && (
          <div className="space-y-0.5 pt-1">
            <div
              onClick={() => {
                onSelectBlock('global-footer');
                onSelectSubElement?.(null);
              }}
              className={`group px-2.5 py-2 rounded-xl cursor-pointer transition flex items-center justify-between border text-xs font-bold ${
                selectedBlockId === 'global-footer'
                  ? 'bg-lime-500/10 border-lime-500 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-[9px] font-mono shrink-0">
                  F
                </span>
                <span className="truncate text-xs font-bold text-slate-700">Global Footer</span>
              </div>
              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-500">
                LOCKED
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
