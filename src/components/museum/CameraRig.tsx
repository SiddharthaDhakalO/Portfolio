'use client';

import { CameraControls } from '@react-three/drei';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentRef,
} from 'react';
import { cameraBus } from '@/lib/cameraBus';
import { WAYPOINTS, type WaypointName } from '@/lib/waypoints';
import { inferRoom, useMuseumStore } from '@/lib/useMuseumStore';

type ControlsRef = ComponentRef<typeof CameraControls>;

export type CameraRigHandle = {
  glideTo: (x: number, z: number) => void;
  glideToWaypoint: (name: WaypointName, onArrive?: () => void) => void;
  controls: () => ControlsRef | null;
};

type Props = {
  smoothTime?: number;
  distance?: number;
};

export const CameraRig = forwardRef<CameraRigHandle, Props>(function CameraRig(
  { smoothTime = 0.8, distance = 3 },
  ref,
) {
  const controlsRef = useRef<ControlsRef>(null);
  // Tracks the currently pending 'rest' handler so successive glides don't
  // accumulate listeners (which would fire all onArrives once motion settles).
  const pendingRestRef = useRef<(() => void) | null>(null);

  const glide = (name: WaypointName, onArrive?: () => void) => {
    const controls = controlsRef.current;
    const wp = WAYPOINTS[name];
    if (!controls || !wp) return;

    const [ex, ey, ez] = wp.eye;
    const [tx, ty, tz] = wp.target;
    controls.setLookAt(ex, ey, ez, tx, ty, tz, true);

    if (pendingRestRef.current) {
      controls.removeEventListener('rest', pendingRestRef.current);
      pendingRestRef.current = null;
    }

    const onRest = () => {
      controls.removeEventListener('rest', onRest);
      pendingRestRef.current = null;
      const room = inferRoom(name);
      if (room) useMuseumStore.getState().setCurrentRoom(room);
      onArrive?.();
    };
    pendingRestRef.current = onRest;
    controls.addEventListener('rest', onRest);
  };

  useImperativeHandle(
    ref,
    () => ({
      glideTo: (x, z) => {
        controlsRef.current?.setLookAt(x, 1.6, z + distance, x, 1.6, z, true);
      },
      glideToWaypoint: (name, onArrive) => glide(name, onArrive),
      controls: () => controlsRef.current,
    }),
    [distance],
  );

  useEffect(
    () => cameraBus.subscribe((name, onArrive) => glide(name, onArrive)),
    [],
  );

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={smoothTime}
      draggingSmoothTime={smoothTime}
    />
  );
});
