'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Sky } from '@react-three/drei';
import { Suspense } from 'react';
import ScrollRig from './ScrollRig';
import MuseumShell from './MuseumShell';
import Exterior from './Exterior';
import Lighting from './Lighting';
import Exhibit from './Exhibit';
import Plinth from './Plinth';
import Props from './Props';
import SketchWall from './SketchWall';
import DirectoryBanner from './DirectoryBanner';
import DisplayCar from './DisplayCar';
import { PROJECTS, getProjectsByWing } from '@/lib/projects';
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

const placedProjects = getProjectsByWing('gallery').slice(
  0,
  GALLERY_EXHIBIT_SLOTS.length,
);
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

  const handleGiftshopPlinth = () => {
    cameraBus.glideToWaypoint('giftshop', () => {
      useMuseumStore.getState().openGiftshop();
    });
  };

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 4.2, 50], fov }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Golden hour: warm fallback colour, sunset sky, haze toward the horizon. */}
      <color attach="background" args={['#E4B98E']} />
      <fog attach="fog" args={['#E4B98E', 42, 130]} />
      <Sky
        distance={450}
        sunPosition={[-30, 5, 18]}
        turbidity={6.5}
        rayleigh={2.2}
        mieCoefficient={0.018}
        mieDirectionalG={0.88}
      />
      <Environment preset="sunset" environmentIntensity={0.7} />
      <Lighting />
      <ScrollRig />

      <Suspense fallback={null}>
        <MuseumShell
          onRoomClick={(id) => {
            cameraBus.glideToWaypoint(id);
          }}
        />
        <Exterior />

        <Plinth position={[14.2, 0, 1.6]} onClick={handleStudioPlinth} />
        <Plinth position={[5.4, 0, 10.8]} onClick={handleGiftshopPlinth} />

        <Props />
        <SketchWall />
        <DirectoryBanner />
        <DisplayCar />

        {placedProjects.map((project, i) => {
          const slot = GALLERY_EXHIBIT_SLOTS[i];
          return (
            <Exhibit
              key={project.slug}
              position={slot.position}
              rotation={slot.rotation}
              image={project.hero}
              projectSlug={project.slug}
              caption={project.title}
              width={GALLERY_EXHIBIT_SIZE.width}
              height={GALLERY_EXHIBIT_SIZE.height}
              onSelect={handleExhibitSelect}
            />
          );
        })}

        {ATRIUM_FEATURE_SLOTS.map((feature) => {
          const project = projectBySlug(feature.slug);
          if (!project) return null;
          return (
            <Exhibit
              key={`feature-${feature.slug}`}
              position={feature.position}
              rotation={feature.rotation}
              image={project.hero}
              projectSlug={project.slug}
              caption={project.title}
              width={ATRIUM_FEATURE_SIZE.width}
              height={ATRIUM_FEATURE_SIZE.height}
              onSelect={handleFeatureSelect}
            />
          );
        })}
      </Suspense>
    </Canvas>
  );
}
