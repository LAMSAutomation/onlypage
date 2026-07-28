import React from 'react';
import { FileText, Plus, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: { label: string; onClick: () => void };
  illustration?: 'leads' | 'pages' | 'products' | 'bookings' | 'generic';
}

const ILLUSTRATIONS: Record<string, { emoji: string; bg: string }> = {
  leads: { emoji: '📋', bg: 'from-blue-50 to-indigo-50' },
  pages: { emoji: '📄', bg: 'from-emerald-50 to-teal-50' },
  products: { emoji: '🛍️', bg: 'from-amber-50 to-orange-50' },
  bookings: { emoji: '📅', bg: 'from-purple-50 to-pink-50' },
  generic: { emoji: '✨', bg: 'from-slate-50 to-indigo-50' },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
  illustration = 'generic',
}: EmptyStateProps) {
  const illus = ILLUSTRATIONS[illustration] || ILLUSTRATIONS.generic;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 rounded-3xl bg-gradient-to-br ${illus.bg} border border-slate-100`}>
      {/* Illustration */}
      <div className="relative mb-4">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${illus.bg} flex items-center justify-center text-3xl shadow-sm border border-white/50`}>
          {Icon ? <Icon size={32} className="text-slate-400" /> : <span>{illus.emoji}</span>}
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          <Sparkles size={10} />
        </span>
      </div>

      {/* Text */}
      <h3 className="text-base font-extrabold text-slate-800 text-center">{title}</h3>
      <p className="text-xs text-slate-500 font-medium text-center max-w-xs mt-1.5 leading-relaxed">{description}</p>

      {/* Actions */}
      <div className="flex items-center gap-2.5 mt-5">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            {actionLabel}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
