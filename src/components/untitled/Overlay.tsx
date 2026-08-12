import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  styles?: any;
  block?: any;
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 @sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${modalSizes[size]} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 z-10 transform transition-all`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && <h3 className="text-xl font-bold -900 dark:">{title}</h3>}
            {description && <p className="text-sm font-medium leading-relaxed -500 dark:-400 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="my-2">{children}</div>
        {footer && <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};
