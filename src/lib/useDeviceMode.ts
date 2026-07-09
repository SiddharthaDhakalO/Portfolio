'use client';

import { useEffect, useState } from 'react';

export type ViewMode = '3d' | '2d';

const STORAGE_KEY = 'museum-view-mode';

export function useDeviceMode() {
  const [isMobile, setIsMobile] = useState(false);
  const [override, setOverride] = useState<ViewMode | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === '3d' || saved === '2d') setOverride(saved);
    } catch {
      // Private mode / Safari quirks — fine, just fall back to defaults.
    }

    setReady(true);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const defaultMode: ViewMode = isMobile ? '2d' : '3d';
  const effectiveMode: ViewMode = override ?? defaultMode;

  const setMode = (m: ViewMode) => {
    setOverride(m);
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore
    }
  };

  return { ready, isMobile, effectiveMode, defaultMode, setMode };
}
