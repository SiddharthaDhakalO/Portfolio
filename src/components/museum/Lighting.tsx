'use client';

import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { GALLERY_EXHIBIT_SLOTS, type ExhibitSlot } from '@/lib/exhibitSlots';
import { PROJECTS } from '@/lib/projects';

const WARM = '#FFD9A0';
const CEILING_Y = 3.8;
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

// Spot that actually aims at its target. A SpotLight aims at its `target` Object3D;
// we mount one into the scene via <primitive> so its transform is respected.
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
        decay={1.6}
        castShadow={castShadow}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0005}
      />
    </>
  );
}

// Spot lives ACCENT_OFFSET units in front of the exhibit (along its outward
// normal) at ceiling height, aimed at the exhibit's centre. Rotation y on the
// slot tells us which wall the exhibit hangs on.
function accentPosFor(slot: ExhibitSlot): [number, number, number] {
  const [px, , pz] = slot.position;
  const ry = slot.rotation[1];
  if (Math.abs(ry + Math.PI / 2) < 0.1) return [px - ACCENT_OFFSET, CEILING_Y, pz]; // east wall, faces -x
  if (Math.abs(ry - Math.PI / 2) < 0.1) return [px + ACCENT_OFFSET, CEILING_Y, pz]; // west wall, faces +x
  return [px, CEILING_Y, pz + ACCENT_OFFSET]; // south wall, faces +z
}

const PLINTH_LIGHTS: { center: [number, number, number] }[] = [
  { center: [-12, 1.4, 0] }, // studio
  { center: [12, 1.4, 0] }, // archive
  { center: [0, 1.4, 10] }, // giftshop
];

export default function Lighting() {
  const exhibitCount = Math.min(PROJECTS.length, GALLERY_EXHIBIT_SLOTS.length);
  const exhibitSlots = GALLERY_EXHIBIT_SLOTS.slice(0, exhibitCount);

  return (
    <>
      {/* Atrium overhead — broad warm pool centred on the hub. Only light that
          casts a real-time shadow, for drama on the central floor. */}
      <Spot
        position={[0, CEILING_Y, 0]}
        target={[0, 0, 0]}
        intensity={32}
        angle={Math.PI / 3.5}
        penumbra={0.7}
        distance={12}
        castShadow
      />

      {/* Gallery — one narrow accent per exhibit, aimed at the framed work. */}
      {exhibitSlots.map((slot, i) => (
        <Spot
          key={`exhibit-spot-${i}`}
          position={accentPosFor(slot)}
          target={slot.position}
          intensity={32}
          angle={Math.PI / 9}
          penumbra={0.5}
          distance={5}
        />
      ))}

      {/* Plinth accents — tight cones straight down onto each plinth top. */}
      {PLINTH_LIGHTS.map((p, i) => (
        <Spot
          key={`plinth-spot-${i}`}
          position={[p.center[0], CEILING_Y, p.center[2]]}
          target={p.center}
          intensity={26}
          angle={Math.PI / 5}
          penumbra={0.6}
          distance={6}
        />
      ))}

      {/* Soft baked-look ground shadow under walls. Computed once on load. */}
      <AccumulativeShadows
        frames={30}
        alphaTest={0.85}
        scale={40}
        position={[0, 0.01, -2]}
        color="#000000"
        opacity={0.6}
      >
        <RandomizedLight
          amount={4}
          radius={5}
          ambient={0.5}
          intensity={Math.PI}
          position={[5, 10, -5]}
          bias={0.001}
        />
      </AccumulativeShadows>
    </>
  );
}
