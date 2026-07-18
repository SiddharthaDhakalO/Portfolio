import { ROOM_T, EXHIBIT_T, SCULPTURE_T } from './railPath';
import type { RoomId } from './useMuseumStore';

// Low-level rail bus: the ScrollRig subscribes and walks to a path parameter.
type RailHandler = (t: number, onArrive?: () => void) => void;

let railHandler: RailHandler | null = null;

export const railBus = {
  subscribe(h: RailHandler): () => void {
    railHandler = h;
    return () => {
      if (railHandler === h) railHandler = null;
    };
  },
  walkTo(t: number, onArrive?: () => void) {
    railHandler?.(t, onArrive);
  },
};

// High-level API kept from the glide era: named destinations. Room names,
// 'exhibit:<slug>' and 'sculpture:<slug>' resolve to rail positions.
export const cameraBus = {
  glideToWaypoint(name: string, onArrive?: () => void) {
    if (name.startsWith('exhibit:')) {
      const slug = name.slice('exhibit:'.length);
      const t = EXHIBIT_T[slug];
      if (t !== undefined) railBus.walkTo(t, onArrive);
      return;
    }
    if (name.startsWith('sculpture:')) {
      const slug = name.slice('sculpture:'.length);
      const t = SCULPTURE_T[slug];
      if (t !== undefined) railBus.walkTo(t, onArrive);
      return;
    }
    const t = ROOM_T[name as RoomId];
    if (t !== undefined) railBus.walkTo(t, onArrive);
  },
};
