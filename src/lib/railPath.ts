import * as THREE from 'three';
import { PROJECTS } from './projects';
import { GALLERY_EXHIBIT_SLOTS } from './exhibitSlots';
import type { RoomId } from './useMuseumStore';

export const EYE_Y = 1.6;

// Ordered walk through the museum: in at the gift-shop door, through the
// atrium, a U-loop of the gallery past every exhibit, then studio, archive,
// ending under the atrium skylight. Edit the stops to reroute the tour.
const STOPS: { x: number; z: number }[] = [
  { x: 0, z: 12.6 }, // 0  inside the entrance door
  { x: -1.2, z: 9.8 }, // 1  gift shop (walk beside the plinth, not through it)
  { x: 0, z: 6.4 }, // 2  north doorway
  { x: 0, z: 3 }, // 3  atrium north
  { x: 0, z: -3 }, // 4  atrium south
  { x: 0, z: -8.3 }, // 5  gallery doorway
  { x: 3.2, z: -9.6 }, // 6  toward east wall
  { x: 3.4, z: -12 }, // 7  between east exhibits
  { x: 2.2, z: -15 }, // 8  SE corner
  { x: 0, z: -15.4 }, // 9  back wall centre
  { x: -2.2, z: -15 }, // 10 SW corner
  { x: -3.4, z: -12 }, // 11 between west exhibits
  { x: -3.2, z: -9.6 }, // 12 toward exit
  { x: 0, z: -8.3 }, // 13 gallery doorway (out)
  { x: 0, z: -3 }, // 14 atrium
  { x: -3, z: -0.2 }, // 15 toward studio
  { x: -8.4, z: 0 }, // 16 studio doorway
  { x: -10.4, z: 0 }, // 17 studio stop
  { x: -8.4, z: 0.5 }, // 18 hairpin out
  { x: -3, z: 0.4 }, // 19 atrium
  { x: 3, z: 0.2 }, // 20 toward archive
  { x: 8.4, z: 0 }, // 21 archive doorway
  { x: 10.4, z: 0 }, // 22 archive stop
  { x: 8.4, z: -0.5 }, // 23 hairpin out
  { x: 3, z: -0.2 }, // 24 atrium
  { x: 0, z: 0.4 }, // 25 end under the skylight
];

export const RAIL_CURVE = new THREE.CatmullRomCurve3(
  STOPS.map((s) => new THREE.Vector3(s.x, EYE_Y, s.z)),
  false,
  'centripetal',
  0.5,
);

export const RAIL_LENGTH = RAIL_CURVE.getLength();

// Fine sampling used to project world points onto the curve parameter.
const SAMPLES = 1200;
const samplePoints: THREE.Vector3[] = [];
for (let i = 0; i <= SAMPLES; i++) {
  samplePoints.push(RAIL_CURVE.getPointAt(i / SAMPLES));
}

function tNearest(x: number, z: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i <= SAMPLES; i++) {
    const p = samplePoints[i];
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best / SAMPLES;
}

function tOfStop(index: number): number {
  const s = STOPS[index];
  return tNearest(s.x, s.z);
}

// Where map-HUD jumps land, per room.
export const ROOM_T: Record<RoomId, number> = {
  giftshop: tOfStop(1),
  atrium: tOfStop(3),
  gallery: tOfStop(7),
  studio: tOfStop(17),
  archive: tOfStop(22),
};

// Where the walk passes closest to each exhibit.
export const EXHIBIT_T: Record<string, number> = Object.fromEntries(
  PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length).map((p, i) => {
    const [ex, , ez] = GALLERY_EXHIBIT_SLOTS[i].position;
    return [p.slug, tNearest(ex, ez)];
  }),
);

// Points of interest the camera softly turns toward while walking past.
export type Poi = {
  target: THREE.Vector3;
  t: number;
  radius: number; // influence radius in metres of path length
};

export const POIS: Poi[] = [
  // Exhibits
  ...PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length).map((p, i) => {
    const [ex, ey, ez] = GALLERY_EXHIBIT_SLOTS[i].position;
    return {
      target: new THREE.Vector3(ex, ey, ez),
      t: EXHIBIT_T[p.slug],
      radius: 3.2,
    };
  }),
  // Plinths
  { target: new THREE.Vector3(0, 1.2, 10), t: tNearest(0, 9.6), radius: 2.2 },
  { target: new THREE.Vector3(-12, 1.2, 0), t: tNearest(-10.4, 0), radius: 3 },
  { target: new THREE.Vector3(12, 1.2, 0), t: tNearest(10.4, 0), radius: 3 },
  // Visitor sketch wall on the gift-shop east wall
  {
    target: new THREE.Vector3(6.9, 1.9, 10),
    t: tNearest(-1.2, 10.8),
    radius: 2.2,
  },
];
