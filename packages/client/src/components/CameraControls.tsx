import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import CollisionDebugger from './CollisionDebugger';

// Define obstacle positions and collision radii
interface Obstacle {
  position: Vector3;
  radius: number;
}

// Add controller for camera movement
function CameraControls() {
  const controlsRef = useRef<typeof PointerLockControls | undefined>();
  const { camera, gl } = useThree();
  // State for debug mode - press 'B' to toggle visibility
  const [debugMode, setDebugMode] = useState(false);

  // Reference to store the previous valid position
  const previousPosition = useRef(new Vector3());

  // Collision detection obstacles - adjusted to account for model offset
  // The models appear to be offset in local space, need to offset collisions to match
  const obstacles = useRef<Obstacle[]>([
    // Sculptures ring - radii adjusted based on scale and positions adjusted forward
    { position: new Vector3(-5, 0, -4), radius: 0.9 }, // Moved forward 3 units
    { position: new Vector3(5, 0, -4), radius: 0.9 }, // Moved forward 3 units
    { position: new Vector3(0, 0, -9), radius: 1.2 }, // Moved forward 3 units
    { position: new Vector3(-7, 0, -12), radius: 0.75 }, // Moved forward 3 units
    { position: new Vector3(7, 0, -12), radius: 0.75 }, // Moved forward 3 units
  ]);

  // Movement state
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 2, // Movement speed
  });

  // Check if a position collides with any obstacle
  const checkCollision = (position: Vector3): boolean => {
    for (const obstacle of obstacles.current) {
      // Calculate distance between camera and obstacle (ignoring y-axis)
      const dx = position.x - obstacle.position.x;
      const dz = position.z - obstacle.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // If distance is less than obstacle radius + buffer, collision occurs
      if (distance < obstacle.radius + 0.5) {
        return true;
      }
    }
    return false;
  };

  // Set up key listeners
  useEffect(() => {
    // Store initial position
    previousPosition.current.copy(camera.position);

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
        // Toggle debug visualization with 'B' key
        case 'KeyB':
          setDebugMode((prev) => !prev);
          console.log('Debug mode:', !debugMode);
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
        // @ts-expect-error - PointerLockControls ref type inconsistency
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
  }, [camera, gl, debugMode]);

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

    // Save current position before movement
    previousPosition.current.copy(camera.position);

    // Calculate movement distance
    const movementSpeed = moveState.current.speed * delta;

    // Get camera direction vectors
    const direction = new Vector3();
    camera.getWorldDirection(direction);

    // Project direction onto XZ plane (y=0) to prevent vertical movement
    direction.y = 0;
    direction.normalize();

    // Calculate potential new position
    const newPosition = camera.position.clone();

    // Forward/backward movement along the flattened direction vector
    if (moveState.current.forward) {
      newPosition.addScaledVector(direction, movementSpeed);
    }
    if (moveState.current.backward) {
      newPosition.addScaledVector(direction, -movementSpeed);
    }

    // Left/right movement perpendicular to direction vector
    const rightVector = new Vector3(0, 0, 0);
    rightVector.crossVectors(new Vector3(0, 1, 0), direction).normalize();

    if (moveState.current.right) {
      newPosition.addScaledVector(rightVector, -movementSpeed);
    }
    if (moveState.current.left) {
      newPosition.addScaledVector(rightVector, movementSpeed);
    }

    // Lock the camera height to a fixed Y position
    newPosition.y = 0.5;

    // Only update position if there's no collision
    if (!checkCollision(newPosition)) {
      camera.position.copy(newPosition);
    } else {
      // Optional: implement sliding along obstacles instead of stopping completely
      // For now, just revert to previous position
      camera.position.copy(previousPosition.current);
    }
  });

  return (
    <>
      {/* Debug visualization - toggle with B key */}
      {debugMode && <CollisionDebugger obstacles={obstacles.current} />}

      {/* @ts-expect-error - PointerLockControls ref type inconsistency */}
      <PointerLockControls ref={controlsRef} />
    </>
  );
}

export default CameraControls;
