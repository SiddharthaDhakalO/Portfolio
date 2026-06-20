'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConcentricRings from '@/components/ConcentricRings';

const FADE_MS = 700;

export default function EntrancePage() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    if (entering) return;
    setEntering(true);
    setTimeout(() => router.push('/museum'), FADE_MS);
  };

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100dvh',
        background: '#0E0E0E',
        color: '#E8E4DC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <ConcentricRings />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 580,
        }}
      >
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#C9A961',
            marginBottom: 28,
          }}
        >
          The Museum of
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontWeight: 500,
            fontSize: 'clamp(40px, 7vw, 78px)',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Siddhartha Dhakal
        </h1>

        <p
          style={{
            marginTop: 16,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 12,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(232, 228, 220, 0.6)',
          }}
        >
          Frontend Web Developer · Kathmandu
        </p>

        <p
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(16px, 1.7vw, 20px)',
            lineHeight: 1.55,
            margin: '28px 0 40px',
            color: 'rgba(232, 228, 220, 0.82)',
            maxWidth: 480,
          }}
        >
          A small, growing collection of interfaces, experiments, and things
          made while learning to build well.
        </p>

        <EnterButton onClick={handleEnter} disabled={entering} />

        <p
          style={{
            marginTop: 36,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(232, 228, 220, 0.4)',
          }}
        >
          Best experienced on a desktop · Use the map to move between rooms
        </p>
      </motion.div>

      <AnimatePresence>
        {entering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: FADE_MS / 1000 }}
            aria-hidden
            style={{
              position: 'fixed',
              inset: 0,
              background: '#0E0E0E',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function EnterButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const [hover, setHover] = useState(false);
  const filled = hover && !disabled;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: filled ? '#C9A961' : 'transparent',
        border: '1px solid #C9A961',
        color: filled ? '#0E0E0E' : '#C9A961',
        padding: '14px 30px',
        fontSize: 12,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        cursor: disabled ? 'wait' : 'pointer',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        fontWeight: 500,
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      Enter the Exhibition →
    </button>
  );
}
