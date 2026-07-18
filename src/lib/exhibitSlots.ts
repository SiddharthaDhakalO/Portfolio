import { slotOnPartition } from './floorplan';

export type Vec3 = [number, number, number];

export type ExhibitSlot = {
  position: Vec3;
  rotation: Vec3;
};

// Featured project shown large in the atrium, keyed to a project slug.
export type AtriumFeature = {
  slug: string;
  position: Vec3;
  rotation: Vec3;
};

const GY = 2; // display centre height (metres)

const slot = (
  partition: string,
  face: 'n' | 's',
  u: number,
): ExhibitSlot => {
  const s = slotOnPartition(partition, face, u, GY);
  return { position: s.position, rotation: [0, s.rotationY, 0] };
};

// Gallery zone (-x): the two gallery blades form an open viewing slot. The
// walk enters at the east end, passes the north blade's two works, U-turns
// at the west end, and returns along the south blade's two. Project i in
// PROJECTS maps to slot i, so this order also sets the order they're seen.
export const GALLERY_EXHIBIT_SLOTS: ExhibitSlot[] = [
  slot('gallery-north', 's', 1.7),
  slot('gallery-north', 's', -1.7),
  slot('gallery-south', 'n', -1.7),
  slot('gallery-south', 'n', 1.7),
];

// Flagships hang mid-hall on partition faces that look toward the open
// centre: one greets you from the gallery blade as you arrive, the other
// fronts the studio screen across the atrium.
export const ATRIUM_FEATURE_SLOTS: AtriumFeature[] = [
  { slug: 'pos-system', ...slot('gallery-north', 'n', 0) },
  { slug: 'thi-website', ...slot('studio-west', 's', 0) },
];

export const GALLERY_EXHIBIT_SIZE = { width: 2.5, height: 1.55 };
export const ATRIUM_FEATURE_SIZE = { width: 3, height: 1.85 };

export const exhibitWaypointName = (slug: string) => `exhibit:${slug}`;
