'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GLASS_Z, CEILING_Y, ROOF_T, FLOOR_W, FLOOR_D } from '@/lib/floorplan';

// The building's front plane — the free-plan hall's glass curtain line.
export const FACADE_Z = GLASS_Z;

const WHITE = '#F2EFE8';
const CONCRETE = '#C7C1B4';
const PATH_STONE = '#DFD9CC';
const DARK = '#26231F';
const GLASS_TINT = '#BCD2D6';

const glassProps = {
  color: GLASS_TINT,
  transparent: true,
  opacity: 0.16,
  roughness: 0.06,
  metalness: 0.15,
  envMapIntensity: 1.4,
  depthWrite: false,
  side: THREE.DoubleSide,
} as const;

/* ------------------------------------------------------------------ */
/* Entrance facade: piers, glass curtain wall, sliding doors, canopy   */
/* ------------------------------------------------------------------ */

// Doors slide open when the visitor walks within range of the threshold.
function SlidingDoors() {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const open = useRef(0);

  useFrame(({ camera }, dt) => {
    const dx = camera.position.x;
    const dz = camera.position.z - FACADE_Z;
    const target = Math.hypot(dx, dz) < 8 ? 1 : 0;
    open.current += (target - open.current) * Math.min(1, 3.2 * dt);
    const slide = open.current * 1.9;
    if (left.current) left.current.position.x = -0.98 - slide;
    if (right.current) right.current.position.x = 0.98 + slide;
  });

  // Two 1.94-wide leaves fill the 4-unit gap between the shell's mullions.
  const panel = (
    <>
      <mesh position={[0, 1.64, 0]}>
        <boxGeometry args={[1.94, 3.2, 0.05]} />
        <meshStandardMaterial {...glassProps} opacity={0.22} />
      </mesh>
      {[-0.96, 0.96].map((x) => (
        <mesh key={x} position={[x, 1.64, 0]}>
          <boxGeometry args={[0.06, 3.28, 0.09]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
      {[0.035, 3.245].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.98, 0.07, 0.09]} />
          <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
    </>
  );

  return (
    <group position={[0, 0, FACADE_Z - 0.18]}>
      <group ref={left} position={[-0.98, 0, 0]}>{panel}</group>
      <group ref={right} position={[0.98, 0, 0]}>{panel}</group>
    </group>
  );
}

function Facade() {
  // The glass curtain wall itself (panes + gold mullions) is part of
  // MuseumShell — out here only the entry apparatus remains.
  return (
    <group>
      <SlidingDoors />

      {/* Cantilevered entry canopy on two thin steel columns */}
      <mesh position={[0, 4.35, FACADE_Z + 2.4]} castShadow>
        <boxGeometry args={[10, 0.5, 4.8]} />
        <meshStandardMaterial color={WHITE} roughness={0.8} />
      </mesh>
      {[-4.6, 4.6].map((x) => (
        <mesh key={x} position={[x, 2.05, FACADE_Z + 4.35]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 4.1, 16]} />
          <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}

      {/* Museum name on the canopy fascia */}
      <Text
        position={[0, 4.35, FACADE_Z + 4.81]}
        fontSize={0.24}
        color={DARK}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.28}
        fontWeight={600}
      >
        THE MUSEUM OF SIDDHARTHA DHAKAL
      </Text>

      {/* Warm downlights glowing under the canopy at dusk */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, 4.09, FACADE_Z + 2.4]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.12, 24]} />
          <meshStandardMaterial
            color="#FFE3B8"
            emissive="#FFE3B8"
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Roofline: one floating white slab over the whole dark glass hall    */
/* ------------------------------------------------------------------ */

const SLAB_H = 0.55;
// Sits on top of the shell's ceiling box and overhangs the envelope.
const SLAB_BASE = CEILING_Y + ROOF_T;

function Roofline() {
  return (
    <mesh position={[0, SLAB_BASE + SLAB_H / 2, 0]} castShadow>
      <boxGeometry args={[FLOOR_W + 1.2, SLAB_H, FLOOR_D + 1.2]} />
      <meshStandardMaterial color={WHITE} roughness={0.85} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Plaza: forecourt, reflecting pool, trees, benches, bollards, stele  */
/* ------------------------------------------------------------------ */

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 1.4, 10]} />
        <meshStandardMaterial color="#6E5541" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.95, 0]} scale={[1, 0.85, 1]} castShadow>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color="#7A8450" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.3, 2.55, 0.1]} castShadow>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#8A9158" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function ReflectingPool() {
  // Basin x ∈ [-8.5, -3], z ∈ [18, 30], west of the entry path.
  const copings: { pos: [number, number, number]; size: [number, number, number] }[] = [
    { pos: [-8.64, 0.08, 24], size: [0.28, 0.16, 12.56] },
    { pos: [-2.86, 0.08, 24], size: [0.28, 0.16, 12.56] },
    { pos: [-5.75, 0.08, 30.14], size: [5.5, 0.16, 0.28] },
    { pos: [-5.75, 0.08, 17.86], size: [5.5, 0.16, 0.28] },
  ];
  return (
    <group>
      {copings.map((c, i) => (
        <mesh key={i} position={c.pos} castShadow receiveShadow>
          <boxGeometry args={c.size} />
          <meshStandardMaterial color="#B5AFA2" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-5.75, 0.1, 24]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 12]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={1.4}
          mirror={0.6}
          roughness={0.6}
          depthScale={0.5}
          minDepthThreshold={0.6}
          maxDepthThreshold={1.4}
          color="#22333B"
          metalness={0.35}
        />
      </mesh>
    </group>
  );
}

