import * as THREE from 'three';
import { Physics, RigidBody } from '@react-three/rapier';
import Ground from '../components/Ground';
import { Suspense, useRef, useMemo } from 'react';
import ModelLoader from '../components/ModelLoader';
import OptimizedScene from '../components/OptimizedScene';
import CameraPlayer from '../components/CameraPlayer';
import Model from '../components/Model';
import VideoTexture from '../components/VideoTexture';
// import OrbLight from '../components/OrbLight';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from '@react-three/postprocessing';
import { getModelUrl } from '../config/assetPaths';
// import { useHelper } from '@react-three/drei';

// const fogColor = '#a33600';
const fogColor = '#e82027';

function SynergyMaze() {
  const light = useRef(null);
  // useHelper(light, THREE.SpotLightHelper, 'cyan');
  // useHelper(light, THREE.SpotLightHelper, 'cyan');
  const target = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-5, 9, 0);
    return obj;
  }, []);
  return (
    <>
      <EffectComposer>
        {/* <Bloom
          intensity={100}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.1}
          mipmapBlur
        /> */}
        <DepthOfField focusDistance={0} focalLength={0.05} bokehScale={2} />
        <Bloom luminanceThreshold={20} luminanceSmoothing={10} intensity={20} />
        {/* <Noise opacity={0.02} /> */}
      </EffectComposer>

      <Physics gravity={[0, 0, 0]}>
        {/* Ambient light - reduced intensity for better contrast */}
        {/* <ambientLight intensity={3} /> */}
        <fog attach="fog" args={[fogColor, 1, 30]} />
        <color attach="background" args={[fogColor]} />

        {/* Key light - main illumination */}
        {/* <directionalLight
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
      /> */}

        {/* Fill light - softer light from opposite side */}
        {/* <directionalLight
        position={[-5, 3, -5]}
        intensity={0.8}
        color="#c0e0ff"
      /> */}

        {/* Rim light - highlights edges */}
        <spotLight
          ref={light}
          position={[-5, 10, 0]}
          angle={0.6}
          penumbra={1}
          intensity={100}
          color="#ffffff"
          decay={0.1}
          distance={20}
          castShadow
          target={target}
        />
        <primitive object={target} />

        {/* Ground fill light */}
        {/* <pointLight
        position={[0, -3, 0]}
        intensity={0.5}
        color="#ffffe0"
        decay={2}
        distance={10}
      /> */}

        {/* Add the ground */}
        <Ground />

        <Suspense fallback={null}>
          <ModelLoader>
            <OptimizedScene frustumCulling={false}>
              <group scale={4} position={new THREE.Vector3(0, 0, -20)}>
                <RigidBody type="fixed" colliders="trimesh">
                  <Model path={getModelUrl('full-maze-compressed.glb')} />
                  <Model
                    path={getModelUrl('object-w-compressed.glb')}
                    position={new THREE.Vector3(1, 0.1, 0)}
                    scale={0.25}
                    enableShadows={false}
                  />
                  <Model
                    path={getModelUrl('object-e-compressed.glb')}
                    position={new THREE.Vector3(8, 0, 10)}
                    scale={0.45}
                    enableShadows={false}
                  />
                </RigidBody>
                <VideoTexture
                  url="https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/flower_video_looped.mp4"
                  position={[-1.25, 0.01, 5]}
                  rotation={[Math.PI / 2, 0, 0]}
                  scale={[0.4, 0.4, 0.4]}
                />
                <VideoTexture
                  url="https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/fire_looped.mp4"
                  position={[-6.5, 1.8, -1]}
                  rotation={[0, Math.PI / 2, Math.PI / 2]}
                  scale={[0.2, 0.2, 0.2]}
                />
                <VideoTexture
                  url="https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/water_looped.mp4"
                  position={[2.5, 2, 0.5]}
                  rotation={[0, Math.PI / 2, Math.PI / 2]}
                  scale={[0.2, 0.2, 0.2]}
                />
                <VideoTexture
                  url="https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/water_looped.mp4"
                  position={[2.5, 2, 3.5]}
                  rotation={[0, -Math.PI / 4, Math.PI / 2]}
                  scale={[0.2, 0.2, 0.2]}
                />
                <VideoTexture
                  url="https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/water_looped.mp4"
                  position={[2.5, 2, -2.5]}
                  rotation={[0, Math.PI / 4, Math.PI / 2]}
                  scale={[0.2, 0.2, 0.2]}
                />
              </group>
              {/* {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
                return (
                  <OrbLight
                    position={[-12.7 + n * 4, 0, -8.9]}
                    color="#00fcff"
                    intensity={0.1}
                    size={0.1}
                    amplitude={1}
                    speed={0.8}
                    phaseOffset={2}
                  />
                );
              })} */}
            </OptimizedScene>
          </ModelLoader>
        </Suspense>
        <CameraPlayer />
      </Physics>
    </>
  );
}

export default SynergyMaze;
