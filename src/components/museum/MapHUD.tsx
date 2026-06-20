'use client';

import { useState } from 'react';
import { cameraBus } from '@/lib/cameraBus';
import { ROOM_IDS, useMuseumStore, type RoomId } from '@/lib/useMuseumStore';
import { ROOMS } from './MuseumShell';

const ROOM_LABELS: Record<RoomId, string> = {
  atrium: 'Atrium',
  gallery: 'Gallery',
  studio: 'Studio',
  archive: 'Archive',
  giftshop: 'Gift Shop',
};

const ROOM_LETTERS: Record<RoomId, string> = {
  atrium: 'A',
  gallery: 'G',
  studio: 'S',
  archive: 'R',
  giftshop: '$',
};

// World coords used directly. World x → SVG x; world z → SVG y. Negative z
// (the gallery wing) ends up at the top of the map, which matches the user's
// POV: they spawn near the gift-shop and look toward the gallery.
const PAD = 4;
const MIN_X = -17 - PAD;
const MIN_Y = -17 - PAD;
const VIEW_W = 34 + PAD * 2;
const VIEW_H = 30 + PAD * 2;

export default function MapHUD() {
  const currentRoom = useMuseumStore((s) => s.currentRoom);
  const [hovered, setHovered] = useState<RoomId | null>(null);

  const go = (id: string) => cameraBus.glideToWaypoint(id);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 40,
        background: 'rgba(20, 20, 20, 0.78)',
        border: '1px solid rgba(201, 169, 97, 0.35)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        padding: '12px 14px 14px',
        width: 200,
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        color: '#E8E4DC',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C9A961',
          }}
        >
          Floor plan
        </span>
        <span
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 13,
            color: 'rgba(232, 228, 220, 0.78)',
          }}
        >
          {ROOM_LABELS[currentRoom]}
        </span>
      </div>

      <svg
        viewBox={`${MIN_X} ${MIN_Y} ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        style={{ display: 'block', height: 'auto' }}
        role="img"
        aria-label="Museum floor plan navigation"
      >
        {ROOMS.map((room) => {
          const id = room.id as RoomId;
          const isCurrent = currentRoom === id;
          const isHovered = hovered === id;
          const [cx, cz] = room.center;
          const [w, d] = room.size;

          const fill = isCurrent
            ? 'rgba(201, 169, 97, 0.32)'
            : isHovered
              ? 'rgba(201, 169, 97, 0.12)'
              : 'rgba(20, 20, 20, 0.7)';
          const stroke = isCurrent || isHovered ? '#C9A961' : 'rgba(201, 169, 97, 0.45)';
          const strokeWidth = isCurrent ? 0.45 : 0.25;
          const labelColor = isCurrent
            ? '#C9A961'
            : isHovered
              ? '#E8E4DC'
              : 'rgba(232, 228, 220, 0.55)';

          return (
            <g
              key={id}
              onClick={() => go(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered((h) => (h === id ? null : h))}
              style={{ cursor: 'pointer' }}
            >
              <title>{ROOM_LABELS[id]}</title>
              <rect
                x={cx - w / 2}
                y={cz - d / 2}
                width={w}
                height={d}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <text
                x={cx}
                y={cz + 0.9}
                fill={labelColor}
                fontSize={2.6}
                textAnchor="middle"
                style={{
                  pointerEvents: 'none',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                {ROOM_LETTERS[id]}
              </text>
            </g>
          );
        })}
      </svg>

      <button
        onClick={() => go('atrium')}
        disabled={currentRoom === 'atrium'}
        style={{
          marginTop: 12,
          width: '100%',
          padding: '8px 10px',
          background: 'transparent',
          border: '1px solid rgba(201, 169, 97, 0.45)',
          color: currentRoom === 'atrium' ? 'rgba(201, 169, 97, 0.35)' : '#C9A961',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          cursor: currentRoom === 'atrium' ? 'default' : 'pointer',
        }}
      >
        ← Back to atrium
      </button>

      {/* Hidden but accessible: also exposes room nav as a plain button list. */}
      <ul
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          margin: -1,
          padding: 0,
        }}
      >
        {ROOM_IDS.map((id) => (
          <li key={id}>
            <button onClick={() => go(id)}>{ROOM_LABELS[id]}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
