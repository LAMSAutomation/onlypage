import React from 'react';

// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

function SkeletonBase({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} style={style} />;
}

// ---------------------------------------------------------------------------
// Common skeleton presets
// ---------------------------------------------------------------------------

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-3/4' : i === 0 ? 'w-1/2' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonBase className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <SkeletonBase className="h-3 w-1/2" />
          <SkeletonBase className="h-2 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex gap-4 pb-2">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBase key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2.5 border-t border-slate-50">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBase key={c} className={`h-3 ${c === 0 ? 'flex-[2]' : 'flex-1'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonBase key={i} className={`flex-1 ${[4, 6, 3, 7, 5, 4, 6][i] as number * 8}px`} style={{ height: `${[4, 6, 3, 7, 5, 4, 6][i] * 8}px` }} />
        ))}
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonBase key={i} className="h-2 flex-1" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return <SkeletonBase className={`${sizes[size]} rounded-full`} />;
}

export { SkeletonBase };
export default SkeletonCard;
