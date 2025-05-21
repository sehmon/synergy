import MazePrototype from "../scenes/MazePrototype";
import SynergyMaze from "../scenes/SynergyMaze";
import DebugScene from "../scenes/DebugScene";

export type SCENE_KEY = 'MAZE' | 'SYNERGY' | 'DEBUG';
export type SCENE_PROPS = {
  component: React.FC;
  initialPosition: [number, number, number];
  initialCameraAngle?: [number, number, number];
}

export const sceneMap: Record<SCENE_KEY, SCENE_PROPS> = {
  MAZE: {
    component: MazePrototype,
    initialPosition: [0, 1, 5],
  },
  SYNERGY: {
    component: SynergyMaze,
    initialPosition: [19.80, 1, -18.6],
    initialCameraAngle: [0, Math.PI/2, 0],
  },
  DEBUG: {
    component: DebugScene,
    initialPosition: [0, 1, 5],
  },
}