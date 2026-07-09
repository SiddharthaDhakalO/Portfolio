'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';
import ScrollRig from './ScrollRig';
import MuseumShell from './MuseumShell';
import Lighting from './Lighting';
import Exhibit from './Exhibit';
import Plinth from './Plinth';
import Props from './Props';
import SketchWall from './SketchWall';
import WallDisplay from './WallDisplay';
import { ARCHIVE_DISPLAYS, ARCHIVE_DISPLAY_SIZE } from '@/lib/archiveDisplays';
import { PROJECTS } from '@/lib/projects';
import {
  GALLERY_EXHIBIT_SLOTS,
  GALLERY_EXHIBIT_SIZE,
  ATRIUM_FEATURE_SLOTS,
  ATRIUM_FEATURE_SIZE,
  exhibitWaypointName,
} from '@/lib/exhibitSlots';
import { cameraBus } from '@/lib/cameraBus';
import { useMuseumStore } from '@/lib/useMuseumStore';

type SceneProps = {
  fov?: number;
};

const placedProjects = PROJECTS.slice(0, GALLERY_EXHIBIT_SLOTS.length);
const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export default function Scene({ fov = 60 }: SceneProps) {
  // Gallery exhibits: walk the rail to the piece, then open its case study.
  const handleExhibitSelect = (slug: string) => {
    cameraBus.glideToWaypoint(exhibitWaypointName(slug), () => {
      useMuseumStore.getState().openExhibit(slug);
    });
  };

  // Atrium flagships: you're already at the hub, so open the case study directly.
  const handleFeatureSelect = (slug: string) => {
    useMuseumStore.getState().openExhibit(slug);
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
      camera={{ position: [0, 1.6, 12.6], fov }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#D8DEE3']} />
      <Environment preset="lobby" environmentIntensity={0.9} />
      <Lighting />
      <ScrollRig />

      <Suspense fallback={null}>
        <MuseumShell
          onRoomClick={(id) => {
            cameraBus.glideToWaypoint(id);
          }}
        />

        <Plinth position={[-12, 0, 0]} onClick={handleStudioPlinth} />
        <Plinth position={[12, 0, 0]} onClick={handleArchivePlinth} />
        <Plinth position={[0, 0, 10]} onClick={handleGiftshopPlinth} />

        <Props />
        <SketchWall />

        {ARCHIVE_DISPLAYS.map((d) => (
          <WallDisplay
            key={d.id}
            position={d.position}
            rotation={d.rotation}
            image={d.image}
            caption={d.caption}
            width={ARCHIVE_DISPLAY_SIZE.width}
            height={ARCHIVE_DISPLAY_SIZE.height}
          />
        ))}

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
