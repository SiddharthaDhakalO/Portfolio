'use client';

import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const FRAME_COLOR = '#C9A961';
const FRAME_BORDER = 0.06;
const FRAME_DEPTH = 0.08;
const IMAGE_OFFSET = 0.012;
const HOVER_SCALE = 1.05;
const HOVER_EMISSIVE = 0.6;
const LERP_SPEED = 8;

type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  image: string;
  projectSlug: string;
  onSelect: (slug: string) => void;
  width?: number;
  height?: number;
};

export default function Exhibit({
  position,
  rotation = [0, 0, 0],
  image,
  projectSlug,
  onSelect,
  width = 1.6,
  height = 1.0,
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

  const frameWidth = width + FRAME_BORDER * 2;
  const frameHeight = height + FRAME_BORDER * 2;

  const handleSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(projectSlug);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
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
      <mesh
        castShadow
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[frameWidth, frameHeight, FRAME_DEPTH]} />
        <meshStandardMaterial
          ref={frameMatRef}
          color={FRAME_COLOR}
          metalness={0.8}
          roughness={0.3}
          emissive={FRAME_COLOR}
          emissiveIntensity={0}
        />
      </mesh>

      <mesh
        position={[0, 0, FRAME_DEPTH / 2 + IMAGE_OFFSET]}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
