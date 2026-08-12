import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  indeterminate,
  className = '',
  id,
  checked,
  ...props
}, ref) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          className={`w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 ${className}`}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="text-sm leading-5">
          {label && (
            <label htmlFor={checkboxId} className="font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
              {label}
            </label>
          )}
          {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  styles?: any;
  block?: any;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  styles = {},
  block
}) => {
  const toggleLabel = label || block?.label;
  const toggleDesc = description || block?.description;
  const isChecked = block?.checked !== undefined ? block.checked : checked;
  const isDisabled = block?.disabled !== undefined ? block.disabled : disabled;

  return (
    <div className="flex items-center justify-between gap-4">
      {(toggleLabel || toggleDesc) && (
        <div className="flex flex-col">
          {toggleLabel && <span className="text-sm font-medium" style={{ color: styles.textColor || '#111827' }}>{toggleLabel}</span>}
          {toggleDesc && <span className="text-xs" style={{ color: styles.subtitleColor || '#6b7280' }}>{toggleDesc}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={isDisabled}
        onClick={() => !isDisabled && onChange && onChange(!isChecked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDisabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        style={{
          backgroundColor: isChecked ? (styles.accentColor || '#4f46e5') : (styles.cardBorderColor || '#e5e7eb'),
          '--tw-ring-color': styles.accentColor || '#4f46e5'
        } as any}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
