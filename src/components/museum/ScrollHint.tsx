'use client';

import { useEffect, useState } from 'react';

// One-time hint so visitors know the museum is walked by scrolling.
export default function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    const t = setTimeout(hide, 9000);
    window.addEventListener('wheel', hide, { once: true, passive: true });
    window.addEventListener('touchmove', hide, { once: true, passive: true });
    window.addEventListener('keydown', hide, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('wheel', hide);
      window.removeEventListener('touchmove', hide);
      window.removeEventListener('keydown', hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        padding: '10px 18px',
        background: 'rgba(20, 20, 20, 0.72)',
        border: '1px solid rgba(201, 169, 97, 0.4)',
        color: '#E8E4DC',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{ color: '#C9A961', fontSize: 14 }}>↕</span>
      Scroll to walk the museum
    </div>
  );
}
