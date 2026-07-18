'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getProjectsByWing } from '@/lib/projects';
import { GOLD } from '@/lib/floorplan';

// The procession: four identical human-scale banners flanking the walking
// axis. Nothing here may exceed 4 units — nothing in the plaza stands
// taller than the building — and the axis corridor plus the 10 units in
// front of the facade stay empty. The monolith states the museum's name;
// banners carry project names only.

const INK = '#0E0E0E';
const POLE_H = 4;
const POLE_R = 0.06;
const BANNER_W = 0.7;
const BANNER_H = 2.5;
const BANNER_TOP = 3.6; // fabric hangs from 3.6 down to 1.1
const SWAY = 0.01; // radians — barely perceptible

// One line along the west edge, parallel to the axis, ~6 units off it.
// The pool holds the west flank until z ≈ 30, so the line starts behind it —
// comfortably more than 10 units back from the facade (z = 14).
const BANNER_X = -6;
const BANNER_Z0 = 31;
const BANNER_SPACING = 5;

// All textures are generated in code; no image files. The text is measured
// and the font shrunk until it fits the fabric, so long names never overflow.
function makeBannerTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Thin gold keyline inset from the edge
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
  // Text runs down the banner; shrink to fit between the keylines.
  const label = text.toUpperCase();
  const maxLen = canvas.height - 120;
  ctx.save();
  ctx.translate(canvas.width / 2, 60);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = GOLD;
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = '7px';
  }
  let size = 44;
  do {
    ctx.font = `600 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    size -= 2;
  } while (size > 16 && ctx.measureText(label).width > maxLen);
  ctx.fillText(label, 0, 0);
  ctx.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Banner({
  position,
  text,
  phase,
  mirror,
}: {
  position: [number, number, number];
  text: string;
  phase: number;
  mirror?: boolean;
}) {
  const cloth = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => makeBannerTexture(text), [text]);

  useFrame(({ clock }) => {
    if (cloth.current) {
      cloth.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.7 + phase) * SWAY;
    }
  });

  return (
    // Mirroring turns the arm so the fabric always hangs toward the axis.
    <group position={position} rotation={[0, mirror ? Math.PI : 0, 0]}>
      {/* Slim gold pole with a short arm the fabric hangs from */}
      <mesh position={[0, POLE_H / 2, 0]} castShadow>
        <cylinderGeometry args={[POLE_R, POLE_R, POLE_H, 10]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.28, BANNER_TOP + 0.1, 0]} castShadow>
        <boxGeometry args={[0.56, 0.05, 0.05]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* The fabric, pivoting at its hanging edge */}
      <group position={[0.42, BANNER_TOP, 0]}>
        <mesh ref={cloth} position={[0, -BANNER_H / 2, 0]} castShadow>
          <boxGeometry args={[BANNER_W, BANNER_H, 0.02]} />
          <meshStandardMaterial map={texture} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export default function PlazaApproach() {
  const texts = useMemo(
    () =>
      getProjectsByWing('gallery')
        .slice(0, 4)
        .map((p) => p.title.split('—')[0].trim()),
    [],
  );

  return (
    <group>
      {texts.map((text, i) => (
        <Banner
          key={text}
          position={[BANNER_X, 0, BANNER_Z0 + i * BANNER_SPACING]}
          text={text}
          phase={i * 1.7}
        />
      ))}
    </group>
  );
}
