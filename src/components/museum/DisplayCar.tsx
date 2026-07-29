'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { GOLD } from '@/lib/floorplan';

// A display piece for the plaza: a low-poly modern supercar on a showroom pad,
// built entirely from primitives (an extruded side-profile body + wheels) so it
// matches the flat-shaded plaza props and keeps the no-downloaded-GLB rule.
// The silhouette is a generic mid-engine wedge — long hood is at +x (local
// front); rotate the whole group with `rotationY` to aim it at the walk.

const BODY = '#2B2620'; // warm dark pearl, flat-shaded facets
const GLASS = '#0F1216'; // dark, low-reflection so it reads as windows not chrome
const TIRE = '#141210';
const PAD = '#DAD4C6';

const BODY_W = 1.82;
const GREENHOUSE_W = 1.42;

// A closed side-profile polygon, extruded along z into a solid.
function extrude(points: [number, number][], width: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: false,
  });
  geo.translate(0, 0, -width / 2); // centre across the car's width
  geo.computeVertexNormals();
  return geo;
}

const TIRE_R = 0.3;
const TIRE_W = 0.26;

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tyre */}
      <mesh castShadow>
        <cylinderGeometry args={[TIRE_R, TIRE_R, TIRE_W, 24]} />
        <meshStandardMaterial color={TIRE} roughness={0.85} />
      </mesh>
      {/* A modest gold hub, flush with the tyre face rather than poking out */}
      <mesh position={[0, TIRE_W / 2 - 0.005, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 18]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -TIRE_W / 2 + 0.005, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 18]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function DisplayCar({
  position = [7, 0, 34],
  rotationY = -2.15,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  // Body tub (sills, hood, rear deck) and the greenhouse as a separate glass
  // extrude sitting on the beltline.
  const bodyGeo = useMemo(
    () =>
      extrude(
        [
          [-2.2, 0.16], // rear bottom
          [-2.2, 0.5], // rear
          [-1.75, 0.58], // rear deck
          [-1.4, 0.64], // beltline start
          [0.55, 0.68], // long low beltline
          [1.2, 0.64],
          [1.92, 0.5], // hood down to nose
          [2.2, 0.38], // nose tip
          [2.17, 0.16], // front bottom
        ],
        BODY_W,
      ),
    [],
  );
  // A low, raked canopy set toward the rear (mid-engine, cab-forward).
  const glassGeo = useMemo(
    () =>
      extrude(
        [
          [-1.4, 0.64],
          [-0.85, 0.89],
          [-0.05, 0.9],
          [0.6, 0.68],
        ],
        GREENHOUSE_W,
      ),
    [],
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Showroom pad + gold ring inlay */}
      <mesh position={[0, 0.07, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.4, 2.5, 0.14, 48]} />
        <meshStandardMaterial color={PAD} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.12, 0.02, 8, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
      </mesh>

      {/* The car, lifted onto the pad */}
      <group position={[0, 0.14, 0]}>
        <mesh geometry={bodyGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color={BODY}
            metalness={0.5}
            roughness={0.32}
            flatShading
          />
        </mesh>
        <mesh geometry={glassGeo} castShadow>
          <meshStandardMaterial
            color={GLASS}
            metalness={0.1}
            roughness={0.25}
            envMapIntensity={0.45}
          />
        </mesh>

        {/* Wheels, tucked just under the body sides */}
        <Wheel position={[1.42, TIRE_R, 0.82]} />
        <Wheel position={[1.42, TIRE_R, -0.82]} />
        <Wheel position={[-1.48, TIRE_R, 0.82]} />
        <Wheel position={[-1.48, TIRE_R, -0.82]} />

        {/* Slim gold beltline strip along each flank */}
        {[0.9, -0.9].map((z) => (
          <mesh key={z} position={[-0.1, 0.63, z]} castShadow>
            <boxGeometry args={[2.6, 0.02, 0.03]} />
            <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.35} />
          </mesh>
        ))}

        {/* Front splitter (gold) and rear diffuser (dark) */}
        <mesh position={[2.06, 0.2, 0]} castShadow>
          <boxGeometry args={[0.22, 0.03, 1.55]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[-2.14, 0.3, 0]} castShadow>
          <boxGeometry args={[0.12, 0.22, 1.5]} />
          <meshStandardMaterial color="#1A1712" roughness={0.7} />
        </mesh>

        {/* Headlights — small, dim slivers set into the nose */}
        {[0.64, -0.64].map((z) => (
          <mesh key={z} position={[2.02, 0.46, z]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.09, 0.035, 0.24]} />
            <meshStandardMaterial
              color="#FFE9CC"
              emissive="#FFE3B8"
              emissiveIntensity={0.7}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Full-width rear light bar */}
        <mesh position={[-2.17, 0.54, 0]}>
          <boxGeometry args={[0.04, 0.05, 1.4]} />
          <meshStandardMaterial
            color="#FFD9A0"
            emissive="#FFD9A0"
            emissiveIntensity={1.3}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
