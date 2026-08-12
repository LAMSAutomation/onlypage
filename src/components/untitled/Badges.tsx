import React from 'react';
import { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'gray' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: LucideIcon;
  pill?: boolean;
  className?: string;
  styles?: any;
  block?: any;
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string; border: string; dotBg: string }> = {
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    dotBg: 'bg-gray-500',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/70',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
    dotBg: 'bg-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/70',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dotBg: 'bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/70',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    dotBg: 'bg-amber-500',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/70',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
    dotBg: 'bg-rose-500',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/70',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
    dotBg: 'bg-sky-500',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
  lg: 'px-3 py-1 text-sm font-medium gap-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  size = 'md',
  dot = false,
  icon: Icon,
  pill = false,
  className = '',
}) => {
  const styles = variantClasses[variant];

  return (
    <span
      className={`inline-flex items-center border ${pill ? 'rounded-full' : 'rounded-md'} ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dotBg}`} />}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};
