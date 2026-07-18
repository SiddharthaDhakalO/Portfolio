'use client';

const WOOD_MID = '#8A6B4A';
const METAL_DARK = '#2A2622';

// Museum furniture only — sparse and believable. Decorative clutter reads as
// fake at this fidelity, so the rooms stay curated instead of "dressed".

function GalleryBench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.09, 0.55]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.55} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.19, 0]} castShadow>
          <boxGeometry args={[0.08, 0.38, 0.45]} />
          <meshStandardMaterial color={METAL_DARK} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function Props() {
  return (
    <group>
      {/* A viewing seat squared up in front of each flagship display, long
          axis parallel to its partition. */}
      <GalleryBench position={[-11.2, 0, 6.2]} rotationY={0.25} />
      <GalleryBench position={[7.6, 0, -1]} rotationY={Math.PI / 2} />

      {/* Gallery zone — one bench in the slot between the two blades. */}
      <GalleryBench position={[-12.5, 0, -1.5]} rotationY={0.1} />
    </group>
  );
}
