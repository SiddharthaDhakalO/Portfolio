'use client';

import type { ViewMode } from '@/lib/useDeviceMode';

type Props = {
  current: ViewMode;
  setMode: (m: ViewMode) => void;
};

export default function ViewToggle({ current, setMode }: Props) {
  const next: ViewMode = current === '3d' ? '2d' : '3d';
  const label = current === '3d' ? 'Switch to Classic View' : 'Enter the 3D Museum';

  return (
    <button
      onClick={() => setMode(next)}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 60,
        padding: '8px 14px',
        background: 'rgba(20, 20, 20, 0.78)',
        border: '1px solid rgba(201, 169, 97, 0.45)',
        color: '#C9A961',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 11,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      {label}
    </button>
  );
}
