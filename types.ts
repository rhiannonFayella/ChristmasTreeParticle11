import React from 'react';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface DualPosition {
  scatter: Float32Array;
  tree: Float32Array;
  colors?: Float32Array;
  scales?: Float32Array;
  orientations?: Float32Array;
}

export interface OrnamentProps {
  mode: number; // 0 for Scattered, 1 for Tree
  count: number;
}

// Augment the global JSX namespace to include React Three Fiber elements.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      shaderMaterial: any;
      instancedMesh: any;
      boxGeometry: any;
      sphereGeometry: any;
      octahedronGeometry: any;
      extrudeGeometry: any; // Added for Star
      torusKnotGeometry: any; // Added for Ribbons
      instancedBufferAttribute: any;
      meshBasicMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      color: any;
    }
  }
}