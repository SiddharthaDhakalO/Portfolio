import { PROJECTS } from './projects';
import { GALLERY_EXHIBIT_SLOTS, exhibitWaypointName } from './exhibitSlots';

export type Vec3 = [number, number, number];

export type Waypoint = {
  eye: Vec3;
  target: Vec3;
};

const ROOM_WAYPOINTS: Record<string, Waypoint> = {
  atrium: { eye: [0, 1.6, 5], target: [0, 1.6, -7] },
  gallery: { eye: [0, 1.6, -9], target: [0, 1.6, -15] },
  studio: { eye: [-9, 1.6, 0], target: [-15, 1.6, 0] },
  archive: { eye: [9, 1.6, 0], target: [15, 1.6, 0] },
  giftshop: { eye: [0, 1.6, 8.5], target: [0, 1.6, 12.5] },
};

const EXHIBIT_WAYPOINTS: Record<string, Waypoint> = Object.fromEntries(
  PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length).map((p, i) => [
    exhibitWaypointName(p.slug),
    GALLERY_EXHIBIT_SLOTS[i].waypoint,
  ]),
);

export const WAYPOINTS: Record<string, Waypoint> = {
  ...ROOM_WAYPOINTS,
  ...EXHIBIT_WAYPOINTS,
};

export type WaypointName = string;

export const ROOM_WAYPOINT_NAMES = Object.keys(ROOM_WAYPOINTS);
export const WAYPOINT_NAMES = ROOM_WAYPOINT_NAMES;
