import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeading?: LucideIcon;
  iconTrailing?: LucideIcon;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm border border-transparent',
  secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-500 border border-transparent dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60',
  tertiary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 border border-transparent dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
  outline: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm border border-transparent',
  link: 'bg-transparent text-indigo-600 hover:text-indigo-800 underline-offset-4 hover:underline focus:ring-indigo-500 p-0 shadow-none dark:text-indigo-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-4.5 py-2.5 text-base rounded-xl gap-2.5',
  xl: 'px-6 py-3 text-lg rounded-xl gap-3',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : IconLeading ? (
        <IconLeading className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!isLoading && IconTrailing && <IconTrailing className="w-4 h-4 shrink-0" />}
    </button>
  );
});

Button.displayName = 'Button';

export interface ButtonGroupProps {
  children?: React.ReactNode;
  className?: string;
  styles?: any;
  block?: any;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '', styles = {}, block }) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`} style={{ borderRadius: styles.borderRadius || '0.5rem' }}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const element = child as React.ReactElement<{ className?: string, style?: any }>;
        return React.cloneElement(element, {
          className: `${element.props.className || ''} ${
            index === 0
              ? 'rounded-r-none'
              : index === React.Children.count(children) - 1
              ? 'rounded-l-none -ml-px'
              : 'rounded-none -ml-px'
          }`,
          style: {
            ...element.props.style,
            ...(styles.accentColor && { backgroundColor: styles.accentColor, borderColor: styles.accentColor }),
          }
        });
      })}
    </div>
  );
};
