'use client';

import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

const FRAME_COLOR = '#C9A961';
const MAT_COLOR = '#F0EADC';
const PLATE_COLOR = '#2A2622';
const FRAME_BORDER = 0.07;
const MAT_BORDER = 0.1;
const FRAME_DEPTH = 0.08;
const HOVER_SCALE = 1.04;
const HOVER_EMISSIVE = 0.5;
const LERP_SPEED = 8;

type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  image: string;
  projectSlug: string;
  onSelect: (slug: string) => void;
  width?: number;
  height?: number;
  caption?: string;
};

export default function Exhibit({
  position,
  rotation = [0, 0, 0],
  image,
  projectSlug,
  onSelect,
  width = 2.5,
  height = 1.55,
  caption,
}: Props) {
  const texture = useTexture(image);
  const groupRef = useRef<THREE.Group>(null);
  const frameMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_state, delta) => {
    const factor = Math.min(1, delta * LERP_SPEED);
    if (groupRef.current) {
      const target = hovered ? HOVER_SCALE : 1;
      const s = groupRef.current.scale;
      s.x = THREE.MathUtils.lerp(s.x, target, factor);
      s.y = THREE.MathUtils.lerp(s.y, target, factor);
      s.z = THREE.MathUtils.lerp(s.z, target, factor);
    }
    if (frameMatRef.current) {
      const targetE = hovered ? HOVER_EMISSIVE : 0;
      frameMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        frameMatRef.current.emissiveIntensity,
        targetE,
        factor,
      );
    }
  });

  const matW = width + MAT_BORDER * 2;
  const matH = height + MAT_BORDER * 2;
  const frameW = matW + FRAME_BORDER * 2;
  const frameH = matH + FRAME_BORDER * 2;

  // Raycasts pass through the glass curtain and over the low partitions, so
  // ignore interactions from across the hall — walk up to a work to open it.
  const handleSelect = (e: ThreeEvent<MouseEvent>) => {
    if (e.distance > 10) return;
    e.stopPropagation();
    onSelect(projectSlug);
  };
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (e.distance > 10) return;
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Gold frame */}
      <mesh
        castShadow
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[frameW, frameH, FRAME_DEPTH]} />
        <meshStandardMaterial
          ref={frameMatRef}
          color={FRAME_COLOR}
          metalness={0.8}
          roughness={0.3}
          emissive={FRAME_COLOR}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Off-white mat */}
      <mesh position={[0, 0, FRAME_DEPTH / 2 + 0.004]}>
        <planeGeometry args={[matW, matH]} />
        <meshStandardMaterial color={MAT_COLOR} roughness={0.9} />
      </mesh>

      {/* Hero image */}
      <mesh
        position={[0, 0, FRAME_DEPTH / 2 + 0.01]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Caption plate */}
      {caption && (
        <group position={[0, -frameH / 2 - 0.16, 0.02]}>
          <mesh>
            <boxGeometry args={[Math.min(frameW, 1.9), 0.2, 0.02]} />
            <meshStandardMaterial color={PLATE_COLOR} roughness={0.5} />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.075}
            maxWidth={1.7}
            color={FRAME_COLOR}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.12}
          >
            {caption.toUpperCase()}
          </Text>
        </group>
      )}
    </group>
  );
}
