import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

type VideoTextureProps = {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

const VideoTexture = ({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: VideoTextureProps) => {
  const meshRef = useRef(null);
  const videoRef = useRef(document.createElement('video'));
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    
    // Set up event handlers before setting src
    video.crossOrigin = 'Anonymous';
    video.loop = true;
    video.muted = true; // Autoplay requires muted video
    video.playsInline = true;
    
    // Add error handling
    video.onerror = (e) => {
      console.error('Video loading error:', video.error);
    };
    
    video.onloadeddata = () => {
      console.log('Video loaded successfully:', url);
      setVideoLoaded(true);
      video.play().catch(err => {
        console.error('Error playing video:', err);
      });
    };
    
    // Now set the src
    console.log('Loading video from URL:', url);
    video.src = url;
    
    // Create texture regardless of video load status
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    return () => {
      video.pause();
      video.src = '';
      texture.dispose();
    };
  }, [url]);
  
  // Apply texture to mesh when both are available
  useEffect(() => {
    if (meshRef.current && videoLoaded) {
      console.log('Applying video texture to mesh');
      const texture = new THREE.VideoTexture(videoRef.current);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      
      meshRef.current.material.map = texture;
      meshRef.current.material.needsUpdate = true;
    }
  }, [videoLoaded]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[16, 9]} /> {/* Aspect ratio 16:9 */}
      <meshBasicMaterial toneMapped={false} />
    </mesh>
  );
};

export default VideoTexture;
