import type { WaypointName } from './waypoints';

type Handler = (name: WaypointName, onArrive?: () => void) => void;

let handler: Handler | null = null;

export const cameraBus = {
  subscribe(h: Handler): () => void {
    handler = h;
    return () => {
      if (handler === h) handler = null;
    };
  },
  glideToWaypoint(name: WaypointName, onArrive?: () => void) {
    handler?.(name, onArrive);
  },
};
