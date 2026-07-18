import type { RoomId } from './useMuseumStore';

// ---------------------------------------------------------------------------
// The modernist free plan (Mies — Barcelona Pavilion / Neue Nationalgalerie).
// One open hall: a dark envelope, a glass entry front, and free-standing
// partitions that never meet. Every number the plan depends on lives here so
// the layout can be tuned without touching component code.
// ---------------------------------------------------------------------------

// Envelope: floor x ∈ [-20, 20], z ∈ [-14, 14]; entry side is +z (glass).
export const FLOOR_W = 40;
export const FLOOR_D = 28;
export const CEILING_Y = 6;
export const ROOF_T = 0.4; // ceiling slab thickness (its underside sits at CEILING_Y)
export const GLASS_Z = FLOOR_D / 2; // the glass curtain line
export const WALL_T = 0.2;

// Partitions stop 2 units short of the ceiling so light passes over them.
export const PARTITION_H = 4;
export const PARTITION_T = 0.2;

export const FLOOR_COLOR = '#141414';
export const SHELL_COLOR = '#0E0E0E';
export const PARTITION_COLOR = '#1C1916';
export const GOLD = '#C9A961';

// ---------------------------------------------------------------------------
// Floating partitions — this IS the plan. Each one is an island: no partition
// touches another, the perimeter, or the ceiling. Zones are defined by
// partition proximity, not walls.
// ---------------------------------------------------------------------------

export type Partition = {
  id: string;
  position: [number, number]; // [x, z] of the wall's centre
  length: number;
  rotation: number; // radians about y; 0 runs along +x
};

export const PARTITIONS: Partition[] = [
  // Gallery zone (-x): two long blades forming an open viewing slot.
  { id: 'gallery-north', position: [-12, 3], length: 7, rotation: 0.25 },
  { id: 'gallery-south', position: [-13, -6], length: 7, rotation: -0.12 },
  // Studio zone (+x): a screen toward the atrium and a skewed back blade.
  { id: 'studio-west', position: [10.5, -1], length: 6, rotation: Math.PI / 2 },
  { id: 'studio-north', position: [15, 5], length: 6, rotation: -0.3 },
  // (The archive left the building — it lives outdoors as the sculpture
  // garden now; see GARDEN below.)
  // Gift shop zone (+z, east of the entry): screened by a blade along z.
  { id: 'giftshop-screen', position: [9, 10], length: 5, rotation: Math.PI / 2 },
  // Short blade near the entry that deflects the arrival view.
  { id: 'entry-blade', position: [-4, 10.5], length: 3.5, rotation: 0.35 },
];

// ---------------------------------------------------------------------------
// Zones: proximity regions used by the map HUD and room tracking. The centre
// of the hall stays open as the atrium.
// ---------------------------------------------------------------------------

export type Zone = {
  id: RoomId;
  center: [number, number];
  size: [number, number];
};

export const ZONES: Zone[] = [
  { id: 'atrium', center: [0, 0], size: [12, 14] },
  { id: 'gallery', center: [-13, -2], size: [14, 20] },
  { id: 'studio', center: [13, -2], size: [14, 20] },
  // The archive is the outdoor sculpture garden flanking the entry axis.
  { id: 'archive', center: [3.8, 32], size: [9, 20] },
  { id: 'giftshop', center: [5.5, 11], size: [9, 6] },
];

// ---------------------------------------------------------------------------
// Sculpture garden: one line of pedestals along the east edge of the entry
// axis, set well back from the facade. The rest of the plaza stays empty —
// the void is what makes the building monumental.
// ---------------------------------------------------------------------------

export const GARDEN_X = 6;
export const GARDEN_Z0 = 24.5;
export const GARDEN_SPACING = 5;
export const sculptureZ = (i: number) => GARDEN_Z0 + i * GARDEN_SPACING;

// ---------------------------------------------------------------------------
// Helper: a display slot on one face of a partition. `face` 'n' is the +z
// side before rotation, 's' the -z side; `u` is the offset in metres along
// the partition's length. The returned rotationY faces a +z-oriented plane
// (Exhibit, WallDisplay, Text) out of that face.
// ---------------------------------------------------------------------------

export function slotOnPartition(
  partitionId: string,
  face: 'n' | 's',
  u: number,
  y: number,
  standoff: number = PARTITION_T / 2 + 0.02,
): { position: [number, number, number]; rotationY: number } {
  const p = PARTITIONS.find((q) => q.id === partitionId);
  if (!p) throw new Error(`Unknown partition: ${partitionId}`);
  const [px, pz] = p.position;
  const dirX = Math.cos(p.rotation);
  const dirZ = -Math.sin(p.rotation);
  const sign = face === 'n' ? 1 : -1;
  const nX = Math.sin(p.rotation) * sign;
  const nZ = Math.cos(p.rotation) * sign;
  return {
    position: [px + dirX * u + nX * standoff, y, pz + dirZ * u + nZ * standoff],
    rotationY: face === 'n' ? p.rotation : p.rotation + Math.PI,
  };
}

// World-space endpoints of a partition, for map drawing and clearance checks.
export function partitionEnds(
  p: Partition,
): [[number, number], [number, number]] {
  const dirX = Math.cos(p.rotation);
  const dirZ = -Math.sin(p.rotation);
  const h = p.length / 2;
  const [px, pz] = p.position;
  return [
    [px - dirX * h, pz - dirZ * h],
    [px + dirX * h, pz + dirZ * h],
  ];
}
