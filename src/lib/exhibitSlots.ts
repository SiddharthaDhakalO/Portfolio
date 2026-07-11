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

// Gallery: centre (0, -12), size 14 × 10 → x ∈ [-7, 7], z ∈ [-17, -7].
// Four large displays laid out for the U-shaped walk: down the east wall,
// across the back wall (right then left), and up the west wall. Project i in
// PROJECTS maps to slot i, so this order also sets the order they're seen.
export const GALLERY_EXHIBIT_SLOTS: ExhibitSlot[] = [
  // East wall (faces -x)
  { position: [6.82, GY, -12], rotation: [0, -Math.PI / 2, 0] },
  // Back wall, right of centre (faces +z)
  { position: [3.6, GY, -16.8], rotation: [0, 0, 0] },
  // Back wall, left of centre (faces +z)
  { position: [-3.6, GY, -16.8], rotation: [0, 0, 0] },
  // West wall (faces +x)
  { position: [-6.82, GY, -12], rotation: [0, Math.PI / 2, 0] },
];

// Atrium: centre (0, 0), size 14 × 14 → side walls at x = ±7.
// Two flagship projects greet arrivals, offset in z so the walk down the
// central axis passes one on the left, then the other on the right.
export const ATRIUM_FEATURE_SLOTS: AtriumFeature[] = [
  // West wall (faces +x) — first flagship, seen on the way in
  { slug: 'pos-system', position: [-6.82, GY, 4], rotation: [0, Math.PI / 2, 0] },
  // East wall (faces -x) — second flagship
  { slug: 'thi-website', position: [6.82, GY, -4], rotation: [0, -Math.PI / 2, 0] },
];

export const GALLERY_EXHIBIT_SIZE = { width: 2.5, height: 1.55 };
export const ATRIUM_FEATURE_SIZE = { width: 3, height: 1.85 };

export const exhibitWaypointName = (slug: string) => `exhibit:${slug}`;
