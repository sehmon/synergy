import { Grid } from '@react-three/drei';

function Ground({ grid = false }: { grid?: boolean }) {
  return (
    <>
      {/* Simple floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Optional grid helper for better spatial awareness */}
      {grid && (
        <Grid
          position={[0, 0.01, 0]}
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#666666"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#888888"
          fadeDistance={30}
          infiniteGrid
        />
      )}
    </>
  );
}

export default Ground;
