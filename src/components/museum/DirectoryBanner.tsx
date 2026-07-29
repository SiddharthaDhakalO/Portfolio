'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { getProjectsByWing } from '@/lib/projects';
import { GOLD } from '@/lib/floorplan';

// A single retractable roll-up (pull-up) banner standing at the head of the
// walking axis — the museum's directory. It replaces the row of flanking
// banners and the sculpture garden: one calm sign that lists everything on
// view. Its print is generated in code (no image files) from the project data,
// so adding or renaming a project in projects.ts updates the banner too.

const INK = '#0E0E0E';
const CREAM = '#E8E4DC';
const ALUMINIUM = '#C8C5BE';

// The panel: 0.84 wide × 2.0 tall, standing out of the base cassette.
const PANEL_W = 0.84;
const PANEL_H = 2.0;
const BASE_Y = 0.14; // fabric emerges here
const PANEL_CY = BASE_Y + PANEL_H / 2;

type Section = { name: string; items: string[] };

// A short title for the banner: the part before an em dash, trimmed.
const shortTitle = (t: string) => t.split('—')[0].trim();

/* ------------------------------------------------------------------ */
/* Printed face — canvas texture, laid out to fit however long the     */
/* directory grows.                                                    */
/* ------------------------------------------------------------------ */

function withLetterSpacing(ctx: CanvasRenderingContext2D, px: number) {
  if ('letterSpacing' in ctx) {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
  }
}

