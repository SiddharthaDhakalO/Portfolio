// Large framed displays hanging on the archive walls — certificates and
// reserved spots for future projects. Replace the dummy images in
// /public/archive/ with real certificate scans / screenshots as they arrive.
export type ArchiveDisplay = {
  id: string;
  image: string;
  caption: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

// Archive room: centre (12, 0), size 10 × 14 → x ∈ [7, 17], z ∈ [-7, 7].
// East wall (x = 17) faces the entrance — certificates hang there.
// North (z = 7) and south (z = -7) walls hold the reserved project frames.
const WALL_INSET = 0.12;
const Y = 2;

export const ARCHIVE_DISPLAYS: ArchiveDisplay[] = [
  {
    id: 'cert-1',
    image: '/archive/cert-1.jpg',
    caption: 'Certificate of Achievement',
    position: [17 - WALL_INSET, Y, -3.6],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: 'cert-2',
    image: '/archive/cert-2.jpg',
    caption: 'Certificate of Participation',
    position: [17 - WALL_INSET, Y, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: 'cert-3',
    image: '/archive/cert-3.jpg',
    caption: 'Course Completion',
    position: [17 - WALL_INSET, Y, 3.6],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: 'upcoming-1',
    image: '/archive/upcoming-1.jpg',
    caption: 'Future Acquisition I',
    position: [10.5, Y, -7 + WALL_INSET],
    rotation: [0, 0, 0],
  },
  {
    id: 'upcoming-2',
    image: '/archive/upcoming-2.jpg',
    caption: 'Future Acquisition II',
    position: [14.5, Y, -7 + WALL_INSET],
    rotation: [0, 0, 0],
  },
  {
    id: 'upcoming-3',
    image: '/archive/upcoming-3.jpg',
    caption: 'Future Acquisition III',
    position: [12.5, Y, 7 - WALL_INSET],
    rotation: [0, Math.PI, 0],
  },
];

export const ARCHIVE_DISPLAY_SIZE = { width: 2.6, height: 1.82 };
