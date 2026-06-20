'use client';

import { type ThreeEvent } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FLOOR_COLOR = '#141414';
const WALL_COLOR = '#0E0E0E';
const GOLD_COLOR = '#C9A961';
const WALL_HEIGHT = 4;
const WALL_THICKNESS = 0.2;
const TRIM_BASE_Y = 0.05;
const TRIM_HEIGHT = 0.1;
const TRIM_DEPTH = 0.08;

type Side = 'n' | 's' | 'e' | 'w';
type Opening = { side: Side; at: number; width: number };
type Geom = { position: [number, number, number]; size: [number, number, number] };

export type Room = {
  id: string;
  center: [number, number];
  size: [number, number];
  walls: Geom[];
  trim: Geom[];
};

// Splits each side of a rectangular footprint into wall segments around openings;
// also emits gold trim: a baseboard along every wall segment plus a horizontal
// header beam across the top of every doorway opening.
function buildShell(
  center: [number, number],
  size: [number, number],
  openings: Opening[] = [],
  skipSides: Side[] = [],
): { walls: Geom[]; trim: Geom[] } {
  const [cx, cz] = center;
  const [w, d] = size;
  const halfW = w / 2;
  const halfD = d / 2;
  const wallMidY = WALL_HEIGHT / 2;
  const headerY = WALL_HEIGHT - TRIM_HEIGHT / 2;
  const walls: Geom[] = [];
  const trim: Geom[] = [];

  (['n', 's', 'e', 'w'] as Side[]).forEach((side) => {
    if (skipSides.includes(side)) return;

    const isHorizontal = side === 'n' || side === 's';
    const spanStart = isHorizontal ? cx - halfW : cz - halfD;
    const spanEnd = isHorizontal ? cx + halfW : cz + halfD;
    const wallCoord =
      side === 'n'
        ? cz + halfD
        : side === 's'
          ? cz - halfD
          : side === 'e'
            ? cx + halfW
            : cx - halfW;

    const sideOpenings = openings
      .filter((o) => o.side === side)
      .sort((a, b) => a.at - b.at);

    const segments: { start: number; end: number }[] = [];
    let cursor = spanStart;
    for (const o of sideOpenings) {
      const oCenter = isHorizontal ? cx + o.at : cz + o.at;
      const oStart = oCenter - o.width / 2;
      const oEnd = oCenter + o.width / 2;
      if (cursor < oStart) segments.push({ start: cursor, end: oStart });
      cursor = Math.max(cursor, oEnd);
    }
    if (cursor < spanEnd) segments.push({ start: cursor, end: spanEnd });

    for (const seg of segments) {
      const segLen = seg.end - seg.start;
      const segCenter = (seg.start + seg.end) / 2;
      if (isHorizontal) {
        walls.push({
          position: [segCenter, wallMidY, wallCoord],
          size: [segLen + WALL_THICKNESS, WALL_HEIGHT, WALL_THICKNESS],
        });
        trim.push({
          position: [segCenter, TRIM_BASE_Y, wallCoord],
          size: [segLen + WALL_THICKNESS, TRIM_HEIGHT, TRIM_DEPTH],
        });
      } else {
        walls.push({
          position: [wallCoord, wallMidY, segCenter],
          size: [WALL_THICKNESS, WALL_HEIGHT, segLen + WALL_THICKNESS],
        });
        trim.push({
          position: [wallCoord, TRIM_BASE_Y, segCenter],
          size: [TRIM_DEPTH, TRIM_HEIGHT, segLen + WALL_THICKNESS],
        });
      }
    }

    for (const o of sideOpenings) {
      const oCenter = isHorizontal ? cx + o.at : cz + o.at;
      if (isHorizontal) {
        trim.push({
          position: [oCenter, headerY, wallCoord],
          size: [o.width + TRIM_DEPTH, TRIM_HEIGHT, TRIM_DEPTH],
        });
      } else {
        trim.push({
          position: [wallCoord, headerY, oCenter],
          size: [TRIM_DEPTH, TRIM_HEIGHT, o.width + TRIM_DEPTH],
        });
      }
    }
  });

  return { walls, trim };
}

// Cruciform plan. Atrium is the hub; its four walls hold the doorways.
// Each wing skips the side it shares with the atrium so walls aren't drawn twice.
export const ROOMS: Room[] = [
  {
    id: 'atrium',
    center: [0, 0],
    size: [14, 14],
    ...buildShell(
      [0, 0],
      [14, 14],
      [
        { side: 'n', at: 0, width: 2 },
        { side: 's', at: 0, width: 2 },
        { side: 'e', at: 0, width: 2 },
        { side: 'w', at: 0, width: 2 },
      ],
    ),
  },
  {
    id: 'gallery',
    center: [0, -12],
    size: [14, 10],
    ...buildShell([0, -12], [14, 10], [], ['n']),
  },
  {
    id: 'studio',
    center: [-12, 0],
    size: [10, 14],
    ...buildShell([-12, 0], [10, 14], [], ['e']),
  },
  {
    id: 'archive',
    center: [12, 0],
    size: [10, 14],
    ...buildShell([12, 0], [10, 14], [], ['w']),
  },
  {
    id: 'giftshop',
    center: [0, 10],
    size: [14, 6],
    ...buildShell(
      [0, 10],
      [14, 6],
      [{ side: 'n', at: 0, width: 3 }],
      ['s'],
    ),
  },
];

type Props = {
  onRoomClick?: (id: string, center: [number, number]) => void;
};

function RoomFloor({
  id,
  center,
  size,
  onClick,
}: {
  id: string;
  center: [number, number];
  size: [number, number];
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const [cx, cz] = center;
  const [w, d] = size;

  if (id === 'atrium') {
    return (
      <mesh
        position={[cx, 0, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={onClick}
      >
        <planeGeometry args={[w, d]} />
        {/* MeshReflectorMaterial works on a single-sided horizontal plane.
            Subtle sheen: low blur, low mixStrength, polished but not a mirror. */}
        <MeshReflectorMaterial
          color={FLOOR_COLOR}
          resolution={128}
          blur={[0, 0]}
          mixBlur={0}
          mixStrength={0.3}
          mirror={0.35}
          metalness={0.5}
          roughness={0.7}
        />
      </mesh>
    );
  }

  return (
    <mesh
      position={[cx, 0, cz]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      onClick={onClick}
    >
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial
        color={FLOOR_COLOR}
        roughness={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function MuseumShell({ onRoomClick }: Props) {
  return (
    <group>
      {ROOMS.map((room) => (
        <group key={room.id}>
          <RoomFloor
            id={room.id}
            center={room.center}
            size={room.size}
            onClick={(e) => {
              e.stopPropagation();
              onRoomClick?.(room.id, room.center);
            }}
          />

          {room.walls.map((wall, i) => (
            <mesh
              key={`${room.id}-wall-${i}`}
              position={wall.position}
              castShadow
              receiveShadow
            >
              <boxGeometry args={wall.size} />
              <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
            </mesh>
          ))}

          {room.trim.map((t, i) => (
            <mesh key={`${room.id}-trim-${i}`} position={t.position} castShadow>
              <boxGeometry args={t.size} />
              <meshStandardMaterial
                color={GOLD_COLOR}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
