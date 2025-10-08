import type { DrawMode } from '@/types';

export interface KeyboardShortcut {
  key: string;
  mode: DrawMode;
  label: string;
}


export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'q', mode: 'wall', label: 'Q' },
  { key: 'e', mode: 'walkable', label: 'E' },
  { key: 's', mode: 'start', label: 'S' },
  { key: 'g', mode: 'goal', label: 'G' },
];


export const createShortcutMap = (): Map<string, DrawMode> => {
  const map = new Map<string, DrawMode>();
  KEYBOARD_SHORTCUTS.forEach(shortcut => {
    map.set(shortcut.key.toLowerCase(), shortcut.mode);
  });
  return map;
};


export const getShortcutLabel = (mode: DrawMode): string => {
  const shortcut = KEYBOARD_SHORTCUTS.find(s => s.mode === mode);
  return shortcut?.label || '';
};


export const createKeyboardHandler = (
  onModeChange: (mode: DrawMode) => void
): ((e: KeyboardEvent) => void) => {
  const shortcutMap = createShortcutMap();
  
  return (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

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