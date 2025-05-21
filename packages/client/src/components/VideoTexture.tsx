// VideoTexture.tsx
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';

type Props = {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export default function VideoTexture({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: Props) {
  const texture = useVideoTexture(url, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: 'anonymous',
    playsInline: true,
  });

  if (!texture) return null; // nothing until first frame decoded

  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
