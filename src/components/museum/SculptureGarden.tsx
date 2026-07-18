'use client';

import { useRef, useState, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getProjectsByWing } from '@/lib/projects';
import { GARDEN_X, sculptureZ, GOLD } from '@/lib/floorplan';
import { cameraBus } from '@/lib/cameraBus';
import { useMuseumStore } from '@/lib/useMuseumStore';

// The Archive, outdoors: each archive-wing project stands as a sculpture on
// a pedestal in one line beside the entry axis. No spotlights — they read
// from the sun and Environment alone, and the long shadows are the effect.

const PEDESTAL_COLOR = '#E8E4DC';
const PLAQUE_COLOR = '#26231F';
const PEDESTAL_SIZE: [number, number, number] = [0.6, 1.0, 0.6];
// Object sits so the whole piece tops out just below eye height (1.6).
const OBJECT_Y = PEDESTAL_SIZE[1] + 0.26;
const LIFT = 0.05;
const HOVER_EMISSIVE = 0.35;

const FORM_KINDS = ['icosahedron', 'torusKnot', 'boxes'] as const;
type FormKind = (typeof FORM_KINDS)[number];

function GoldMaterial() {
  return (
    <meshStandardMaterial
      color={GOLD}
      metalness={0.7}
      roughness={0.35}
      emissive={GOLD}
      emissiveIntensity={0}
    />
  );
}

// The default low-poly forms, each ~0.5 units overall. Swap any out via the
// `form` prop (e.g. a CC0 GLB primitive) without touching pedestal / plaque
// / behaviour.
function DefaultForm({ kind }: { kind: FormKind }) {
  if (kind === 'icosahedron') {
    return (
      <mesh castShadow>
        <icosahedronGeometry args={[0.25, 0]} />
        <GoldMaterial />
      </mesh>
    );
  }
  if (kind === 'torusKnot') {
    return (
      <mesh castShadow>
        <torusKnotGeometry args={[0.16, 0.055, 96, 12]} />
        <GoldMaterial />
      </mesh>
    );
  }
  return (
    <group>
      <mesh castShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[0.32, 0.1, 0.32]} />
        <GoldMaterial />
      </mesh>
      <mesh castShadow position={[0.03, 0.0, -0.02]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.22, 0.2, 0.22]} />
        <GoldMaterial />
      </mesh>
      <mesh castShadow position={[-0.03, 0.17, 0.03]} rotation={[0, 1.1, 0]}>
        <boxGeometry args={[0.13, 0.14, 0.13]} />
        <GoldMaterial />
      </mesh>
    </group>
  );
}

type SculptureProps = {
  position: [number, number, number];
  title: string;
  objectRotationY?: number;
  kind?: FormKind;
  form?: ReactNode; // replaces the default primitive when provided
  onSelect?: () => void;
};

export function Sculpture({
  position,
  title,
  objectRotationY = 0,
  kind = 'icosahedron',
  form,
  onSelect,
}: SculptureProps) {
  const objectRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Hover: the object lifts slightly and its materials brighten.
  useFrame((_state, dt) => {
    const k = Math.min(1, 8 * dt);
    const object = objectRef.current;
    if (!object) return;
    const targetY = OBJECT_Y + (hovered ? LIFT : 0);
    object.position.y = THREE.MathUtils.lerp(object.position.y, targetY, k);
    const targetE = hovered ? HOVER_EMISSIVE : 0;
    object.traverse((child) => {
      const mat = (child as THREE.Mesh).material as
        | THREE.MeshStandardMaterial
        | undefined;
      if (mat && mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          targetE,
          k,
        );
      }
    });
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect?.();
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = onSelect ? 'pointer' : 'default';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Pedestal — pale concrete against the plaza paving */}
      <mesh position={[0, PEDESTAL_SIZE[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={PEDESTAL_SIZE} />
        <meshStandardMaterial color={PEDESTAL_COLOR} roughness={0.9} />
      </mesh>

      <group
        ref={objectRef}
        position={[0, OBJECT_Y, 0]}
        rotation={[0, objectRotationY, 0]}
      >
        {form !== undefined ? form : <DefaultForm kind={kind} />}
      </group>

      {/* Plaque: a small angled tablet on the axis-facing pedestal face */}
      <group position={[-PEDESTAL_SIZE[0] / 2 - 0.02, 0.9, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh rotation={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.2, 0.025]} />
          <meshStandardMaterial color={PLAQUE_COLOR} roughness={0.55} metalness={0.3} />
        </mesh>
        <Html
          transform
          occlude
          distanceFactor={4}
          position={[0, 0.005, 0.02]}
          rotation={[-0.4, 0, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#C9A961',
              width: 110,
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            {title}
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function SculptureGarden() {
  const sculptures = getProjectsByWing('archive');
  const openArchive = useMuseumStore((s) => s.openArchive);

  return (
    <group>
      {sculptures.map((project, i) => (
        <Sculpture
          key={project.slug}
          position={[GARDEN_X, 0, sculptureZ(i)]}
          title={project.title}
          kind={FORM_KINDS[i % FORM_KINDS.length]}
          objectRotationY={i * 2.1}
          onSelect={() => {
            // Walk the rail to the sculpture, then open the same case-study
            // overlay the wall exhibits use. One content path, two placements.
            cameraBus.glideToWaypoint(`sculpture:${project.slug}`, () => {
              useMuseumStore.getState().openExhibit(project.slug);
            });
          }}
        />
      ))}

      {/* Acquisitions in progress: an empty pedestal closes the line. */}
      <Sculpture
        position={[GARDEN_X, 0, sculptureZ(sculptures.length)]}
        title="The collection is still growing."
        form={null}
        onSelect={openArchive}
      />
    </group>
  );
}
