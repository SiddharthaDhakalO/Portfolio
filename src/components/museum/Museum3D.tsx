'use client';

import Scene from './Scene';
import MuseumLoader from './MuseumLoader';
import MapHUD from './MapHUD';
import ScrollHint from './ScrollHint';

export default function Museum3D() {
  return (
    <>
      <Scene fov={60} />
      <MuseumLoader />
      <MapHUD />
      <ScrollHint />
    </>
  );
}
