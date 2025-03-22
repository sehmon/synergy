import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';

// Add controller for camera movement
function CameraControls() {
  const controlsRef = useRef<typeof PointerLockControls | undefined>();
  const { camera, gl } = useThree();

  // Movement state
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 2, // Movement speed
  });

  // Set up key listeners
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = false;
          break;
      }
    };

    // Add event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Lock pointer on click
    const handleClick = () => {
      if (controlsRef.current) {
        // @ts-ignore
        controlsRef.current.lock();
      }
    };

    gl.domElement.addEventListener('click', handleClick);

    // Clean up
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [gl]);

  // Update camera position based on keyboard input
  useFrame((_, delta) => {
    // Only move if keys are pressed
    if (
      !moveState.current.forward &&
      !moveState.current.backward &&
      !moveState.current.left &&
      !moveState.current.right
    ) {
      return;
    }

    // Calculate movement distance
    const movementSpeed = moveState.current.speed * delta;

    // Get camera direction vectors
    const direction = new Vector3();
    camera.getWorldDirection(direction);

    // Forward/backward movement along the direction vector
    if (moveState.current.forward) {
      camera.position.addScaledVector(direction, movementSpeed);
    }
    if (moveState.current.backward) {
      camera.position.addScaledVector(direction, -movementSpeed);
    }

    // Left/right movement perpendicular to direction vector
    const rightVector = new Vector3();
    rightVector.crossVectors(camera.up, direction).normalize();

    if (moveState.current.right) {
      camera.position.addScaledVector(rightVector, -movementSpeed);
    }
    if (moveState.current.left) {
      camera.position.addScaledVector(rightVector, movementSpeed);
    }
  });
  // @ts-ignore
  return <PointerLockControls ref={controlsRef} />;
}

export default CameraControls;
