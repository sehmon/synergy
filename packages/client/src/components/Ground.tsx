import { Grid } from '@react-three/drei';

function Ground() {
  return (
    <>
      {/* Simple floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#444444" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Optional grid helper for better spatial awareness */}
      <Grid
        position={[0, 0.01, 0]}
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#666666"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#888888"
        fadeDistance={30}
        infiniteGrid
      />
    </>
  );
}

export default Ground;
