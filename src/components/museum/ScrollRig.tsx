'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RAIL_CURVE, RAIL_LENGTH, EYE_Y, POIS } from '@/lib/railPath';
import { railBus } from '@/lib/cameraBus';
import { ZONES, FLOOR_W, FLOOR_D, GLASS_Z } from '@/lib/floorplan';
import { useMuseumStore, type RoomId } from '@/lib/useMuseumStore';

const SCROLL_SPEED = 0.9 / RAIL_LENGTH; // metres of walk per wheel "line"
const TOUCH_SPEED = 0.045 / RAIL_LENGTH; // metres per pixel of drag
const KEY_SPEED = 6 / RAIL_LENGTH; // metres per second held
const DAMP = 2.2;
const MAX_SPEED = 10 / RAIL_LENGTH; // cap walk speed (m/s in t units)
const LOOK_AHEAD = 2.6 / RAIL_LENGTH;
const ARRIVE_EPS = 1.5 / RAIL_LENGTH;

// Zones ordered smallest-footprint first so border overlaps resolve to the
// tighter zone. In the free plan these are proximity regions, not rooms.
const ZONE_BOUNDS = [...ZONES]
  .sort((a, b) => a.size[0] * a.size[1] - b.size[0] * b.size[1])
  .map((r) => ({
    id: r.id,
    minX: r.center[0] - r.size[0] / 2,
    maxX: r.center[0] + r.size[0] / 2,
    minZ: r.center[1] - r.size[1] / 2,
    maxZ: r.center[1] + r.size[1] / 2,
  }));

