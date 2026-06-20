import type { Vec3, Waypoint } from './waypoints';

export type ExhibitSlot = {
  position: Vec3;
  rotation: Vec3;
  waypoint: Waypoint;
};

const Y = 1.8;
const TARGET_Y = 1.7;
const VIEW_DIST = 4;

// Gallery: center (0,-12), size [14,10] → x[-7,7], z[-17,-7].
// Usable walls for exhibits: east (x=+7), west (x=-7), back/south (z=-17).
// Layout: 2 on each side wall + 2 on the back wall = 6 slots, enough for ~6 projects.
export const GALLERY_EXHIBIT_SLOTS: ExhibitSlot[] = [
  {
    position: [6.85, Y, -10],
    rotation: [0, -Math.PI / 2, 0],
    waypoint: { eye: [7 - VIEW_DIST, 1.6, -10], target: [7, TARGET_Y, -10] },
  },
  {
    position: [6.85, Y, -14],
    rotation: [0, -Math.PI / 2, 0],
    waypoint: { eye: [7 - VIEW_DIST, 1.6, -14], target: [7, TARGET_Y, -14] },
  },
  {
    position: [-6.85, Y, -10],
    rotation: [0, Math.PI / 2, 0],
    waypoint: { eye: [-7 + VIEW_DIST, 1.6, -10], target: [-7, TARGET_Y, -10] },
  },
  {
    position: [-6.85, Y, -14],
    rotation: [0, Math.PI / 2, 0],
    waypoint: { eye: [-7 + VIEW_DIST, 1.6, -14], target: [-7, TARGET_Y, -14] },
  },
  {
    position: [-3, Y, -16.85],
    rotation: [0, 0, 0],
    waypoint: { eye: [-3, 1.6, -17 + VIEW_DIST], target: [-3, TARGET_Y, -17] },
  },
  {
    position: [3, Y, -16.85],
    rotation: [0, 0, 0],
    waypoint: { eye: [3, 1.6, -17 + VIEW_DIST], target: [3, TARGET_Y, -17] },
  },
];

export const exhibitWaypointName = (slug: string) => `exhibit:${slug}`;
