import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { keys: ['⌘K', 'Ctrl+K'], description: 'Open command palette' },
  { keys: ['⌘S', 'Ctrl+S'], description: 'Save current changes' },
  { keys: ['⌘Z', 'Ctrl+Z'], description: 'Undo' },
  { keys: ['⌘⇧Z', 'Ctrl+Shift+Z'], description: 'Redo' },
  { keys: ['⌘D', 'Ctrl+D'], description: 'Duplicate selected' },
  { keys: ['⌘/'] , description: 'Search / filter' },
  { keys: ['⌘B'], description: 'Toggle sidebar' },
  { keys: ['⌘P'], description: 'Quick page navigation' },
  { keys: ['Escape'], description: 'Close modal / cancel' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['⌘Enter', 'Ctrl+Enter'], description: 'Submit form / save' },
  { keys: ['⌘⇧P', 'Ctrl+Shift+P'], description: 'Publish page' },
];

interface KeyboardShortcutsProps {
  additionalShortcuts?: Shortcut[];
}

export function KeyboardShortcuts({ additionalShortcuts = [] }: KeyboardShortcutsProps) {
  const [open, setOpen] = useState(false);
  const allShortcuts = [...DEFAULT_SHORTCUTS, ...additionalShortcuts];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Keyboard size={15} />
                  </div>
                  <h2 className="text-sm font-extrabold text-slate-800">Keyboard Shortcuts</h2>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-1">
                {allShortcuts.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5">
                    <span className="text-xs font-medium text-slate-600">{s.description}</span>
                    <div className="flex gap-1">
                      {s.keys.map((key, ki) => (
                        <kbd key={ki} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-mono font-bold text-slate-600 shadow-xs">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4 pt-2 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 font-medium">Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[9px] font-mono">?</kbd> to toggle this panel</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default KeyboardShortcuts;
