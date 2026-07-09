'use client';

import { type ThreeEvent } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const CEILING_COLOR = '#EFEBE2';
const GOLD_COLOR = '#C9A961';
const BASE_COLOR = '#2A2622';
const SKY_COLOR = '#FFF3DC';
const WALL_HEIGHT = 4;
const WALL_THICKNESS = 0.2;
const DOOR_HEIGHT = 2.8;
const BASE_HEIGHT = 0.16;
const BASE_DEPTH = 0.12;
const CROWN_HEIGHT = 0.12;
const CROWN_DEPTH = 0.14;
const HEADER_HEIGHT = 0.1;
const HEADER_DEPTH = 0.1;
const SKYLIGHT_RADIUS = 2.8;

type Side = 'n' | 's' | 'e' | 'w';
type Opening = { side: Side; at: number; width: number };
type Geom = { position: [number, number, number]; size: [number, number, number] };

export type Room = {
  id: string;
  center: [number, number];
  size: [number, number];
  walls: Geom[];
  base: Geom[];
  gold: Geom[];
  hasCeiling: boolean;
  skylight?: boolean;
};

function buildShell(
  center: [number, number],
  size: [number, number],
  openings: Opening[] = [],
  skipSides: Side[] = [],
): { walls: Geom[]; base: Geom[]; gold: Geom[] } {
  const [cx, cz] = center;
  const [w, d] = size;
  const halfW = w / 2;
  const halfD = d / 2;
  const wallMidY = WALL_HEIGHT / 2;
  const walls: Geom[] = [];
  const base: Geom[] = [];
  const gold: Geom[] = [];

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
        base.push({
          position: [segCenter, BASE_HEIGHT / 2, wallCoord],
          size: [segLen + WALL_THICKNESS, BASE_HEIGHT, BASE_DEPTH],
        });
      } else {
        walls.push({
          position: [wallCoord, wallMidY, segCenter],
          size: [WALL_THICKNESS, WALL_HEIGHT, segLen + WALL_THICKNESS],
        });
        base.push({
          position: [wallCoord, BASE_HEIGHT / 2, segCenter],
          size: [BASE_DEPTH, BASE_HEIGHT, segLen + WALL_THICKNESS],
        });
      }
    }

    // Lintel above each doorway opening.
    const lintelHeight = WALL_HEIGHT - DOOR_HEIGHT;
    const lintelY = DOOR_HEIGHT + lintelHeight / 2;
    for (const o of sideOpenings) {
      const oCenter = isHorizontal ? cx + o.at : cz + o.at;
      if (isHorizontal) {
        walls.push({
          position: [oCenter, lintelY, wallCoord],
          size: [o.width + WALL_THICKNESS, lintelHeight, WALL_THICKNESS],
        });
      } else {
        walls.push({
          position: [wallCoord, lintelY, oCenter],
          size: [WALL_THICKNESS, lintelHeight, o.width + WALL_THICKNESS],
        });
      }
    }

    // Gold header at the top of each opening.
    for (const o of sideOpenings) {
      const oCenter = isHorizontal ? cx + o.at : cz + o.at;
      const headerY = DOOR_HEIGHT - HEADER_HEIGHT / 2;
      if (isHorizontal) {
        gold.push({
          position: [oCenter, headerY, wallCoord],
          size: [o.width + HEADER_DEPTH, HEADER_HEIGHT, HEADER_DEPTH],
        });
      } else {
        gold.push({
          position: [wallCoord, headerY, oCenter],
          size: [HEADER_DEPTH, HEADER_HEIGHT, o.width + HEADER_DEPTH],
        });
      }
    }

    // Crown moulding — continuous gold strip at the wall/ceiling junction.
    const crownY = WALL_HEIGHT - CROWN_HEIGHT / 2;
    if (isHorizontal) {
      gold.push({
        position: [cx, crownY, wallCoord],
        size: [w + WALL_THICKNESS, CROWN_HEIGHT, CROWN_DEPTH],
      });
    } else {
      gold.push({
        position: [wallCoord, crownY, cz],
        size: [CROWN_DEPTH, CROWN_HEIGHT, d + WALL_THICKNESS],
      });
    }
  });

  return { walls, base, gold };
}

