import { useGLTF } from '@react-three/drei';

import { getModelUrl } from './assetPaths';

const modelFiles: string[] = [
  'full-maze-compressed.glb',
  'object-w-compressed.glb',
  'object-e-compressed.glb',
  'object-n-compressed.glb',
  'table-compressed.glb',
  'sculpture-compressed.glb',
];

const videoUrls: string[] = [
  'https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/flower_video_looped.mp4',
  'https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/fire_looped.mp4',
  'https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/water_looped.mp4',
  'https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/flower_video.mov',
  'https://synergy-assets-11412.s3.us-west-2.amazonaws.com/videos/fire.mov',
];

export function preloadAssets(): void {
  modelFiles.forEach((file) => {
    try {
      useGLTF.preload(getModelUrl(file));
    } catch (err) {
      console.error('Error preloading model:', err);
    }
  });

  videoUrls.forEach((url) => {
    fetch(url)
      .catch((err) => {
        console.error('Error preloading video:', err);
      });
  });
}
