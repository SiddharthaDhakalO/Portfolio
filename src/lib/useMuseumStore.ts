import { create } from 'zustand';

export const ROOM_IDS = ['atrium', 'gallery', 'studio', 'archive', 'giftshop'] as const;
export type RoomId = (typeof ROOM_IDS)[number];

export type OverlayType = 'exhibit' | 'studio' | 'archive' | 'giftshop' | 'sketch';

type MuseumStore = {
  currentRoom: RoomId;
  selectedSlug: string | null;
  activeOverlay: OverlayType | null;
  setCurrentRoom: (room: RoomId) => void;
  openExhibit: (slug: string) => void;
  openStudio: () => void;
  openArchive: () => void;
  openGiftshop: () => void;
  openSketch: () => void;
  closeOverlay: () => void;
};

export const useMuseumStore = create<MuseumStore>((set) => ({
  currentRoom: 'atrium',
  selectedSlug: null,
  activeOverlay: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  openExhibit: (slug) => set({ selectedSlug: slug, activeOverlay: 'exhibit' }),
  openStudio: () => set({ activeOverlay: 'studio' }),
  openArchive: () => set({ activeOverlay: 'archive' }),
  openGiftshop: () => set({ activeOverlay: 'giftshop' }),
  openSketch: () => set({ activeOverlay: 'sketch' }),
  closeOverlay: () => set({ activeOverlay: null, selectedSlug: null }),
}));

// Waypoint name → currentRoom mapping. Exhibit waypoints all live in the gallery.
export function inferRoom(waypointName: string): RoomId | null {
  if (waypointName.startsWith('exhibit:')) return 'gallery';
  if ((ROOM_IDS as readonly string[]).includes(waypointName)) {
    return waypointName as RoomId;
  }
  return null;
}
