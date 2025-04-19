import { atom } from "jotai";
import * as THREE from 'three';

export const positionAtom = atom<THREE.Vector3[]>([]);