function NameStele() {
  // Plate widened to 1.7 (and nudged east, clear of the entry path) so the
  // longest line — SIDDHARTHA — sits comfortably within the stone with margin.
  return (
    <group position={[3.05, 0, 38.8]}>
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[1.7, 2.7, 0.22]} />
        <meshStandardMaterial color="#211E1A" roughness={0.6} />
      </mesh>
      <Text
        position={[0, 2.18, 0.12]}
        fontSize={0.115}
        color="#CFC8BA"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.32}
        maxWidth={1.5}
      >
        THE MUSEUM OF
      </Text>
      <Text
        position={[0, 1.82, 0.12]}
        fontSize={0.2}
        color="#F5F2EA"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        fontWeight={600}
        maxWidth={1.5}
      >
        SIDDHARTHA
      </Text>
      <Text
        position={[0, 1.46, 0.12]}
        fontSize={0.2}
        color="#F5F2EA"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        fontWeight={600}
        maxWidth={1.5}
      >
        DHAKAL
      </Text>
      <mesh position={[0, 1.14, 0.12]}>
        <boxGeometry args={[0.9, 0.018, 0.01]} />
        <meshStandardMaterial
          color="#FFD9A0"
          emissive="#FFD9A0"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 0.9, 0.12]}
        fontSize={0.088}
        color="#9E968A"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
        maxWidth={1.5}
      >
        FRONTEND · KATHMANDU
      </Text>
    </group>
  );
}

// Trees frame the open walking axis on both flanks — the plaza is otherwise
// left empty so the void reads monumental.
const TREES: { position: [number, number, number]; scale: number }[] = [
  { position: [10.5, 0, 17.5], scale: 1.15 },
  { position: [9.8, 0, 23.5], scale: 1.3 },
  { position: [9.4, 0, 32.5], scale: 1 },
  { position: [10.2, 0, 37.5], scale: 1.25 },
  { position: [5.6, 0, 42.5], scale: 0.9 },
  { position: [-10.8, 0, 19.5], scale: 1.2 },
  { position: [-11.6, 0, 28], scale: 1 },
  { position: [-9.2, 0, 35.5], scale: 1.15 },
];

function Plaza() {
  return (
    <group>
      {/* Forecourt ground and the lighter entry path down its axis */}
      <mesh position={[0, -0.03, 12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color={CONCRETE} roughness={1} />
      </mesh>
      <mesh position={[0, -0.005, 27.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.4, 30]} />
        <meshStandardMaterial color={PATH_STONE} roughness={0.95} />
      </mesh>

      <ReflectingPool />
      <NameStele />

      {TREES.map((t, i) => (
        <Tree key={i} position={t.position} scale={t.scale} />
      ))}

      {/* Modern stone benches — one faces the sculpture line from the east */}
      {[
        { pos: [8.9, 0.2, 27.8] as const, rotY: Math.PI / 2 },
        { pos: [-2.4, 0.2, 20.8] as const, rotY: Math.PI / 2 },
        { pos: [-5.6, 0.2, 33.5] as const, rotY: -0.15 },
      ].map((b, i) => (
        <mesh key={i} position={[...b.pos]} rotation={[0, b.rotY, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.4, 0.62]} />
          <meshStandardMaterial color="#E6E1D5" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export default function Exterior() {
  return (
    <group>
      <Facade />
      <Roofline />
      <Plaza />
    </group>
  );
}
