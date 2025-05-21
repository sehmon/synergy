import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
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
  const meshRef =
    useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);
  const { gl } = useThree();

  // Check if we're on Safari (mobile or desktop)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    // Create the video element if it doesn't exist yet
    if (!videoRef.current) {
      const video = document.createElement('video');
      videoRef.current = video;
    }

    const video = videoRef.current;

    // Safari-specific attributes
    video.setAttribute('crossorigin', 'anonymous');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', ''); // For older iOS
    video.setAttribute('muted', '');
    video.muted = true; // Redundant but necessary for some browsers
    video.autoplay = true;
    video.loop = true;

    // For Safari, we need to handle playback explicitly on user interaction
    const attemptPlay = () => {
      video
        .play()
        .then(() => {
          // Remove event listeners once playback starts
          document.removeEventListener('click', attemptPlay);
          document.removeEventListener('touchstart', attemptPlay);
        })
        .catch((err) => {
          console.error('Error playing video:', err);
          // Keep the listeners if playback failed
        });
    };

    if (isSafari || isMobile) {
      document.addEventListener('click', attemptPlay);
      document.addEventListener('touchstart', attemptPlay);
    }

    // Use MP4 if available for better Safari compatibility
    // Check if MP4 version already exists in the same location
    const isMP4 = url.toLowerCase().endsWith('.mp4');
    const safariCompatibleUrl = isMP4 ? url : url.replace('.mov', '.mp4');

    // For videos without MP4 alternatives, we'll use the original but with special settings

    // Set up event handlers
    const handleError = () => {
      console.error('Video loading error:', video.error);

      // Try fallback format if initial load fails and we're not already using MP4
      if (!isMP4 && url !== safariCompatibleUrl && (isSafari || isMobile)) {
        console.log('Trying fallback video format:', safariCompatibleUrl);
        video.src = safariCompatibleUrl;
        video.load(); // Important for Safari
      } else if (isMP4) {
        // If MP4 already failed, try with different MIME type
        console.log('Setting explicit MIME type for video');
        const source = document.createElement('source');
        source.src = url;
        source.type = 'video/mp4';

        // Clear and reload
        video.innerHTML = '';
        video.appendChild(source);
        video.load();
      }
    };

    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch((err) => {
        console.warn('Auto-play prevented:', err);
        // We'll rely on user interaction to play
      });
    };

    video.addEventListener('error', handleError);
    video.addEventListener('canplaythrough', handleCanPlay);

    // Now set the source - prefer MP4 for Safari
    video.src = isSafari ? safariCompatibleUrl : url;

    // Load the video
    video.load();

    // Create texture once
    const newTexture = new THREE.VideoTexture(video);
    newTexture.minFilter = THREE.LinearFilter;
    newTexture.magFilter = THREE.LinearFilter;

    // Use appropriate format for the browser
    // Note: THREE.RGBFormat is deprecated in newer Three.js versions
    newTexture.format = isSafari ? THREE.RGBFormat : THREE.RGBAFormat;

    // For newer Three.js versions, you might need to use this instead:
    // newTexture.format = isSafari ? THREE.RGBAFormat : THREE.RGBAFormat;

    // Set color space for better compatibility
    newTexture.colorSpace = THREE.SRGBColorSpace;

    setTexture(newTexture);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplaythrough', handleCanPlay);
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);

      video.pause();
      video.src = '';
      video.load(); // Important for Safari

      if (newTexture) {
        newTexture.dispose();
      }
    };
  }, [url, isSafari, isMobile]);

  // Apply texture to mesh when both are available
  useEffect(() => {
    if (meshRef.current && texture && videoLoaded) {
      meshRef.current.material.map = texture;
      meshRef.current.material.needsUpdate = true;

      // Force renderer to handle transparency correctly
      gl.localClippingEnabled = true;
    }
  }, [videoLoaded, texture, gl]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[16, 9]} /> {/* Aspect ratio 16:9 */}
      <meshBasicMaterial
        toneMapped={false}
        transparent={true}
        side={THREE.DoubleSide} // Visible from both sides
      />
    </mesh>
  );
};

export default VideoTexture;
