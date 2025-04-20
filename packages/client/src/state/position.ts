import { atom } from "jotai";
import * as THREE from 'three';

export const initialPositionAtom = atom<[number, number, number]>([0, 1, 0]);
export const positionAtom = atom<THREE.Vector3[]>([]);