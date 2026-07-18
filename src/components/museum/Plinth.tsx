'use client';

import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const HEIGHT = 1.2;
const FOOTPRINT = 0.7;
const TRIM = 0.05;
const ORB_RADIUS = 0.12;
const HOVER_SCALE = 1.04;
const HOVER_EMISSIVE = 0.35;
const LERP_SPEED = 8;

type Props = {
  position: [number, number, number];
  onClick: () => void;
};

export default function Plinth({ position, onClick }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
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
    if (bodyMatRef.current) {
      const target = hovered ? HOVER_EMISSIVE : 0;
      bodyMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        bodyMatRef.current.emissiveIntensity,
        target,
        factor,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] + HEIGHT / 2, position[2]]}
      // Raycasts pass through the glass curtain, so ignore interactions from
      // far away — the plinth is something you walk up to.
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (e.distance > 10) return;
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        if (e.distance > 10) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[FOOTPRINT, HEIGHT, FOOTPRINT]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color="#141414"
          roughness={0.7}
          metalness={0.1}
          emissive="#C9A961"
          emissiveIntensity={0}
        />
      </mesh>

      <mesh position={[0, HEIGHT / 2 + TRIM / 2, 0]} castShadow>
        <boxGeometry args={[FOOTPRINT + 0.04, TRIM, FOOTPRINT + 0.04]} />
        <meshStandardMaterial color="#C9A961" metalness={0.8} roughness={0.3} />
      </mesh>

      <mesh position={[0, HEIGHT / 2 + TRIM + ORB_RADIUS, 0]} castShadow>
        <sphereGeometry args={[ORB_RADIUS, 32, 16]} />
        <meshStandardMaterial color="#C9A961" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}
