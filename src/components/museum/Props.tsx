'use client';

import * as THREE from 'three';

const WOOD_MID = '#8A6B4A';
const METAL_DARK = '#2A2622';
const GOLD = '#C9A961';

// Museum furniture only — sparse and believable. Decorative clutter reads as
// fake at this fidelity, so the rooms stay curated instead of "dressed".

function GalleryBench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.09, 0.55]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.55} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.19, 0]} castShadow>
          <boxGeometry args={[0.08, 0.38, 0.45]} />
          <meshStandardMaterial color={METAL_DARK} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DisplayCase({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial color={METAL_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.64, 0.04, 0.64]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.34, 0]}>
        <boxGeometry args={[0.52, 0.6, 0.52]} />
        <meshStandardMaterial
          color="#DCE8EC"
          transparent
          opacity={0.16}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 1.22, 0]} castShadow>
        <dodecahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function Props() {
  return (
    <group>
      {/* Atrium — a viewing seat squared up in front of each flagship display,
          long axis parallel to its wall. Point-symmetric, axis-aligned. */}
      <GalleryBench position={[-4, 0, 4]} rotationY={Math.PI / 2} />
      <GalleryBench position={[4, 0, -4]} rotationY={Math.PI / 2} />

      {/* Gallery — one bench in the centre of the walking loop, aligned to the
          room so you can sit and take in the back wall. */}
      <GalleryBench position={[0, 0, -12]} rotationY={0} />

      {/* Archive — a pair of glass display cases flanking the room axis */}
      <DisplayCase position={[12, 0, -4.6]} />
      <DisplayCase position={[12, 0, 4.6]} />
    </group>
  );
}
