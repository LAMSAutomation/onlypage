import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoOptions {
  maxHistory?: number;
}

interface UseUndoRedoReturn<T> {
  /** Current state */
  state: T;
  /** Set new state, pushing current to history */
  setState: (newState: T | ((prev: T) => T)) => void;
  /** Undo: go back one step */
  undo: () => void;
  /** Redo: go forward one step */
  redo: () => void;
  /** Can we undo? */
  canUndo: boolean;
  /** Can we redo? */
  canRedo: boolean;
  /** Clear all history */
  reset: (initialState: T) => void;
  /** History size */
  historySize: { past: number; future: number };
}

/**
 * Generic undo/redo hook for any state.
 * Tracks past and future states, with configurable max history.
 * Zero dependencies, pure TypeScript.
 */
export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions = {},
): UseUndoRedoReturn<T> {
  const { maxHistory = 50 } = options;
  const [state, setCurrentState] = useState<T>(initialState);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setCurrentState(prev => {
      const resolved = typeof newState === 'function' ? (newState as (prev: T) => T)(prev) : newState;
      pastRef.current = [...pastRef.current.slice(-maxHistory + 1), prev];
      futureRef.current = [];
      return resolved;
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const prev = pastRef.current[pastRef.current.length - 1];
    pastRef.current = pastRef.current.slice(0, -1);
    setCurrentState(current => {
      futureRef.current = [...futureRef.current, current];
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    setCurrentState(current => {
      pastRef.current = [...pastRef.current, current];
      return next;
    });
  }, []);

  const reset = useCallback((newInitial: T) => {
    pastRef.current = [];
    futureRef.current = [];
    setCurrentState(newInitial);
  }, []);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    reset,
    historySize: { past: pastRef.current.length, future: futureRef.current.length },
  };
}

export default useUndoRedo;
