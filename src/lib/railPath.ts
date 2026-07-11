import * as THREE from 'three';
import { PROJECTS } from './projects';
import { GALLERY_EXHIBIT_SLOTS, ATRIUM_FEATURE_SLOTS } from './exhibitSlots';
import type { RoomId } from './useMuseumStore';

export const EYE_Y = 1.6;

// Ordered walk: begin far out on the plaza with the whole pavilion in view,
// drift past the name stele and the reflecting pool, arrive under the entry
// canopy as the glass doors slide open, then through the lobby, down the
// atrium axis past the two flagship displays, a U-loop of the gallery past
// every exhibit, then studio, archive, ending under the atrium skylight.
// Edit the stops to reroute the tour.
const STOPS: { x: number; z: number }[] = [
  { x: 0, z: 41.5 }, // 0  plaza start — the pavilion in full view
  { x: 1.9, z: 36.6 }, // 1  past the name stele
  { x: 3, z: 31 }, // 2  east of the reflecting pool, three-quarter view
  { x: 1.9, z: 25 }, // 3  along the pool edge
  { x: 0.7, z: 20.2 }, // 4  merging onto the entry axis
  { x: 0, z: 16.6 }, // 5  under the canopy — doors sliding open
  { x: 0, z: 14.1 }, // 6  threshold
  { x: 0, z: 12.6 }, // 7  inside the entrance door
  { x: -1.4, z: 9.8 }, // 8  gift shop (walk beside the plinth, not through it)
  { x: 0, z: 6.2 }, // 9  north doorway into the atrium
  { x: 0, z: 4 }, // 10 atrium — west flagship on the left
  { x: 0, z: -4 }, // 11 atrium — east flagship on the right
  { x: 0, z: -6.2 }, // 12 south doorway
  { x: 0, z: -8.4 }, // 13 gallery doorway in
  { x: 3.6, z: -10.5 }, // 14 approach east display
  { x: 3.9, z: -12 }, // 15 view east display (project 1)
  { x: 3.6, z: -14.6 }, // 16 toward back-right
  { x: 3.4, z: -15.2 }, // 17 view back-right display (project 2)
  { x: 0, z: -15.5 }, // 18 back wall centre
  { x: -3.4, z: -15.2 }, // 19 view back-left display (project 3)
  { x: -3.6, z: -14.6 }, // 20 toward west wall
  { x: -3.9, z: -12 }, // 21 view west display (project 4)
  { x: -3.6, z: -10.5 }, // 22 toward exit
  { x: 0, z: -8.4 }, // 23 gallery doorway out
  { x: 0, z: -4 }, // 24 atrium
  { x: -3, z: -0.2 }, // 25 toward studio
  { x: -8.4, z: 0 }, // 26 studio doorway
  { x: -10.6, z: 0 }, // 27 studio stop
  { x: -8.4, z: 0.6 }, // 28 hairpin out
  { x: -3, z: 0.4 }, // 29 atrium
  { x: 3, z: 0.2 }, // 30 toward archive
  { x: 8.4, z: 0 }, // 31 archive doorway
  { x: 10.6, z: 0 }, // 32 archive stop
  { x: 8.4, z: -0.6 }, // 33 hairpin out
  { x: 3, z: -0.2 }, // 34 atrium
  { x: 0, z: 0.4 }, // 35 end under the skylight
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
  plaza: tOfStop(2),
  giftshop: tOfStop(8),
  atrium: tOfStop(10),
  gallery: tOfStop(15),
  studio: tOfStop(27),
  archive: tOfStop(32),
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
  // Plaza approach — name stele, reflecting pool, then the entrance itself
  { target: new THREE.Vector3(2.7, 1.6, 38.8), t: tNearest(0.9, 39.5), radius: 3 },
  { target: new THREE.Vector3(-5.7, 0.2, 24), t: tNearest(2.6, 28), radius: 4 },
  { target: new THREE.Vector3(0, 4.4, 17.8), t: tNearest(1, 21.5), radius: 5 },
  { target: new THREE.Vector3(0, 2.1, 13.1), t: tNearest(0, 15.5), radius: 3 },
  // Gallery exhibits
  ...PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length).map((p, i) => {
    const [ex, ey, ez] = GALLERY_EXHIBIT_SLOTS[i].position;
    return {
      target: new THREE.Vector3(ex, ey, ez),
      t: EXHIBIT_T[p.slug],
      radius: 3,
    };
  }),
  // Atrium flagship displays on the side walls
  ...ATRIUM_FEATURE_SLOTS.map((f) => {
    const [fx, fy, fz] = f.position;
    return {
      target: new THREE.Vector3(fx, fy, fz),
      t: tNearest(fx, fz),
      radius: 3,
    };
  }),
  // Plinths
  { target: new THREE.Vector3(0, 1.2, 10), t: tNearest(-1.4, 9.8), radius: 2 },
  { target: new THREE.Vector3(-12, 1.2, 0), t: tNearest(-10.6, 0), radius: 3 },
  { target: new THREE.Vector3(12, 1.2, 0), t: tNearest(10.6, 0), radius: 3 },
  // Archive certificate wall (glance at the certificates on the way in)
  { target: new THREE.Vector3(16, 2, 0), t: tNearest(10.6, 0), radius: 2.4 },
  // Visitor sketch wall on the gift-shop east wall
  { target: new THREE.Vector3(6.9, 1.9, 10), t: tNearest(-1.4, 9.8), radius: 2 },
];