function roomAt(x: number, z: number): RoomId | null {
  for (const b of ZONE_BOUNDS) {
    if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) return b.id;
  }
  // Inside the envelope but in no zone — the open centre reads as atrium.
  if (Math.abs(x) <= FLOOR_W / 2 && Math.abs(z) <= FLOOR_D / 2) return 'atrium';
  // North of the glass line is the forecourt.
  if (z > GLASS_Z) return 'plaza';
  return null;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function ScrollRig() {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  const currentT = useRef(0);
  const targetT = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const look = useRef({ yaw: 0, pitch: 0 });
  const keys = useRef({ fwd: false, back: false });
  const pending = useRef<{ t: number; onArrive?: () => void } | null>(null);
  const lastRoom = useRef<RoomId | null>(null);

  // Scratch vectors reused every frame to avoid GC churn.
  const scratch = useRef({
    pos: new THREE.Vector3(),
    ahead: new THREE.Vector3(),
    tgt: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    poiSum: new THREE.Vector3(),
  });
  // Temporally smoothed gaze target — kills snapping when the dominant
  // point-of-interest changes between neighbouring exhibits.
  const smoothTgt = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const el = gl.domElement;

    const overlayOpen = () => useMuseumStore.getState().activeOverlay !== null;

    const onWheel = (e: WheelEvent) => {
      if (overlayOpen()) return;
      const lines = e.deltaMode === 1 ? e.deltaY : e.deltaY / 40;
      targetT.current = THREE.MathUtils.clamp(
        targetT.current + lines * SCROLL_SPEED,
        0,
        1,
      );
      pending.current = null;
    };

    let dragging = false;
    let lastY = 0;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        dragging = true;
        lastY = e.clientY;
      }
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current = { x: nx, y: ny };
    };
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current = { x: nx, y: ny };
      if (dragging && !overlayOpen()) {
        const dy = e.clientY - lastY;
        lastY = e.clientY;
        targetT.current = THREE.MathUtils.clamp(
          targetT.current + dy * TOUCH_SPEED,
          0,
          1,
        );
        pending.current = null;
      }
    };
    const onPointerUp = () => {
      dragging = false;
    };

    const onKey = (down: boolean) => (e: KeyboardEvent) => {
      if (overlayOpen()) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        keys.current.fwd = down;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        keys.current.back = down;
      }
    };
    const onKeyDown = onKey(true);
    const onKeyUp = onKey(false);

    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const unsub = railBus.subscribe((t, onArrive) => {
      targetT.current = THREE.MathUtils.clamp(t, 0, 1);
      pending.current = { t: targetT.current, onArrive };
      if (prefersReducedMotion()) {
        currentT.current = targetT.current;
      }
    });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      unsub();
    };
  }, [gl]);

  useFrame((_state, dt) => {
    const delta = Math.min(dt, 0.05);

    if (keys.current.fwd) {
      targetT.current = Math.min(1, targetT.current + KEY_SPEED * delta);
      pending.current = null;
    }
    if (keys.current.back) {
      targetT.current = Math.max(0, targetT.current - KEY_SPEED * delta);
      pending.current = null;
    }

    // Damped approach with a speed cap so long jumps read as a brisk walk.
    const diff = targetT.current - currentT.current;
    let step = diff * Math.min(1, DAMP * delta);
    const maxStep = MAX_SPEED * delta;
    if (Math.abs(step) > maxStep) step = Math.sign(step) * maxStep;
    // Snap tiny remainders so we actually arrive.
    if (Math.abs(diff) < 0.0004) {
      currentT.current = targetT.current;
    } else {
      currentT.current += step;
    }
    const t = THREE.MathUtils.clamp(currentT.current, 0, 1);

    const { pos, ahead, tgt, dir, poiSum } = scratch.current;
    RAIL_CURVE.getPointAt(t, pos);
    RAIL_CURVE.getPointAt(Math.min(1, t + LOOK_AHEAD), ahead);
    ahead.y = EYE_Y;

    // Blend the gaze toward nearby points of interest. All POIs in range are
    // averaged by weight (not winner-takes-all) so the gaze hands over
    // smoothly when one exhibit's influence fades into the next one's.
    poiSum.set(0, 0, 0);
    let sumW = 0;
    for (const poi of POIS) {
      const dMetres = Math.abs(poi.t - t) * RAIL_LENGTH;
      if (dMetres < poi.radius) {
        const lin = 1 - dMetres / poi.radius;
        const w = lin * lin * (3 - 2 * lin); // smoothstep ease in/out
        poiSum.addScaledVector(poi.target, w);
        sumW += w;
      }
    }
    if (sumW > 0) {
      poiSum.divideScalar(sumW);
      const blend = Math.min(0.85, sumW);
      tgt.lerpVectors(ahead, poiSum, blend);
    } else {
      tgt.copy(ahead);
    }

    // Temporal smoothing on top: the actual gaze eases toward the desired
    // target rather than jumping with it.
    if (!smoothTgt.current) {
      smoothTgt.current = tgt.clone();
    } else {
      smoothTgt.current.lerp(tgt, Math.min(1, 4.5 * delta));
    }
    tgt.copy(smoothTgt.current);

    // Gentle mouse look layered on top.
    const wantYaw = -mouse.current.x * 0.38;
    const wantPitch = -mouse.current.y * 0.18;
    look.current.yaw += (wantYaw - look.current.yaw) * Math.min(1, 6 * delta);
    look.current.pitch +=
      (wantPitch - look.current.pitch) * Math.min(1, 6 * delta);

    dir.subVectors(tgt, pos);
    const len = dir.length() || 1;
    dir.normalize();
    dir.applyAxisAngle(THREE.Object3D.DEFAULT_UP, look.current.yaw);
    dir.y += look.current.pitch;
    dir.normalize();
    tgt.copy(pos).addScaledVector(dir, len);

    camera.position.copy(pos);
    camera.lookAt(tgt);

    // Room tracking for the HUD.
    const room = roomAt(pos.x, pos.z);
    if (room && room !== lastRoom.current) {
      lastRoom.current = room;
      useMuseumStore.getState().setCurrentRoom(room);
    }

    // Fire pending arrival callback (map jumps / exhibit walks).
    if (pending.current && Math.abs(t - pending.current.t) < ARRIVE_EPS) {
      const cb = pending.current.onArrive;
      pending.current = null;
      cb?.();
    }
  });

  return null;
}
