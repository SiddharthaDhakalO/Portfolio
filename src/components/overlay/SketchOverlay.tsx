'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMuseumStore } from '@/lib/useMuseumStore';
import { useSketchStore } from '@/lib/useSketchStore';

const SIZE = 512;
const PAPER = '#F5F1E8';
const COLORS = ['#2A2622', '#A08448', '#8A4B35', '#3E4A5A', '#4E6E3C'];
const BRUSHES = [4, 8, 16];

export default function SketchOverlay() {
  const isOpen = useMuseumStore((s) => s.activeOverlay === 'sketch');
  const close = useMuseumStore((s) => s.closeOverlay);
  const addSketch = useSketchStore((s) => s.addSketch);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [color, setColor] = useState(COLORS[0]);
  const [brush, setBrush] = useState(BRUSHES[1]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Fresh paper every time the pad opens.
  useEffect(() => {
    if (!isOpen) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, SIZE, SIZE);
    setDirty(false);
  }, [isOpen]);

  const toCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * SIZE,
      y: ((e.clientY - rect.top) / rect.height) * SIZE,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = toCanvasCoords(e);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext('2d');
    if (!ctx) return;
    const pt = toCanvasCoords(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = brush;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    last.current = pt;
    if (!dirty) setDirty(true);
  };

  const onPointerUp = () => {
    drawing.current = false;
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, SIZE, SIZE);
    setDirty(false);
  };

  const pin = () => {
    const canvas = canvasRef.current;
    if (!canvas || !dirty) return;
    addSketch(canvas.toDataURL('image/png'));
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 14, 14, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Leave a sketch on the visitor wall"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#141414',
              border: '1px solid rgba(201, 169, 97, 0.4)',
              padding: '24px 24px 20px',
              width: 'min(480px, 92vw)',
              color: '#E8E4DC',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#C9A961',
                    marginBottom: 4,
                  }}
                >
                  The Visitor Wall
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 24,
                    fontWeight: 500,
                  }}
                >
                  Leave a sketch
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(201, 169, 97, 0.5)',
                  color: '#C9A961',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                display: 'block',
                cursor: 'crosshair',
                touchAction: 'none',
                border: '1px solid rgba(201, 169, 97, 0.25)',
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 14,
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Colour ${c}`}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: c,
                      border:
                        color === c
                          ? '2px solid #C9A961'
                          : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
                <span style={{ width: 10 }} />
                {BRUSHES.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrush(b)}
                    aria-label={`Brush ${b}px`}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'transparent',
                      border:
                        brush === b
                          ? '1px solid #C9A961'
                          : '1px solid rgba(201,169,97,0.25)',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: b * 0.7,
                        height: b * 0.7,
                        borderRadius: '50%',
                        background: '#E8E4DC',
                        display: 'block',
                      }}
                    />
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={clear}
                  style={{
                    padding: '9px 14px',
                    background: 'transparent',
                    border: '1px solid rgba(201, 169, 97, 0.45)',
                    color: '#C9A961',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={pin}
                  disabled={!dirty}
                  style={{
                    padding: '9px 16px',
                    background: dirty ? '#C9A961' : 'rgba(201,169,97,0.25)',
                    border: 'none',
                    color: '#0E0E0E',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: dirty ? 'pointer' : 'default',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                  }}
                >
                  Pin to the wall
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
