'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

const PANEL_TRANSITION = {
  type: 'tween' as const,
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

const BACKDROP_TRANSITION = { duration: 0.25 };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ariaLabelledBy: string;
  children: ReactNode;
};

export default function OverlayPanel({ isOpen, onClose, ariaLabelledBy, children }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={BACKDROP_TRANSITION}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 14, 14, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 50,
          }}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={PANEL_TRANSITION}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(560px, 100vw)',
              height: '100dvh',
              background: '#141414',
              borderLeft: '1px solid rgba(201, 169, 97, 0.4)',
              color: '#E8E4DC',
              overflowY: 'auto',
              position: 'relative',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 16,
                right: 20,
                background: 'transparent',
                border: '1px solid rgba(201, 169, 97, 0.5)',
                color: '#C9A961',
                width: 36,
                height: 36,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'inherit',
                zIndex: 1,
              }}
            >
              ×
            </button>
            {children}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
