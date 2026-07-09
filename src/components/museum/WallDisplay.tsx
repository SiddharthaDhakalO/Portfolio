'use client';

import { useTexture, Text } from '@react-three/drei';

const FRAME_COLOR = '#C9A961';
const FRAME_BORDER = 0.08;
const FRAME_DEPTH = 0.07;
const MAT_BORDER = 0.1;

type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  image: string;
  caption?: string;
  width?: number;
  height?: number;
};

// A large, elegant, non-interactive framed display: gold frame, off-white mat,
// the image, and a small caption plate beneath. Used for certificates and
// reserved project spots in the archive.
export default function WallDisplay({
  position,
  rotation = [0, 0, 0],
  image,
  caption,
  width = 2.6,
  height = 1.82,
}: Props) {
  const texture = useTexture(image);

  const frameW = width + MAT_BORDER * 2 + FRAME_BORDER * 2;
  const frameH = height + MAT_BORDER * 2 + FRAME_BORDER * 2;

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[frameW, frameH, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Mat board */}
      <mesh position={[0, 0, FRAME_DEPTH / 2 + 0.004]}>
        <planeGeometry args={[width + MAT_BORDER * 2, height + MAT_BORDER * 2]} />
        <meshStandardMaterial color="#F0EADC" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, FRAME_DEPTH / 2 + 0.009]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {caption && (
        <group position={[0, -frameH / 2 - 0.14, 0]}>
          <mesh>
            <boxGeometry args={[Math.min(1.6, frameW * 0.6), 0.16, 0.02]} />
            <meshStandardMaterial color="#2A2622" roughness={0.5} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            fontSize={0.07}
            color={FRAME_COLOR}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.18}
          >
            {caption.toUpperCase()}
          </Text>
        </group>
      )}
    </group>
  );
}
