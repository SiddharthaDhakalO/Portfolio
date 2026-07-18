'use client';

import { type ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  FLOOR_W,
  FLOOR_D,
  CEILING_Y,
  ROOF_T,
  GLASS_Z,
  WALL_T,
  PARTITION_H,
  PARTITION_T,
  PARTITIONS,
  ZONES,
  FLOOR_COLOR,
  SHELL_COLOR,
  PARTITION_COLOR,
  GOLD,
  slotOnPartition,
} from '@/lib/floorplan';

const HALF_W = FLOOR_W / 2;
const HALF_D = FLOOR_D / 2;

// Entry: the glass pane between the mullions at x = ±2 is omitted; the
// sliding doors in Exterior.tsx live in that gap. A transom seals the top.
const DOOR_HALF = 2;
const DOOR_H = 3.3;

type Props = {
  onRoomClick?: (id: string, center: [number, number]) => void;
};

// Glass curtain wall along +z with slim gold mullions every 4 units.
function GlassCurtain() {
  const glass = (
    <meshPhysicalMaterial
      color="#DCE8EA"
      transmission={0.9}
      thickness={0.5}
      roughness={0.05}
      ior={1.5}
      metalness={0}
    />
  );
  const mullionXs = [-18, -14, -10, -6, -2, 2, 6, 10, 14, 18];
  const paneHalf = (HALF_W - DOOR_HALF) / 2; // centre of each fixed sheet
  const z = GLASS_Z + 0.04;

  return (
    <group>
      {/* Fixed sheets left and right of the entry gap */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (DOOR_HALF + paneHalf), CEILING_Y / 2, z]}>
          <boxGeometry args={[HALF_W - DOOR_HALF, CEILING_Y, 0.08]} />
          {glass}
        </mesh>
      ))}
      {/* Transom over the doors */}
      <mesh position={[0, DOOR_H + (CEILING_Y - DOOR_H) / 2, z]}>
        <boxGeometry args={[DOOR_HALF * 2, CEILING_Y - DOOR_H, 0.08]} />
        {glass}
      </mesh>

      {/* Gold mullions every 4 units */}
      {mullionXs.map((x) => (
        <mesh key={x} position={[x, CEILING_Y / 2, z]} castShadow>
          <boxGeometry args={[0.12, CEILING_Y, 0.18]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {/* Head channel, and sill channels stopping at the entry gap */}
      <mesh position={[0, CEILING_Y - 0.05, z]}>
        <boxGeometry args={[FLOOR_W, 0.1, 0.2]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (DOOR_HALF + paneHalf), 0.05, z]}>
          <boxGeometry args={[HALF_W - DOOR_HALF, 0.1, 0.2]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {/* Door head — closes the gap between door height and the transom sill */}
      <mesh position={[0, DOOR_H - 0.05, z]}>
        <boxGeometry args={[DOOR_HALF * 2, 0.1, 0.2]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

// Warm recessed downlights: points of light on the dark ceiling plane.
function CeilingDownlights() {
  const positions = useMemo(() => {
    const pts: [number, number][] = [];
    for (const x of [-16, -8, 0, 8, 16]) {
      for (const z of [-10, -3.5, 3.5, 10]) {
        pts.push([x, z]);
      }
    }
    return pts;
  }, []);
  return (
    <>
      {positions.map(([x, z]) => (
        <mesh
          key={`${x}:${z}`}
          position={[x, CEILING_Y - 0.015, z]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.14, 24]} />
          <meshStandardMaterial
            color="#FFE9C4"
            emissive="#FFE9C4"
            emissiveIntensity={1.7}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

// Zone names mounted high on the partition faces that greet the visitor.
// (The archive has no sign in here — it lives outdoors in the garden.)
const SIGNS: { text: string; partition: string; face: 'n' | 's' }[] = [
  { text: 'THE GALLERY', partition: 'gallery-north', face: 's' },
  { text: 'THE STUDIO', partition: 'studio-west', face: 's' },
];

export default function MuseumShell({ onRoomClick }: Props) {
  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!onRoomClick) return;
    // No rooms to hit-test — resolve the click to the nearest zone.
    let best = ZONES[0];
    let bestD = Infinity;
    for (const zone of ZONES) {
      const d =
        (zone.center[0] - e.point.x) ** 2 + (zone.center[1] - e.point.z) ** 2;
      if (d < bestD) {
        bestD = d;
        best = zone;
      }
    }
    onRoomClick(best.id, best.center);
  };

  return (
    <group>
      {/* Floor plane — near-black, faintly reflective under the dusk light */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={handleFloorClick}
      >
        <planeGeometry args={[FLOOR_W, FLOOR_D]} />
        <meshStandardMaterial
          color={FLOOR_COLOR}
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Ceiling slab: one flat box, underside at CEILING_Y */}
      <mesh position={[0, CEILING_Y + ROOF_T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[FLOOR_W, ROOF_T, FLOOR_D]} />
        <meshStandardMaterial color={SHELL_COLOR} roughness={0.9} />
      </mesh>
      <CeilingDownlights />

      {/* Solid perimeter: south, west, east. The +z side is all glass. */}
      {(
        [
          { pos: [0, CEILING_Y / 2, -HALF_D - WALL_T / 2], size: [FLOOR_W + WALL_T * 2, CEILING_Y, WALL_T] },
          { pos: [-HALF_W - WALL_T / 2, CEILING_Y / 2, 0], size: [WALL_T, CEILING_Y, FLOOR_D + WALL_T * 2] },
          { pos: [HALF_W + WALL_T / 2, CEILING_Y / 2, 0], size: [WALL_T, CEILING_Y, FLOOR_D + WALL_T * 2] },
        ] as { pos: [number, number, number]; size: [number, number, number] }[]
      ).map((wall, i) => (
        <mesh key={i} position={wall.pos} castShadow receiveShadow>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color={SHELL_COLOR} roughness={0.9} />
        </mesh>
      ))}

      <GlassCurtain />

      {/* Floating partitions — islands of wall, 2 units of air above each */}
      {PARTITIONS.map((p) => (
        <group
          key={p.id}
          position={[p.position[0], 0, p.position[1]]}
          rotation={[0, p.rotation, 0]}
        >
          <mesh position={[0, PARTITION_H / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[p.length, PARTITION_H, PARTITION_T]} />
            <meshStandardMaterial color={PARTITION_COLOR} roughness={0.85} />
          </mesh>
          {/* Slim gold reveal along the top edge */}
          <mesh position={[0, PARTITION_H + 0.015, 0]}>
            <boxGeometry args={[p.length, 0.03, PARTITION_T + 0.02]} />
            <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {SIGNS.map((sign) => {
        const slot = slotOnPartition(sign.partition, sign.face, 0, 3.5);
        return (
          <Text
            key={sign.text}
            position={slot.position}
            rotation={[0, slot.rotationY, 0]}
            fontSize={0.24}
            color={GOLD}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.28}
            fontWeight={600}
          >
            {sign.text}
          </Text>
        );
      })}
    </group>
  );
}
