// VideoTexture.tsx
import { useVideoTexture } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

type Props = {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

function InnerMaterial({ url }: { url: string }) {
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
    <meshBasicMaterial
      map={texture}
      toneMapped={false}
      side={THREE.DoubleSide}
    />
  );
}

export default function VideoTexture({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: Props) {
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Update matrices for world position
    mesh.updateMatrixWorld();

    // Update frustum from the camera
    projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(projScreenMatrix);

    if (!mesh.geometry.boundingSphere) {
      mesh.geometry.computeBoundingSphere();
    }

    const sphere = mesh.geometry.boundingSphere!.clone();
    sphere.applyMatrix4(mesh.matrixWorld);

    const isVisible = frustum.intersectsSphere(sphere);
    if (isVisible !== visible) setVisible(isVisible);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[16, 9]} />
      {visible && <InnerMaterial url={url} />}
    </mesh>
  );
}
