'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { GALLERY_EXHIBIT_SLOTS, type ExhibitSlot } from '@/lib/exhibitSlots';
import { PROJECTS } from '@/lib/projects';

const WARM = '#FFE0B0';
// Accent fixtures hang from the y=6 ceiling slab, above the 4-high partitions.
const CEILING_Y = 5.7;
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

// Displays hang on partition faces at arbitrary angles now, so the accent
// fixture is offset straight out along the display's facing normal.
function accentPosFor(slot: ExhibitSlot): [number, number, number] {
  const [px, , pz] = slot.position;
  const ry = slot.rotation[1];
  return [
    px + Math.sin(ry) * ACCENT_OFFSET,
    CEILING_Y,
    pz + Math.cos(ry) * ACCENT_OFFSET,
  ];
}

const PLINTH_LIGHTS: { center: [number, number, number] }[] = [
  { center: [14.2, 1.4, 1.6] }, // studio
  { center: [5.4, 1.4, 10.8] }, // gift shop
];

// Soft fill per zone so no corner of the hall ever reads as unlit. (The
// archive is outdoors now — the sculpture garden reads from the sun alone.)
const ROOM_FILLS: { pos: [number, number, number]; intensity: number }[] = [
  { pos: [-13, 4.5, -1], intensity: 5.5 }, // gallery
  { pos: [13, 4.5, -1], intensity: 5.5 }, // studio
  { pos: [0, 4.5, -9], intensity: 4.5 }, // open south of the hall
  { pos: [5.5, 4.5, 11], intensity: 5 }, // gift shop — glows through the glass at dusk
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
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
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

      {/* Warm downwash pooling in the open centre of the hall. */}
      <pointLight
        position={[0, 5.6, 0]}
        color="#FFF3DC"
        intensity={10}
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
