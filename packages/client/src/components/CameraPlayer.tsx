import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier } from '@react-three/rapier';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import useKeyboardControls from '../hooks/useKeyboardControls';

export default function CameraPlayer() {
  const ref = useRef<any>(null);
  const { camera } = useThree();
  const keys = useKeyboardControls();

  const direction = new THREE.Vector3();
  const right = new THREE.Vector3();
  const velocity = new THREE.Vector3();

  useFrame(() => {
    if (!ref.current) return;

    const body = ref.current;

    direction.set(0, 0, 0);
    if (keys.w) direction.z -= 1;
    if (keys.s) direction.z += 1;
    if (keys.a) direction.x += 1;
    if (keys.d) direction.x -= 1;

    direction.normalize();

    const moveSpeed = 3;
    direction.multiplyScalar(moveSpeed);

    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    right.crossVectors(new THREE.Vector3(0, 1, 0), camDir).normalize();

    velocity
      .copy(camDir)
      .multiplyScalar(-direction.z)
      .add(right.multiplyScalar(direction.x));

    body.setLinvel({ x: velocity.x, y: 0, z: velocity.z }, true);

    const pos = body.translation();
    camera.position.set(pos.x, pos.y + 0.5, pos.z);
  });

  return (
    <>
      <PointerLockControls />
      <RigidBody
        ref={ref}
        type="dynamic"
        position={[0, 1, 0]}
        mass={1}
        enabledRotations={[false, false, false]}
        colliders={false} // Prevent auto-generation from child mesh
      >
        {/* Optional invisible mesh for debugging */}
        <mesh visible={false}>
          <capsuleGeometry args={[0.3, 0.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Physics collider */}
        <CapsuleCollider args={[0.5, 0.3]} />
      </RigidBody>
    </>
  );
}
