import * as THREE from 'three';
import { getProjectsByWing } from './projects';
import { GALLERY_EXHIBIT_SLOTS, ATRIUM_FEATURE_SLOTS } from './exhibitSlots';
import { GARDEN_X, sculptureZ } from './floorplan';
import type { RoomId } from './useMuseumStore';

export const EYE_Y = 1.6;

const GALLERY_PROJECTS = getProjectsByWing('gallery');

// Ordered walk: begin high at the arrival point on the far end of the plaza,
// then walk the straight processional axis — the ground wordmark resolving
// underfoot, banners passing, the pool to the right, the sculpture garden to
// the left — so the building grows in frame while staying still. Through the
// sliding doors, then one continuous drift through the free-plan hall: past
// the entry blade to the gift shop, down the open centre, through the gallery
// slot between the two blades, across the open south, up into the studio
// zone, and back to rest in the middle of the hall. Edit the stops to
// reroute the tour.
const STOPS: { x: number; z: number; y?: number }[] = [
  { x: 0, z: 50, y: 4.2 }, // 0  arrival — high, the axis and wordmark below
  { x: 0, z: 45.5, y: 2.6 }, // 1  descending onto the axis
  { x: 0, z: 41 }, // 2  eye level — stele right, banner line ahead-left
  { x: 0, z: 35.5 }, // 3  banners passing on the left
  { x: 0, z: 29.5 }, // 4  sculpture garden on the right, pool on the left
  { x: 0, z: 23.5 }, // 5  the last pedestals
  { x: 0, z: 18.6 }, // 6  the empty forecourt before the doors
  { x: 0, z: 16.8 }, // 7  under the canopy — doors sliding open
  { x: 0, z: 14.4 }, // 8  threshold at the glass line
  { x: 0, z: 12.4 }, // 9  inside — the entry blade deflects the view left
  { x: 2.6, z: 11.2 }, // 10 drifting east toward the gift shop
  { x: 4.6, z: 9.7 }, // 11 gift shop — plinth left, visitor wall ahead
  { x: 1.6, z: 8.4 }, // 12 merging back toward the open centre
  { x: 0, z: 6.3 }, // 13 onto the atrium axis
  { x: -1.2, z: 3.4 }, // 14 first flagship on the gallery blade
  { x: -3.2, z: 0.6 }, // 15 atrium centre-west
  { x: -7.6, z: -0.6 }, // 16 mouth of the gallery slot
  { x: -10.3, z: -0.9 }, // 17 view north-blade east work (project 1)
  { x: -13.7, z: -0.1 }, // 18 view north-blade west work (project 2)
  { x: -16.6, z: -1.9 }, // 19 U-turn at the west end
  { x: -14.7, z: -3.9 }, // 20 view south-blade west work (project 3)
  { x: -11.3, z: -3.7 }, // 21 view south-blade east work (project 4)
  { x: -8.2, z: -5.6 }, // 22 out of the slot
  { x: -3.5, z: -7.6 }, // 23 across the open south of the hall
  { x: 2.5, z: -7.2 }, // 24 the long sightline back through everything
  { x: 8, z: -6.6 }, // 25 toward the studio zone
  { x: 13, z: -4.8 }, // 26 studio south
  { x: 13.4, z: -0.6 }, // 27 studio stop — the plinth
  { x: 11.6, z: 2.9 }, // 28 through the gap between the studio blades
  { x: 7.2, z: 4.6 }, // 29 back toward the centre
  { x: 3.0, z: 2.8 }, // 30 atrium east
  { x: 0, z: 0.6 }, // 31 end — the open centre of the hall
];

