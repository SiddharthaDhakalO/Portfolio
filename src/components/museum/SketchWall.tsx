'use client';

import { Text } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useSketchStore } from '@/lib/useSketchStore';
import { useMuseumStore } from '@/lib/useMuseumStore';

const GOLD = '#C9A961';

// Gift-shop east wall: x = 7, room z ∈ [7, 13]. The wall face looks -x.
const WALL_X = 7 - 0.12;
const WALL_ROT: [number, number, number] = [0, -Math.PI / 2, 0];
// Grid area on that wall (in wall-local coords: u along -z, v up).
const GRID_TOP = 3.15;
const GRID_BOTTOM = 0.55;
const GRID_Z_MIN = 7.7;
const GRID_Z_MAX = 12.3;
const COLS = 5;
const GAP = 0.09;

type Tile = {
  key: string;
  z: number;
  y: number;
  w: number;
  h: number;
  url: string;
};

// Pinterest-style masonry: fixed column width, per-tile height varies, each
// new tile drops into the currently shortest column.
function layoutTiles(urls: string[]): Tile[] {
  const colW = (GRID_Z_MAX - GRID_Z_MIN - GAP * (COLS - 1)) / COLS;
  const heights = new Array(COLS).fill(0);
  const tiles: Tile[] = [];
  const variants = [0.78, 1.0, 0.88, 1.14, 0.94, 1.06];

  urls.forEach((url, i) => {
    const h = colW * variants[i % variants.length];
    let col = 0;
    for (let c = 1; c < COLS; c++) {
      if (heights[c] < heights[col]) col = c;
    }
    const y = GRID_TOP - heights[col] - h / 2;
    if (y - h / 2 < GRID_BOTTOM) return; // wall is full
    const z = GRID_Z_MAX - col * (colW + GAP) - colW / 2;
    tiles.push({ key: `${i}-${url.slice(-24)}`, z, y, w: colW, h, url });
    heights[col] += h + GAP;
  });

  return tiles;
}

function SketchTile({ tile }: { tile: Tile }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(tile.url, (t) => {
      if (!alive) {
        t.dispose();
        return;
      }
      t.colorSpace = THREE.SRGBColorSpace;
      // Crop the square sketch to the tile's aspect so nothing distorts.
      const aspect = tile.w / tile.h;
      if (aspect < 1) {
        t.repeat.set(aspect, 1);
        t.offset.set((1 - aspect) / 2, 0);
      } else {
        t.repeat.set(1, 1 / aspect);
        t.offset.set(0, (1 - 1 / aspect) / 2);
      }
      setTexture(t);
    });
    return () => {
      alive = false;
    };
  }, [tile.url, tile.w, tile.h]);

  if (!texture) return null;

  return (
    <group position={[WALL_X, tile.y, tile.z]} rotation={WALL_ROT}>
      {/* Paper backing, slightly proud of the wall */}
      <mesh position={[0, 0, 0.006]}>
        <planeGeometry args={[tile.w, tile.h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Gold pin */}
      <mesh position={[0, tile.h / 2 - 0.03, 0.012]}>
        <circleGeometry args={[0.016, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function SketchWall() {
  const sketches = useSketchStore((s) => s.sketches);
  const hydrate = useSketchStore((s) => s.hydrate);
  const openSketch = useMuseumStore((s) => s.openSketch);
  const [hovered, setHovered] = useState(false);

  useEffect(() => hydrate(), [hydrate]);

  const tiles = useMemo(() => layoutTiles(sketches), [sketches]);

  return (
    <group>
      {/* Title above the grid */}
      <Text
        position={[WALL_X, 3.55, 10]}
        rotation={WALL_ROT}
        fontSize={0.22}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.28}
        fontWeight={600}
      >
        THE VISITOR WALL
      </Text>

      {tiles.map((tile) => (
        <SketchTile key={tile.key} tile={tile} />
      ))}

      {/* Invisible click surface over the whole wall + a visible prompt */}
      <mesh
        position={[WALL_X + 0.02, 1.9, 10]}
        rotation={WALL_ROT}
        onClick={(e) => {
          e.stopPropagation();
          openSketch();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        visible={false}
      >
        <planeGeometry args={[4.8, 3.4]} />
        <meshBasicMaterial />
      </mesh>

      <group position={[WALL_X, 0.3, 10]} rotation={WALL_ROT}>
        <mesh>
          <boxGeometry args={[1.9, 0.24, 0.02]} />
          <meshStandardMaterial
            color={hovered ? GOLD : '#2A2622'}
            roughness={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.015]}
          fontSize={0.085}
          color={hovered ? '#141414' : GOLD}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          ✏ LEAVE A SKETCH
        </Text>
      </group>
    </group>
  );
}
