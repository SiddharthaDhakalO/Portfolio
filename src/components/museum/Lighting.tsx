'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { GALLERY_EXHIBIT_SLOTS, type ExhibitSlot } from '@/lib/exhibitSlots';
import { PROJECTS } from '@/lib/projects';

const WARM = '#FFE0B0';
const CEILING_Y = 4.8;
const ACCENT_OFFSET = 1.6;

type SpotProps = {
  position: [number, number, number];
  target: [number, number, number];
  intensity?: number;
  angle?: number;
  penumbra?: number;
  distance?: number;
  castShadow?: boolean;
};

function Spot({
  position,
  target,
  intensity = 22,
  angle = Math.PI / 4,
  penumbra = 0.6,
  distance = 14,
  castShadow = false,
}: SpotProps) {
  const targetObj = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <primitive object={targetObj} position={target} />
      <spotLight
        position={position}
        target={targetObj}
        color={WARM}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        decay={1.5}
        castShadow={castShadow}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0005}
      />
    </>
  );
}

function accentPosFor(slot: ExhibitSlot): [number, number, number] {
  const [px, , pz] = slot.position;
  const ry = slot.rotation[1];
  if (Math.abs(ry + Math.PI / 2) < 0.1) return [px - ACCENT_OFFSET, CEILING_Y, pz];
  if (Math.abs(ry - Math.PI / 2) < 0.1) return [px + ACCENT_OFFSET, CEILING_Y, pz];
  return [px, CEILING_Y, pz + ACCENT_OFFSET];
}

const PLINTH_LIGHTS: { center: [number, number, number] }[] = [
  { center: [-12, 1.4, 0] },
  { center: [12, 1.4, 0] },
  { center: [0, 1.4, 10] },
];

// Soft fill per wing so no room ever reads as unlit.
const ROOM_FILLS: { pos: [number, number, number]; intensity: number }[] = [
  { pos: [0, 4, -12], intensity: 5.5 }, // gallery
  { pos: [-12, 4, 0], intensity: 5.5 }, // studio
  { pos: [12, 4, 0], intensity: 5.5 }, // archive
  { pos: [0, 4, 10], intensity: 5 }, // gift shop — glows through the glass at dusk
];

// Golden-hour sun: low in the north-west so the facade and plaza catch a warm
// raking light and the building throws a long shadow across the forecourt.
function Sun() {
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0, 14);
    return o;
  }, []);
  return (
    <>
      <primitive object={target} />
      <directionalLight
        position={[-30, 9, 40]}
        target={target}
        color="#FFB878"
        intensity={2.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {/* Cool dusk fill from the east so shadows stay readable, not black. */}
      <directionalLight position={[24, 10, 30]} color="#B9C7D8" intensity={0.35} />
    </>
  );
}

export default function Lighting() {
  const exhibitCount = Math.min(PROJECTS.length, GALLERY_EXHIBIT_SLOTS.length);
  const exhibitSlots = GALLERY_EXHIBIT_SLOTS.slice(0, exhibitCount);

  return (
    <>
      {/* Base fill: warm dusk ambient outside, bright gallery inside. */}
      <hemisphereLight args={['#FFE9CE', '#8E8471', 0.9]} />

      <Sun />

      {/* Skylight downwash through the atrium hole. */}
      <pointLight
        position={[0, 6.6, 0]}
        color="#FFF3DC"
        intensity={14}
        distance={16}
        decay={1.4}
      />

      {/* Atrium overhead — the only shadow-casting light. */}
      <Spot
        position={[0, CEILING_Y, 0]}
        target={[0, 0, 0]}
        intensity={16}
        angle={Math.PI / 3.5}
        penumbra={0.7}
        distance={10}
        castShadow
      />

      {/* Wing fills. */}
      {ROOM_FILLS.map((f, i) => (
        <pointLight
          key={`fill-${i}`}
          position={f.pos}
          color="#FFF1DD"
          intensity={f.intensity}
          distance={12}
          decay={1.6}
        />
      ))}

      {/* Gallery accents — one narrow warm cone per framed work. */}
      {exhibitSlots.map((slot, i) => (
        <Spot
          key={`exhibit-spot-${i}`}
          position={accentPosFor(slot)}
          target={slot.position}
          intensity={26}
          angle={Math.PI / 9}
          penumbra={0.45}
          distance={5}
        />
      ))}

      {/* Plinth accents. */}
      {PLINTH_LIGHTS.map((p, i) => (
        <Spot
          key={`plinth-spot-${i}`}
          position={[p.center[0], CEILING_Y, p.center[2]]}
          target={p.center}
          intensity={20}
          angle={Math.PI / 5}
          penumbra={0.6}
          distance={6}
        />
      ))}
    </>
  );
}
