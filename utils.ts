import * as THREE from 'three';

// Helpers to generate positions
const v3 = new THREE.Vector3();

// Generate positions for a Cone shape (Tree)
export const generateTreePositions = (count: number, radius: number, height: number): Float32Array => {
  const array = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Normalized height (0 bottom, 1 top)
    const yNorm = Math.pow(Math.random(), 1.2); 
    const y = yNorm * height - height / 2;

    // Radius at this height (tapering to top)
    const rBase = (1 - yNorm) * radius;

    // Random angle
    const theta = Math.random() * Math.PI * 2;
    
    // Volume/Thickness logic for "larger gaps"
    // Previously 0.5 spread, now increased to encourage more outer layer placement and voids
    const spread = 0.6 + (Math.random() * 0.6); // Range 0.6 to 1.2 of radius
    const r = rBase * spread;

    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);

    array[i * 3] = x;
    array[i * 3 + 1] = y;
    array[i * 3 + 2] = z;
  }
  return array;
};

// Generate positions for a Sphere cloud (Scattered)
export const generateScatterPositions = (count: number, radius: number): Float32Array => {
  const array = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.cbrt(Math.random()) * radius; 

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    array[i * 3] = x;
    array[i * 3 + 1] = y;
    array[i * 3 + 2] = z;
  }
  return array;
};

// Generate random colors restricted to the specific palette
export const generateLuxuryColors = (count: number): Float32Array => {
  const array = new Float32Array(count * 3);
  
  // Revised Palette
  const emerald = new THREE.Color('#003319'); // Darker, richer emerald
  const deepRed = new THREE.Color('#720e1e'); // Wine/Velvet red
  const texturedGold = new THREE.Color('#C5A059'); // More bronze gold
  const brightGold = new THREE.Color('#FFD700'); // Classic Gold

  const wEmerald = 0.45; 
  const wRed = 0.20;     
  const wTexGold = 0.25; 

  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let color;

    if (rand < wEmerald) {
      color = emerald;
    } else if (rand < wEmerald + wRed) {
      color = deepRed;
    } else if (rand < wEmerald + wRed + wTexGold) {
      color = texturedGold;
    } else {
      color = brightGold;
    }

    array[i * 3] = color.r;
    array[i * 3 + 1] = color.g;
    array[i * 3 + 2] = color.b;
  }
  return array;
};

// Special generator for Ribbons (Only Gold or Red)
export const generateRibbonColors = (count: number): Float32Array => {
  const array = new Float32Array(count * 3);
  const deepRed = new THREE.Color('#720e1e'); 
  const brightGold = new THREE.Color('#FFD700'); 

  for (let i = 0; i < count; i++) {
    const color = Math.random() > 0.5 ? deepRed : brightGold;
    array[i * 3] = color.r;
    array[i * 3 + 1] = color.g;
    array[i * 3 + 2] = color.b;
  }
  return array;
};

// Generate random rotation axis/angle
export const generateRandomOrientations = (count: number): Float32Array => {
  const array = new Float32Array(count * 4); 
  for (let i = 0; i < count * 4; i++) {
      array[i] = Math.random(); 
  }
  return array;
}