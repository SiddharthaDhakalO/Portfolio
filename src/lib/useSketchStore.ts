import { create } from 'zustand';

// Visitor sketches for the gift-shop wall. Currently persisted per-visitor in
// localStorage; to make the wall truly shared, swap load/save for API calls
// (the store shape is already backend-ready).
const STORAGE_KEY = 'museum-visitor-sketches';
const MAX_SKETCHES = 24;

type SketchStore = {
  sketches: string[]; // data URLs, newest first
  hydrated: boolean;
  hydrate: () => void;
  addSketch: (dataUrl: string) => void;
};

function load(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, MAX_SKETCHES) : [];
  } catch {
    return [];
  }
}

function save(sketches: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sketches));
  } catch {
    // Quota exceeded or private mode — the wall still works for the session.
  }
}

// A few hand-drawn-looking seeds so the wall never starts empty.
function makeSeeds(): string[] {
  if (typeof document === 'undefined') return [];
  const seeds: string[] = [];
  const draw = (fn: (ctx: CanvasRenderingContext2D, s: number) => void) => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#F5F1E8';
    ctx.fillRect(0, 0, 256, 256);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    fn(ctx, 256);
    seeds.push(c.toDataURL('image/png'));
  };

  // Smiley
  draw((ctx, s) => {
    ctx.strokeStyle = '#2A2622';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.4, s * 0.42, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2A2622';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.6, s * 0.42, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s / 2, s * 0.52, s * 0.15, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
  });

  // Little house
  draw((ctx, s) => {
    ctx.strokeStyle = '#8A4B35';
    ctx.lineWidth = 6;
    ctx.strokeRect(s * 0.3, s * 0.45, s * 0.4, s * 0.32);
    ctx.beginPath();
    ctx.moveTo(s * 0.25, s * 0.45);
    ctx.lineTo(s * 0.5, s * 0.22);
    ctx.lineTo(s * 0.75, s * 0.45);
    ctx.stroke();
    ctx.strokeRect(s * 0.45, s * 0.58, s * 0.12, s * 0.19);
  });

  // Star
  draw((ctx, s) => {
    ctx.strokeStyle = '#A08448';
    ctx.lineWidth = 6;
    ctx.beginPath();
    const cx = s / 2;
    const cy = s / 2;
    for (let i = 0; i <= 10; i++) {
      const r = i % 2 === 0 ? s * 0.32 : s * 0.14;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  });

  // "hi!" text-ish squiggle
  draw((ctx, s) => {
    ctx.strokeStyle = '#3E4A5A';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(s * 0.28, s * 0.3);
    ctx.lineTo(s * 0.28, s * 0.7);
    ctx.moveTo(s * 0.28, s * 0.5);
    ctx.quadraticCurveTo(s * 0.42, s * 0.38, s * 0.46, s * 0.7);
    ctx.moveTo(s * 0.6, s * 0.42);
    ctx.lineTo(s * 0.6, s * 0.7);
    ctx.moveTo(s * 0.6, s * 0.32);
    ctx.lineTo(s * 0.6, s * 0.33);
    ctx.moveTo(s * 0.74, s * 0.3);
    ctx.lineTo(s * 0.72, s * 0.58);
    ctx.moveTo(s * 0.72, s * 0.68);
    ctx.lineTo(s * 0.72, s * 0.7);
    ctx.stroke();
  });

  // Mountains
  draw((ctx, s) => {
    ctx.strokeStyle = '#4E6E3C';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(s * 0.15, s * 0.7);
    ctx.lineTo(s * 0.38, s * 0.35);
    ctx.lineTo(s * 0.52, s * 0.55);
    ctx.lineTo(s * 0.66, s * 0.3);
    ctx.lineTo(s * 0.85, s * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s * 0.75, s * 0.25, s * 0.06, 0, Math.PI * 2);
    ctx.stroke();
  });

  return seeds;
}

export const useSketchStore = create<SketchStore>((set, get) => ({
  sketches: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated || typeof window === 'undefined') return;
    let sketches = load();
    if (sketches.length === 0) {
      sketches = makeSeeds();
      save(sketches);
    }
    set({ sketches, hydrated: true });
  },
  addSketch: (dataUrl) => {
    const sketches = [dataUrl, ...get().sketches].slice(0, MAX_SKETCHES);
    save(sketches);
    set({ sketches });
  },
}));
