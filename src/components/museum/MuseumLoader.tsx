'use client';

import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ConcentricRings from '@/components/ConcentricRings';

// Maximum time the loader will stay on screen if drei never reports loading
// activity (e.g. the scene has no suspended textures to track). Without this
// the loader would stay forever in that edge case.
const SAFETY_MS = 4500;
const HIDE_GRACE_MS = 350;

export default function MuseumLoader() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);
  const hadActivity = useRef(false);

  useEffect(() => {
    if (active) hadActivity.current = true;
  }, [active]);

  useEffect(() => {
    if (hadActivity.current && !active && progress >= 100) {
      const t = setTimeout(() => setVisible(false), HIDE_GRACE_MS);
      return () => clearTimeout(t);
    }
  }, [active, progress]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), SAFETY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          aria-hidden={!visible}
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0E0E0E',
            color: '#E8E4DC',
            display: 'grid',
            placeItems: 'center',
            zIndex: 80,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'grid',
              placeItems: 'center',
              width: 'min(420px, 80vw)',
              height: 'min(420px, 80vw)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                opacity: 0.85,
              }}
            >
              <ConcentricRings size="min(420px, 80vw)" spinSeconds={120} />
            </div>

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: 22,
                  margin: 0,
                  letterSpacing: '0.01em',
                  color: '#E8E4DC',
                }}
              >
                The museum is opening…
              </p>

              <div
                style={{
                  width: 240,
                  height: 2,
                  background: 'rgba(201, 169, 97, 0.18)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{ height: '100%', background: '#C9A961' }}
                />
              </div>

              <div
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  color: '#C9A961',
                }}
              >
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