export const ROOMS: Room[] = [
  {
    id: 'atrium',
    center: [0, 0],
    size: [14, 14],
    hasCeiling: true,
    skylight: true,
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
    hasCeiling: true,
    ...buildShell([0, -12], [14, 10], [], ['n']),
  },
  {
    id: 'studio',
    center: [-12, 0],
    size: [10, 14],
    hasCeiling: true,
    ...buildShell([-12, 0], [10, 14], [], ['e']),
  },
  {
    id: 'archive',
    center: [12, 0],
    size: [10, 14],
    hasCeiling: true,
    ...buildShell([12, 0], [10, 14], [], ['w']),
  },
  {
    id: 'giftshop',
    center: [0, 10],
    size: [14, 6],
    hasCeiling: true,
    ...buildShell(
      [0, 10],
      [14, 6],
      [{ side: 'n', at: 0, width: 3 }],
      ['s'],
    ),
  },
];

type Sign = {
  text: string;
  position: [number, number, number];
  rotation: [number, number, number];
};
const SIGN_Y = DOOR_HEIGHT + (WALL_HEIGHT - DOOR_HEIGHT) / 2;
const SIGN_INSET = WALL_THICKNESS / 2 + 0.001;
const SIGNS: Sign[] = [
  { text: 'THE GIFT SHOP', position: [0, SIGN_Y, 7 - SIGN_INSET], rotation: [0, Math.PI, 0] },
  { text: 'THE GALLERY', position: [0, SIGN_Y, -7 + SIGN_INSET], rotation: [0, 0, 0] },
  { text: 'THE ARCHIVE', position: [7 - SIGN_INSET, SIGN_Y, 0], rotation: [0, -Math.PI / 2, 0] },
  { text: 'THE STUDIO', position: [-7 + SIGN_INSET, SIGN_Y, 0], rotation: [0, Math.PI / 2, 0] },
];

type Props = {
  onRoomClick?: (id: string, center: [number, number]) => void;
};

function useShellTextures() {
  const [woodColor, woodNormal, woodRough, plasterColor, plasterNormal] =
    useTexture([
      '/textures/wood-color.jpg',
      '/textures/wood-normal.jpg',
      '/textures/wood-rough.jpg',
      '/textures/plaster-color.jpg',
      '/textures/plaster-normal.jpg',
    ]);

  return useMemo(() => {
    for (const t of [woodColor, woodNormal, woodRough, plasterColor, plasterNormal]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
    }
    woodColor.colorSpace = THREE.SRGBColorSpace;
    plasterColor.colorSpace = THREE.SRGBColorSpace;

    // One floor material per distinct repeat so planks stay square per room.
    const floorMatFor = (w: number, d: number) => {
      const c = woodColor.clone();
      const n = woodNormal.clone();
      const r = woodRough.clone();
      for (const t of [c, n, r]) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(w / 4, d / 4);
        t.needsUpdate = true;
      }
      return new THREE.MeshStandardMaterial({
        map: c,
        normalMap: n,
        roughnessMap: r,
        side: THREE.DoubleSide,
      });
    };

    const pc = plasterColor.clone();
    const pn = plasterNormal.clone();
    for (const t of [pc, pn]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2.5, 1.2);
      t.needsUpdate = true;
    }
    const wallMat = new THREE.MeshStandardMaterial({
      map: pc,
      normalMap: pn,
      normalScale: new THREE.Vector2(0.6, 0.6),
      color: '#E9E2D5',
      roughness: 0.92,
    });

    return { floorMatFor, wallMat };
  }, [woodColor, woodNormal, woodRough, plasterColor, plasterNormal]);
}

