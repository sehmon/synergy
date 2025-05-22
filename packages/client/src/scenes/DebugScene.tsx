import { Physics } from '@react-three/rapier';
import Ground from '../components/Ground';
import { Suspense, useCallback, useEffect, useMemo } from 'react';
import ModelLoader from '../components/ModelLoader';
import OptimizedScene from '../components/OptimizedScene';
import CameraPlayer from '../components/CameraPlayer';
import ApiTriggerZone from '../components/ApiTriggerZone';
import { useAtom } from 'jotai';
import { positionAtom } from '../state/position';
import OrbLight from '../components/OrbLight';
import useHeatmap from '../hooks/useHeatmap';

function DebugScene() {
  const [positionHistory] = useAtom(positionAtom);

  // Fetch heatmap data with 10x10 grid, refresh every 5 seconds
  const { heatmapData, error } = useHeatmap(10, 5000);

  // Debug logging
  useEffect(() => {
    if (heatmapData && heatmapData.stats) {
      console.log(
        `Heatmap data loaded: ${heatmapData.stats.totalActivity} total activity points, ` +
          `max value: ${heatmapData.stats.maxValue}, ` +
          `grid size: ${heatmapData.gridSize}x${heatmapData.gridSize}`
      );
    }
    if (error) {
      console.error('Heatmap error:', error);
    }
  }, [heatmapData, error]);

  // Generate OrbLights based on heatmap data
  const heatmapLights = useMemo(() => {
    if (!heatmapData || !heatmapData.grid) return [];

    try {
      const { grid, stats } = heatmapData;
      if (!stats || !stats.maxValue) return [];

      const { maxValue } = stats;
      const lights = [];

      // Ensure we have valid data
      if (maxValue <= 0 || !grid.length || !grid[0].length) return [];

      // Calculate the spacing between orbs
      const spacing = 4;
      const offsetX = -(grid[0].length * spacing) / 2;
      const offsetZ = -(grid.length * spacing) / 2;

      // Create an orb for each cell in the grid
      for (let z = 0; z < grid.length; z++) {
        for (let x = 0; x < grid[z].length; x++) {
          const value = grid[z][x];

          // Skip cells with no activity
          if (value === 0) continue;

          // Calculate normalized intensity (0-1)
          const intensity = Math.min(1.0, Math.max(0.1, value / maxValue));

          // Add orb with intensity-based properties
          lights.push(
            <OrbLight
              key={`heatmap-${x}-${z}`}
              position={[offsetX + x * spacing, 1.5, offsetZ + z * spacing]}
              color="#ff2020" // Brighter red color for heat
              intensity={Math.max(0.3, intensity * 0.7)} // Ensure minimum intensity
              size={0.4} // Larger size for better visibility
              amplitude={0.15}
              speed={0.5}
              phaseOffset={x + z} // Offset based on position for varied animation
            />
          );
        }
      }

      return lights;
    } catch (error) {
      console.error('Error generating heatmap lights:', error);
      return [];
    }
  }, [heatmapData]);

  const handleEnterAPIZone = useCallback(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInfo: { name: 'Sehmon Burnam' },
        positionHistory: positionHistory,
      }),
    };
    fetch('http://localhost:4000/player-trail', requestOptions).then(
      (response) => response.json()
    );
  }, [positionHistory]);

  return (
    <Physics gravity={[0, 0, 0]}>
      {/* Ambient light - reduced intensity for better contrast */}
      <ambientLight intensity={0.5} />

      {/* Key light - main illumination */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light - softer light from opposite side */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.8}
        color="#c0e0ff"
      />

      {/* Rim light - highlights edges */}
      <spotLight
        position={[0, 5, -10]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
        decay={2}
        distance={20}
      />

      {/* Ground fill light */}
      <pointLight
        position={[0, -3, 0]}
        intensity={0.5}
        color="#ffffe0"
        decay={2}
        distance={10}
      />

      {/* Add the ground */}
      <Ground grid />

      <Suspense fallback={null}>
        <ModelLoader>
          <OptimizedScene frustumCulling={true}>
            {/* Render heatmap orb lights - limit to 50 maximum for performance */}
            {heatmapLights.slice(0, 50)}

            {/* API Trigger Zone with visual indicator */}
            <group>
              <ApiTriggerZone
                position={[3, 0, 0]}
                size={[2, 2, 2]} // Width, Height, Depth
                onEnterZone={handleEnterAPIZone}
              />
              {/* Visual indicator for the API trigger zone */}
              <mesh position={[3, 0, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial
                  color="#00ff00"
                  transparent={true}
                  opacity={0.3}
                  emissive="#00ff00"
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Floating text to label the zone */}
              <group position={[3, 2, 0]}>
                <OrbLight
                  position={[0, 0, 0]}
                  color="#00ff00"
                  intensity={1}
                  size={0.3}
                  amplitude={0.2}
                  speed={0.7}
                />
              </group>
            </group>
          </OptimizedScene>
        </ModelLoader>
      </Suspense>
      <CameraPlayer />

      {/* Optional fog for depth */}
      <fog attach="fog" args={['#000', 10, 20]} />
    </Physics>
  );
}

export default DebugScene;
