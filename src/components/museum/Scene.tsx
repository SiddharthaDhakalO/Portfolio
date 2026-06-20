'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { CameraRig, type CameraRigHandle } from './CameraRig';
import MuseumShell from './MuseumShell';
import Lighting from './Lighting';
import Exhibit from './Exhibit';
import Plinth from './Plinth';
import { PROJECTS } from '@/lib/projects';
import { GALLERY_EXHIBIT_SLOTS, exhibitWaypointName } from '@/lib/exhibitSlots';
import { cameraBus } from '@/lib/cameraBus';
import { useMuseumStore } from '@/lib/useMuseumStore';

type SceneProps = {
  smoothTime?: number;
  distance?: number;
  fov?: number;
};

const placedProjects = PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length);

export default function Scene({
  smoothTime = 0.8,
  distance = 3,
  fov = 55,
}: SceneProps) {
  const rigRef = useRef<CameraRigHandle>(null);

  const handleExhibitSelect = (slug: string) => {
    cameraBus.glideToWaypoint(exhibitWaypointName(slug), () => {
      useMuseumStore.getState().openExhibit(slug);
    });
  };

  const handleStudioPlinth = () => {
    cameraBus.glideToWaypoint('studio', () => {
      useMuseumStore.getState().openStudio();
    });
  };

  const handleArchivePlinth = () => {
    cameraBus.glideToWaypoint('archive', () => {
      useMuseumStore.getState().openArchive();
    });
  };

  const handleGiftshopPlinth = () => {
    cameraBus.glideToWaypoint('giftshop', () => {
      useMuseumStore.getState().openGiftshop();
    });
  };

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.6, 5], fov }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0E0E0E']} />
      <Environment preset="lobby" environmentIntensity={0.9} />
      <Lighting />
      <CameraRig ref={rigRef} smoothTime={smoothTime} distance={distance} />

      <MuseumShell
        onRoomClick={(_id, center) => {
          rigRef.current?.glideTo(center[0], center[1]);
        }}
      />

      {/* Studio plinth — clicking glides into the studio and opens the About overlay. */}
      <Plinth position={[-12, 0, 0]} onClick={handleStudioPlinth} />
      {/* Archive plinth — clicking glides in and opens the Archive overlay. */}
      <Plinth position={[12, 0, 0]} onClick={handleArchivePlinth} />
      {/* Gift-shop plinth — clicking glides in and opens the Contact overlay. */}
      <Plinth position={[0, 0, 10]} onClick={handleGiftshopPlinth} />

      <Suspense fallback={null}>
        {placedProjects.map((project, i) => {
          const slot = GALLERY_EXHIBIT_SLOTS[i];
          return (
            <Exhibit
              key={project.slug}
              position={slot.position}
              rotation={slot.rotation}
              image={project.hero}
              projectSlug={project.slug}
              onSelect={handleExhibitSelect}
            />
          );
        })}
      </Suspense>
    </Canvas>
  );
}