export const RAIL_CURVE = new THREE.CatmullRomCurve3(
  STOPS.map((s) => new THREE.Vector3(s.x, s.y ?? EYE_Y, s.z)),
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

// Where map-HUD jumps land, per room. The archive is the outdoor garden.
export const ROOM_T: Record<RoomId, number> = {
  plaza: tOfStop(2),
  // The garden stop: abreast of the middle of the pedestal line.
  archive: tNearest(0, 29.5),
  giftshop: tOfStop(11),
  atrium: tOfStop(31),
  gallery: tOfStop(17),
  studio: tOfStop(27),
};

// Where the walk passes closest to each exhibit.
export const EXHIBIT_T: Record<string, number> = Object.fromEntries(
  GALLERY_PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length).map((p, i) => {
    const [ex, , ez] = GALLERY_EXHIBIT_SLOTS[i].position;
    return [p.slug, tNearest(ex, ez)];
  }),
);

// Where the walk passes closest to each garden sculpture (the axis point
// abreast of its pedestal).
export const SCULPTURE_T: Record<string, number> = Object.fromEntries(
  getProjectsByWing('archive').map((p, i) => [p.slug, tNearest(0, sculptureZ(i))]),
);

// Points of interest the camera softly turns toward while walking past.
export type Poi = {
  target: THREE.Vector3;
  t: number;
  radius: number; // influence radius in metres of path length
};

// The flagships hang on partition faces looking toward the open centre, so
// they must be gazed at from spots in front of those faces — the nearest
// rail point can be behind them.
const FEATURE_VIEWPOINTS: Record<string, [number, number]> = {
  'pos-system': [-1.2, 3.4], // seen from the atrium axis on the way in
  'thi-website': [7.2, 4.6], // seen crossing back from the studio zone
};

export const POIS: Poi[] = [
  // Arrival: hold the facade so the building grows in frame on the descent
  { target: new THREE.Vector3(0, 3.4, 14), t: tNearest(0, 47), radius: 8 },
  // The procession — stele right, pool right, sculptures left, then the doors
  { target: new THREE.Vector3(2.7, 1.6, 38.8), t: tNearest(0, 39.5), radius: 3 },
  // Glance at the pool before the garden line takes over — their t ranges
  // must not overlap or the two gazes average out to nothing.
  { target: new THREE.Vector3(-5.7, 0.2, 26), t: tNearest(0, 33), radius: 2.5 },
  ...getProjectsByWing('archive').map((p, i) => ({
    target: new THREE.Vector3(GARDEN_X, 1.3, sculptureZ(i)),
    t: SCULPTURE_T[p.slug],
    radius: 3,
  })),
  // Kept low and early so the gaze meets the doors, not the canopy soffit.
  { target: new THREE.Vector3(0, 3, 15.5), t: tNearest(0, 22), radius: 3 },
  { target: new THREE.Vector3(0, 2.1, 14.1), t: tNearest(0, 15.8), radius: 3 },
  // Gallery exhibits
  ...GALLERY_PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length).map((p, i) => {
    const [ex, ey, ez] = GALLERY_EXHIBIT_SLOTS[i].position;
    return {
      target: new THREE.Vector3(ex, ey, ez),
      t: EXHIBIT_T[p.slug],
      radius: 3,
    };
  }),
  // Atrium flagship displays on the partition faces
  ...ATRIUM_FEATURE_SLOTS.map((f) => {
    const [fx, fy, fz] = f.position;
    const [vx, vz] = FEATURE_VIEWPOINTS[f.slug] ?? [fx, fz];
    return {
      target: new THREE.Vector3(fx, fy, fz),
      t: tNearest(vx, vz),
      radius: 3.5,
    };
  }),
  // Plinths: gift shop, studio
  { target: new THREE.Vector3(5.4, 1.2, 10.8), t: tNearest(4.6, 9.7), radius: 2.5 },
  { target: new THREE.Vector3(14.2, 1.2, 1.6), t: tNearest(13.4, -0.6), radius: 3 },
  // Visitor sketch wall on the gift-shop screen blade
  { target: new THREE.Vector3(8.9, 1.9, 10), t: tNearest(4.6, 9.7), radius: 2 },
];
