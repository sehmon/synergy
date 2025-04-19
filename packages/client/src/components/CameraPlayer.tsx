import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import useKeyboardControls from '../hooks/useKeyboardControls';
import useJoystickControls from '../hooks/useJoystickControls';
import TrailRenderer from './TrailRenderer';
import { useAtom } from 'jotai';
import { positionAtom } from '../state/position';
// MobileJoysticks is rendered at App level

export default function CameraPlayer() {
  // Use the correct RapierRigidBody type from @react-three/rapier
  const ref = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const { joystickState, rotationState, moveJoystick } = useJoystickControls();
  const [isMobile, setIsMobile] = useState(false);
  const [showTrail, setShowTrail] = useState(true);

  const [_, setPositionHistory] = useAtom(positionAtom);

  // Add global toggle function
  useEffect(() => {
    window.toggleTrail = () => {
      setShowTrail((prev) => !prev);
    };

    return () => {
      window.toggleTrail = undefined;
    };
  }, []);

  const positionHistoryRef = useRef<THREE.Vector3[]>([]);

  // Detect if we're on mobile and set up camera
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    // Initialize camera to be level
    camera.rotation.x = 0;
    camera.rotation.z = 0;

    // Create a function to force camera to stay level
    const keepCameraLevel = () => {
      camera.rotation.x = 0;
      camera.rotation.z = 0;
    };

    // Add event listener to keep camera level on device orientation change
    window.addEventListener('deviceorientation', keepCameraLevel);

    return () => {
      window.removeEventListener('deviceorientation', keepCameraLevel);
    };
  }, [camera]);

  const direction = new THREE.Vector3();
  const right = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  // Camera rotation is handled directly

  useFrame((_, delta) => {
    if (!ref.current) return;

    const body = ref.current;

    // Handle movement input - combine keyboard and joystick
    direction.set(0, 0, 0);

    // Keyboard controls
    if (keys.w) direction.z -= 1;
    if (keys.s) direction.z += 1;
    if (keys.a) direction.x += 1;
    if (keys.d) direction.x -= 1;

    // Add joystick movement if active
    if (moveJoystick.active && isMobile) {
      direction.z -= joystickState.forward;
      direction.x += joystickState.right;
    }

    // If we have any movement, normalize it
    if (direction.lengthSq() > 0) {
      direction.normalize();
    }

    const moveSpeed = 3;
    direction.multiplyScalar(moveSpeed);

    // Apply camera rotation to movement
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

    // Update camera position
    const pos = body.translation();
    camera.position.set(pos.x, pos.y + 0.5, pos.z);

    // Handle camera rotation using rotationState
    if (isMobile) {
      // Apply rotation using the rotationState values instead of raw joystick position
      const lookSensitivity = 2.0;

      // Apply horizontal rotation from joystick, keeping the camera level
      if (rotationState.rotateY !== 0) {
        camera.rotation.y += rotationState.rotateY * delta * lookSensitivity;
      }

      // Always keep camera level by forcing X and Z rotation to zero
      camera.rotation.x = 0;
      camera.rotation.z = 0;
    }
  });

  const lastPositionRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const pos = ref.current?.translation();
      if (!pos) return;

      const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);

      if (
        !lastPositionRef.current ||
        !lastPositionRef.current.equals(currentPos)
      ) {
        lastPositionRef.current = currentPos.clone();
        positionHistoryRef.current.push(currentPos.clone());
        setPositionHistory(positionHistoryRef.current);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* Only use PointerLockControls on desktop */}
      {!isMobile && <PointerLockControls />}

      {/* Rigid body for physics */}
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

      {/* Trail renderer to visualize the player's path */}
      {showTrail && (
        <TrailRenderer
          positionHistory={positionHistoryRef.current}
          color="#00ff88"
          lineWidth={2}
          maxLength={100}
        />
      )}

      {/* Mobile joysticks UI is rendered at the App level */}
    </>
  );
}
