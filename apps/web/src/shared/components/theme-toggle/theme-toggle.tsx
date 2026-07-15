'use client';

import { useEffect, useSyncExternalStore } from 'react';

type ThemeMode = 'light' | 'dark';

const storageKey = 'wormarket-theme';
const themeChangeEvent = 'wormarket-theme-change';

function applyTheme(mode: ThemeMode): void {
  document.documentElement.dataset['theme'] = mode;
}

function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.localStorage.getItem(storageKey) === 'dark' ? 'dark' : 'light';
}

function getServerMode(): ThemeMode {
  return 'light';
}

function subscribeToThemeChanges(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribeToThemeChanges, getStoredMode, getServerMode);
  const label = mode === 'dark' ? 'Dimension luminosa' : 'Dimension oscura';

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  function toggleTheme() {
    const nextMode = mode === 'dark' ? 'light' : 'dark';

    window.localStorage.setItem(storageKey, nextMode);
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <button
      aria-pressed={mode === 'dark'}
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      {label}
    </button>
  );
}
