import type { DrawMode } from '@/types';

export interface KeyboardShortcut {
  key: string;
  mode: DrawMode;
  label: string;
}

/**
 * Keyboard shortcut mappings for draw modes
 * Q = Wall, E = Walkable, S = Start, G = Goal
 */
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'q', mode: 'wall', label: 'Q' },
  { key: 'e', mode: 'walkable', label: 'E' },
  { key: 's', mode: 'start', label: 'S' },
  { key: 'g', mode: 'goal', label: 'G' },
];

/**
 * Creates a keyboard shortcut map for quick lookup
 */
export const createShortcutMap = (): Map<string, DrawMode> => {
  const map = new Map<string, DrawMode>();
  KEYBOARD_SHORTCUTS.forEach(shortcut => {
    map.set(shortcut.key.toLowerCase(), shortcut.mode);
  });
  return map;
};

/**
 * Gets the keyboard shortcut label for a given draw mode
 */
export const getShortcutLabel = (mode: DrawMode): string => {
  const shortcut = KEYBOARD_SHORTCUTS.find(s => s.mode === mode);
  return shortcut?.label || '';
};

/**
 * Hook-like function to handle keyboard shortcuts
 * Returns an event handler that can be attached to window
 */
export const createKeyboardHandler = (
  onModeChange: (mode: DrawMode) => void
): ((e: KeyboardEvent) => void) => {
  const shortcutMap = createShortcutMap();
  
  return (e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    // Ignore if any modifiers are pressed (except Shift which is fine)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    const key = e.key.toLowerCase();
    const mode = shortcutMap.get(key);
    
    if (mode) {
      onModeChange(mode);
      e.preventDefault();
    }
  };
};