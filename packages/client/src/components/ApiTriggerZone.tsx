import { useState } from 'react';
import { RigidBody, CuboidCollider, CuboidArgs } from '@react-three/rapier';
import { Box } from '@react-three/drei'; // For visualization

type ApiTriggerZoneProps = {
  position: [x: number, y: number, z: number];
  size: [x: number, y: number, z: number];
  onEnterZone: VoidFunction;
};

function ApiTriggerZone({ position, size, onEnterZone }: ApiTriggerZoneProps) {
  const [hasEntered, setHasEntered] = useState(false);

  const handleIntersectionEnter = () => {
    // Optional: Check if the intersecting object is the player/camera
    // if (event.other.rigidBodyObject?.name === 'player') {
    if (!hasEntered) {
      console.log('Player entered the zone!');
      onEnterZone(); // Call your API function
      setHasEntered(true); // Prevent multiple calls while inside
    }
    // }
  };

  const handleIntersectionExit = () => {
    // Optional: Check if the exiting object is the player/camera
    // if (event.other.rigidBodyObject?.name === 'player') {
    console.log('Player exited the zone.');
    setHasEntered(false); // Allow re-entry to trigger again
    // }
  };

  return (
    <RigidBody
      type="fixed" // Zone doesn't move
      position={position}
      colliders={false} // We'll define collider manually
      sensor // Mark this body's colliders as sensors
      onIntersectionEnter={handleIntersectionEnter}
      onIntersectionExit={handleIntersectionExit} // Optional: handle exit
    >
      <CuboidCollider args={size.map((s) => s / 2) as CuboidArgs} />
      {/* Optional: Visual representation (make transparent/wireframe) */}
      <Box args={size} visible={true}>
        <meshStandardMaterial wireframe color="red" transparent opacity={1} />
      </Box>
    </RigidBody>
  );
}

export default ApiTriggerZone;
