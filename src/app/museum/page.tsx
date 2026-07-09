'use client';

import dynamic from 'next/dynamic';
import ExhibitOverlay from '@/components/overlay/ExhibitOverlay';
import StudioOverlay from '@/components/overlay/StudioOverlay';
import ArchiveOverlay from '@/components/overlay/ArchiveOverlay';
import GiftShopOverlay from '@/components/overlay/GiftShopOverlay';
import SketchOverlay from '@/components/overlay/SketchOverlay';
import ViewToggle from '@/components/museum/ViewToggle';
import { useDeviceMode } from '@/lib/useDeviceMode';

// Both modes are dynamically imported so only the chosen one's chunk is
// downloaded. Phones never pay for the 3D bundle.
const Museum3D = dynamic(() => import('@/components/museum/Museum3D'), {
  ssr: false,
  loading: () => null,
});
const ClassicMuseum = dynamic(() => import('@/components/museum/ClassicMuseum'), {
  ssr: false,
  loading: () => null,
});

export default function MuseumPage() {
  const { ready, isMobile, effectiveMode, setMode } = useDeviceMode();

  return (
    <main style={{ width: '100vw', minHeight: '100dvh', background: '#0E0E0E' }}>
      {ready &&
        (effectiveMode === '3d' ? (
          <div style={{ width: '100vw', height: '100dvh' }}>
            <Museum3D />
          </div>
        ) : (
          <ClassicMuseum />
        ))}

      {ready && !isMobile && <ViewToggle current={effectiveMode} setMode={setMode} />}

      <ExhibitOverlay />
      <StudioOverlay />
      <ArchiveOverlay />
      <GiftShopOverlay />
      <SketchOverlay />
    </main>
  );
}
