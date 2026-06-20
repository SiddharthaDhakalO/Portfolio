'use client';

import dynamic from 'next/dynamic';
import MapHUD from '@/components/museum/MapHUD';
import MuseumLoader from '@/components/museum/MuseumLoader';
import ExhibitOverlay from '@/components/overlay/ExhibitOverlay';
import StudioOverlay from '@/components/overlay/StudioOverlay';
import ArchiveOverlay from '@/components/overlay/ArchiveOverlay';
import GiftShopOverlay from '@/components/overlay/GiftShopOverlay';

const Scene = dynamic(() => import('@/components/museum/Scene'), {
  ssr: false,
});

const FEEL = {
  smoothTime: 0.8,
  distance: 3,
  fov: 55,
};

export default function MuseumPage() {
  return (
    <main style={{ width: '100vw', height: '100dvh', background: '#0E0E0E' }}>
      <Scene {...FEEL} />
      <MuseumLoader />
      <MapHUD />
      <ExhibitOverlay />
      <StudioOverlay />
      <ArchiveOverlay />
      <GiftShopOverlay />
    </main>
  );
}