function makeDirectoryTexture(sections: Section[]): THREE.CanvasTexture {
  const W = 600;
  const H = 1440;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background: ink with a warm vertical wash, and a soft gold glow behind
  // the header — a nod to a printed graphic without breaking the palette.
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1A130D');
  bg.addColorStop(0.28, INK);
  bg.addColorStop(0.85, INK);
  bg.addColorStop(1, '#151009');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 250, 40, W / 2, 250, 460);
  glow.addColorStop(0, 'rgba(201,169,97,0.16)');
  glow.addColorStop(1, 'rgba(201,169,97,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 560);

  // Gold keyline inset from the edge.
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(22, 22, W - 44, H - 44);

  const cx = W / 2;
  const marginX = 58;

  // --- Header ---------------------------------------------------------
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = GOLD;
  withLetterSpacing(ctx, 9);
  ctx.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('THE MUSEUM OF', cx, 118);

  withLetterSpacing(ctx, 2);
  ctx.fillStyle = CREAM;
  ctx.font = '500 58px Georgia, "Times New Roman", serif';
  ctx.fillText('SIDDHARTHA', cx, 188);
  ctx.fillText('DHAKAL', cx, 250);

  withLetterSpacing(ctx, 0);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 80, 288);
  ctx.lineTo(cx + 80, 288);
  ctx.stroke();

  ctx.fillStyle = GOLD;
  withLetterSpacing(ctx, 15);
  ctx.font = '600 40px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('DIRECTORY', cx + 7, 352);

  ctx.fillStyle = 'rgba(232,228,220,0.55)';
  withLetterSpacing(ctx, 6);
  ctx.font = '500 18px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText("WHAT'S ON VIEW", cx + 3, 392);
  withLetterSpacing(ctx, 0);

  // --- Directory body, scaled to fit the remaining height -------------
  const areaTop = 470;
  const areaBottom = H - 120;
  const available = areaBottom - areaTop;

  const SH = { header: 42, gapUnder: 22, item: 46, sectionGap: 30 };
  let needed = 0;
  sections.forEach((s) => {
    needed += SH.header + SH.gapUnder + s.items.length * SH.item + SH.sectionGap;
  });
  const scale = Math.min(1, available / needed);
  const s = (v: number) => v * scale;

  let y = areaTop;
  ctx.textAlign = 'left';

  sections.forEach((section) => {
    // Section header: gold mono label, count on the right, hairline rule.
    ctx.fillStyle = GOLD;
    withLetterSpacing(ctx, 4);
    ctx.font = `600 ${Math.round(s(26))}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(section.name.toUpperCase(), marginX, y + s(26));

    withLetterSpacing(ctx, 0);
    ctx.textAlign = 'right';
    ctx.font = `600 ${Math.round(s(22))}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText(
      String(section.items.length).padStart(2, '0'),
      W - marginX,
      y + s(24),
    );

    const ruleY = y + s(SH.header) + s(6);
    ctx.strokeStyle = 'rgba(201,169,97,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, ruleY);
    ctx.lineTo(W - marginX, ruleY);
    ctx.stroke();

    y += s(SH.header) + s(SH.gapUnder);

    // Items: a gold tick and the title, shrunk to fit the width if needed.
    section.items.forEach((item) => {
      ctx.textAlign = 'left';
      ctx.fillStyle = GOLD;
      ctx.font = `600 ${Math.round(s(26))}px ui-monospace, monospace`;
      ctx.fillText('—', marginX, y + s(30));

      const textX = marginX + s(38);
      const maxW = W - marginX - textX;
      let fontPx = s(26);
      ctx.fillStyle = CREAM;
      let label = item;
      ctx.font = `400 ${Math.round(fontPx)}px Georgia, serif`;
      while (ctx.measureText(label).width > maxW && fontPx > s(17)) {
        fontPx -= 1;
        ctx.font = `400 ${Math.round(fontPx)}px Georgia, serif`;
      }
      while (ctx.measureText(label + '…').width > maxW && label.length > 4) {
        label = label.slice(0, -1);
      }
      if (label !== item) label = label.trimEnd() + '…';
      ctx.fillText(label, textX, y + s(30));

      y += s(SH.item);
    });

    y += s(SH.sectionGap);
  });

  // --- Footer ---------------------------------------------------------
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(cx, H - 92, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(232,228,220,0.5)';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('The collection is still growing.', cx, H - 60);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/* ------------------------------------------------------------------ */
/* The stand — a retractable roll-up banner: aluminium base cassette,   */
/* the printed panel, a back-pole and a top clamp rail.                 */
/* ------------------------------------------------------------------ */

export default function DirectoryBanner({
  position = [-3.6, 0, 40],
  rotationY = 0.3,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  const sections = useMemo<Section[]>(() => {
    const gallery = getProjectsByWing('gallery').map((p) => shortTitle(p.title));
    const archive = getProjectsByWing('archive').map((p) => shortTitle(p.title));
    return [
      { name: 'The Gallery', items: gallery },
      { name: 'The Archive', items: archive },
      { name: 'The Studio', items: ['About the maker'] },
      { name: 'Gift Shop', items: ['Contact & prints'] },
    ];
  }, []);

  const texture = useMemo(() => makeDirectoryTexture(sections), [sections]);

  const metal = { color: ALUMINIUM, metalness: 0.9, roughness: 0.3 } as const;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base cassette the fabric rolls into */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.94, 0.12, 0.3]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0.125, 0]} castShadow>
        <boxGeometry args={[0.88, 0.03, 0.22]} />
        <meshStandardMaterial {...metal} roughness={0.22} />
      </mesh>

      {/* Support pole behind the panel */}
      <mesh position={[0, PANEL_CY, -0.09]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, PANEL_H + 0.1, 12]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* Top clamp rail */}
      <mesh position={[0, BASE_Y + PANEL_H + 0.02, 0]} castShadow>
        <boxGeometry args={[0.9, 0.045, 0.06]} />
        <meshStandardMaterial {...metal} roughness={0.22} />
      </mesh>

      {/* Printed face + a plain dark backing */}
      <mesh position={[0, PANEL_CY, 0.006]} castShadow>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      <mesh position={[0, PANEL_CY, -0.006]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshStandardMaterial color={INK} roughness={0.9} />
      </mesh>
    </group>
  );
}
