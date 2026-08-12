import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Badge } from './Badges';

export interface StatCardProps {
  title?: string;
  value?: string;
  change?: string;
  isPositive?: boolean;
  icon?: any;
  styles?: any;
  block?: any;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  styles = {},
  block
}) => {
  const cardTitle = title || block?.title || 'Total Users';
  const cardValue = value || block?.value || '24,599';
  const cardChange = change || block?.change || '12%';
  const isPos = block?.isPositive !== undefined ? block.isPositive : isPositive;
  const CardIcon = block?.icon || Icon;

  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border p-5 shadow-sm"
      style={{ backgroundColor: styles.cardBgColor || '#ffffff', borderColor: styles.cardBorderColor || '#e5e7eb' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: styles.subtitleColor || '#6b7280' }}>{cardTitle}</span>
        {CardIcon && (
          <div className="rounded-lg p-2" style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#eef2ff', color: styles.accentColor || '#4f46e5' }}>
            <CardIcon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold" style={{ color: styles.textColor || '#111827' }}>{cardValue}</span>
        {cardChange && (
          <Badge variant={isPos ? 'emerald' : 'rose'} size="sm">
            {isPos ? `+${cardChange}` : `-${cardChange}`}
          </Badge>
        )}
      </div>
    </div>
  );
};

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  styles?: any;
  block?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  styles = {},
  block
}) => {
  const cardTitle = title || block?.title || 'No data available';
  const cardDesc = description || block?.description || 'Get started by creating a new entry.';
  const btnText = actionText || block?.actionText || 'Create New';

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center"
      style={{ backgroundColor: styles.cardBgColor || '#f9fafb', borderColor: styles.cardBorderColor || '#e5e7eb' }}
    >
      <div className="mb-3 rounded-full p-4" style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#eef2ff', color: styles.accentColor || '#4f46e5' }}>
        <Inbox className="h-8 w-8" />
      </div>
      <h4 className="text-lg font-bold" style={{ color: styles.textColor || '#111827' }}>{cardTitle}</h4>
      <p className="text-sm font-medium leading-relaxed mt-1 max-w-sm" style={{ color: styles.subtitleColor || '#6b7280' }}>{cardDesc}</p>
      {btnText && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:opacity-90"
          style={{ backgroundColor: styles.accentColor || '#4f46e5', color: '#ffffff' }}
        >
          {btnText}
        </button>
      )}
    </div>
  );
};

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  styles?: any;
  block?: any;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:text-indigo-600"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of{' '}
        <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:text-indigo-600"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
