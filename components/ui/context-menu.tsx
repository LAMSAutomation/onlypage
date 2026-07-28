import React, { useState, useEffect, useRef, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContextMenuItem {
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
  variant?: 'default' | 'danger';
}

interface ContextMenuProps {
  /** Items to show in the menu */
  items: ContextMenuItem[];
  /** Trigger element — the component that receives the right-click */
  children: React.ReactNode;
  /** Optional class for the wrapper */
  className?: string;
  /** Unique ID for nested menus */
  id?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContextMenu({ items, children, className = '', id }: ContextMenuProps) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const uid = id || `ctx-${Math.random().toString(36).slice(2, 8)}`;

  const handleContext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Position menu within viewport bounds
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - items.length * 40);
    setMenu({ x, y });
  }, [items.length]);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        close();
        return;
      }
      // Close if click is outside the menu
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    // Delay adding listener to avoid the right-click that opened the menu
    const timer = setTimeout(() => {
      document.addEventListener('click', handler);
      document.addEventListener('keydown', handler);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
    };
  }, [menu, close]);

  return (
    <>
      <div onContextMenu={handleContext} className={className}>
        {children}
      </div>

      {menu && (
        <div
          ref={menuRef}
          id={`ctx-menu-${uid}`}
          style={{ left: menu.x, top: menu.y, position: 'fixed' }}
          className="z-[9999] min-w-[180px] bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.divider && idx > 0 && <div className="mx-2 my-1 h-px bg-slate-100" />}
              <button
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    close();
                  }
                }}
                disabled={item.disabled}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  item.disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : item.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                {item.icon && <item.icon size={14} />}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Hook for easy keyboard + context menu integration
// ---------------------------------------------------------------------------

export function useContextMenu() {
  const [openId, setOpenId] = useState<string | null>(null);

  const closeAll = useCallback(() => setOpenId(null), []);

  return {
    openId,
    setOpenId,
    closeAll,
  };
}

export default ContextMenu;
