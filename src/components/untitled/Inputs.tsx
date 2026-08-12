import React, { useState } from 'react';
import { LucideIcon, Eye, EyeOff, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hintText?: string;
  error?: string;
  iconLeading?: LucideIcon;
  iconTrailing?: LucideIcon;
  prefixText?: string;
  suffixText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  hintText,
  error,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  prefixText,
  suffixText,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative flex items-center rounded-lg shadow-sm">
        {prefixText && (
          <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
            {prefixText}
          </span>
        )}
        {IconLeading && (
          <div className="absolute left-3 pointer-events-none text-gray-400">
            <IconLeading className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={currentType}
          className={`w-full px-3.5 py-2 text-sm text-gray-900 bg-white border rounded-lg transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500 ${
            IconLeading ? 'pl-9' : ''
          } ${IconTrailing || isPassword ? 'pr-9' : ''} ${
            prefixText ? 'rounded-l-none' : ''
          } ${suffixText ? 'rounded-r-none' : ''} ${
            error
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 dark:border-red-800'
              : 'border-gray-300 dark:border-gray-700'
          } ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : IconTrailing ? (
          <div className="absolute right-3 pointer-events-none text-gray-400">
            <IconTrailing className="w-4 h-4" />
          </div>
        ) : null}
        {suffixText && (
          <span className="inline-flex items-center px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
            {suffixText}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : hintText ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hintText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export interface TagInputProps {
  label?: string;
  tags?: string[];
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (index: number) => void;
  placeholder?: string;
  styles?: any;
  block?: any;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags = [],
  onAddTag,
  onRemoveTag,
  placeholder,
  styles = {},
  block
}) => {
  const [inputValue, setInputValue] = useState('');
  const tagLabel = label || block?.label;
  const tagList = block?.tags?.length ? block.tags : tags;
  const tagPlaceholder = placeholder || block?.placeholder || 'Add tag and press Enter...';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (onAddTag) onAddTag(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {tagLabel && <label className="text-sm font-medium" style={{ color: styles.textColor || '#374151' }}>{tagLabel}</label>}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border p-2 focus-within:ring-2"
        style={{
          backgroundColor: styles.inputBgColor || '#ffffff',
          borderColor: styles.inputBorderColor || '#d1d5db',
          '--tw-ring-color': styles.accentColor || '#4f46e5'
        } as any}
      >
        {tagList.map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: styles.accentColor ? `${styles.accentColor}1A` : '#eef2ff', color: styles.accentColor || '#4338ca' }}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag && onRemoveTag(index)}
              className="hover:opacity-75"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tagList.length === 0 ? tagPlaceholder : ''}
          className="min-w-[120px] flex-1 bg-transparent text-sm focus:outline-none"
          style={{ color: styles.textColor || '#111827', '--tw-placeholder-color': styles.subtitleColor || '#6b7280' } as any}
        />
      </div>
    </div>
  );
};
