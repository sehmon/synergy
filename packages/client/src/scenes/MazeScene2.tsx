import * as THREE from 'three';
import { Physics, RigidBody } from '@react-three/rapier';
import Ground from '../components/Ground';
import { Suspense } from 'react';
import ModelLoader from '../components/ModelLoader';
import OptimizedScene from '../components/OptimizedScene';
import CameraPlayer from '../components/CameraPlayer';
import Model from '../components/Model';
import VideoTexture from '../components/VideoTexture';

function MazeScene2() {
  return (
    <Physics gravity={[0, 0, 0]}>
      {/* Ambient light - reduced intensity for better contrast */}
      <ambientLight intensity={0.5} />

      {/* Key light - main illumination */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
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
        castShadow
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
          <OptimizedScene frustumCulling={false}>
            <group scale={4} position={new THREE.Vector3(0, 0, -20)}>
              <RigidBody type="fixed" colliders="trimesh">
                <Model path="/full-maze.glb" />
              </RigidBody>
              <VideoTexture
                url="/flower_video.mov"
                position={[-1.25, 0.01, 5]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.4, 0.4, 0.4]}
              />
              <VideoTexture
                url="/fire.mov"
                position={[-6.5, 1.8, -1]}
                rotation={[0, Math.PI / 2, Math.PI / 2]}
                scale={[0.2, 0.2, 0.2]}
              />
            </group>
          </OptimizedScene>
        </ModelLoader>
      </Suspense>
      <CameraPlayer />

      {/* Optional fog for depth */}
      <fog attach="fog" args={['#000', 10, 100]} />
    </Physics>
  );
}

export default MazeScene2;