function AtriumCeilingWithSkylight({
  center,
  size,
}: {
  center: [number, number];
  size: [number, number];
}) {
  const [cx, cz] = center;
  const [w, d] = size;
  const halfW = w / 2;
  const halfD = d / 2;

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-halfW, -halfD);
    shape.lineTo(halfW, -halfD);
    shape.lineTo(halfW, halfD);
    shape.lineTo(-halfW, halfD);
    shape.lineTo(-halfW, -halfD);
    const hole = new THREE.Path();
    hole.absarc(0, 0, SKYLIGHT_RADIUS, 0, Math.PI * 2, false);
    shape.holes.push(hole);
    return new THREE.ShapeGeometry(shape, 48);
  }, [halfW, halfD]);

  return (
    <>
      <mesh
        geometry={geometry}
        position={[cx, WALL_HEIGHT, cz]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color={CEILING_COLOR}
          side={THREE.DoubleSide}
          roughness={0.95}
        />
      </mesh>

      <mesh position={[cx, WALL_HEIGHT - 0.02, cz]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[SKYLIGHT_RADIUS, SKYLIGHT_RADIUS + 0.1, 64]} />
        <meshStandardMaterial
          color={GOLD_COLOR}
          metalness={0.8}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[cx, WALL_HEIGHT + 1.6, cz]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[SKYLIGHT_RADIUS + 0.5, 48]} />
        <meshStandardMaterial
          color={SKY_COLOR}
          emissive={SKY_COLOR}
          emissiveIntensity={2.2}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

// Small emissive downlight discs so wing ceilings aren't blank planes.
function CeilingDownlights({
  center,
  size,
}: {
  center: [number, number];
  size: [number, number];
}) {
  const [cx, cz] = center;
  const [w, d] = size;
  const positions: [number, number][] = [];
  const nx = w > d ? 2 : 1;
  const nz = d > w ? 2 : 1;
  for (let ix = 0; ix < nx + 1; ix++) {
    for (let iz = 0; iz < nz + 1; iz++) {
      positions.push([
        cx - w / 4 + (ix * w) / (2 * Math.max(1, nx)),
        cz - d / 4 + (iz * d) / (2 * Math.max(1, nz)),
      ]);
    }
  }
  return (
    <>
      {positions.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, WALL_HEIGHT - 0.015, z]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.16, 24]} />
          <meshStandardMaterial
            color="#FFF6E4"
            emissive="#FFF6E4"
            emissiveIntensity={1.6}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

export default function MuseumShell({ onRoomClick }: Props) {
  const { floorMatFor, wallMat } = useShellTextures();

  const floorMats = useMemo(() => {
    const map = new Map<string, THREE.MeshStandardMaterial>();
    for (const room of ROOMS) {
      map.set(room.id, floorMatFor(room.size[0], room.size[1]));
    }
    return map;
  }, [floorMatFor]);

  return (
    <group>
      {ROOMS.map((room) => {
        const [cx, cz] = room.center;
        const [w, d] = room.size;
        return (
          <group key={room.id}>
            <mesh
              position={[cx, 0, cz]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
              material={floorMats.get(room.id)}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onRoomClick?.(room.id, room.center);
              }}
            >
              <planeGeometry args={[w, d]} />
            </mesh>

            {room.hasCeiling && room.skylight ? (
              <AtriumCeilingWithSkylight center={room.center} size={room.size} />
            ) : room.hasCeiling ? (
              <>
                <mesh
                  position={[cx, WALL_HEIGHT, cz]}
                  rotation={[Math.PI / 2, 0, 0]}
                  receiveShadow
                >
                  <planeGeometry args={[w, d]} />
                  <meshStandardMaterial
                    color={CEILING_COLOR}
                    side={THREE.DoubleSide}
                    roughness={0.95}
                  />
                </mesh>
                <CeilingDownlights center={room.center} size={room.size} />
              </>
            ) : null}

            {room.walls.map((wall, i) => (
              <mesh
                key={`${room.id}-wall-${i}`}
                position={wall.position}
                castShadow
                receiveShadow
                material={wallMat}
              >
                <boxGeometry args={wall.size} />
              </mesh>
            ))}

            {room.base.map((b, i) => (
              <mesh key={`${room.id}-base-${i}`} position={b.position} castShadow>
                <boxGeometry args={b.size} />
                <meshStandardMaterial color={BASE_COLOR} roughness={0.6} />
              </mesh>
            ))}

            {room.gold.map((t, i) => (
              <mesh key={`${room.id}-gold-${i}`} position={t.position} castShadow>
                <boxGeometry args={t.size} />
                <meshStandardMaterial
                  color={GOLD_COLOR}
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {SIGNS.map((sign) => (
        <Text
          key={sign.text}
          position={sign.position}
          rotation={sign.rotation}
          fontSize={0.24}
          color={GOLD_COLOR}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.28}
          fontWeight={600}
        >
          {sign.text}
        </Text>
      ))}
    </group>
  );
}
