

// ---------------- FOLIAGE (PARTICLES) ---------------- //

export const foliageVertexShader = `
  uniform float uTime;
  uniform float uMix; // 0.0 (Scattered) -> 1.0 (Tree)
  uniform float uPixelRatio;

  attribute vec3 aScatterPos;
  attribute vec3 aTreePos;
  attribute vec3 aColor;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;

  // Pseudo-random function
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Noise for floating effect
  vec3 noiseVec3(vec3 p) {
    return vec3(
      sin(p.y * 2.0 + uTime) * 0.1,
      cos(p.x * 2.0 + uTime * 0.8) * 0.1,
      sin(p.z * 2.0 + uTime * 0.5) * 0.1
    );
  }

  void main() {
    vColor = aColor;

    // Ease function for smoother transition
    float t = smoothstep(0.0, 1.0, uMix);

    // Interpolate position
    vec3 pos = mix(aScatterPos, aTreePos, t);

    // Add floating noise
    float floatIntensity = mix(1.0, 0.2, t);
    pos += noiseVec3(pos + vec3(aSize)) * floatIntensity;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * uPixelRatio * (60.0 / -mvPosition.z);
    
    vAlpha = 1.0; 
  }
`;

export const foliageFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Circular particle
    vec2 uv = gl_PointCoord.xy - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;

    // Soft glow edge
    float glow = 1.0 - smoothstep(0.3, 0.5, r);
    
    gl_FragColor = vec4(vColor * 1.5, vAlpha * glow); // *1.5 for HDR glow
  }
`;

// ---------------- ORNAMENTS (INSTANCED MESH) ---------------- //

export const ornamentVertexShader = `
  uniform float uTime;
  uniform float uMix; 
  uniform float uScale; // Explicit scale control
  
  attribute vec3 aScatterPos;
  attribute vec3 aTreePos;
  attribute vec4 aOrientation; // Random offsets for rotation
  attribute vec3 aColor;       // Per-instance color
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vColor;
  varying vec3 vLocalPos; // Passed to fragment for noise generation
  varying float vRandomOffset;

  // Rotation matrix helper
  mat4 rotationMatrix(vec3 axis, float angle) {
      axis = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
      float oc = 1.0 - c;
      
      return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                  oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                  oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                  0.0,                                0.0,                                0.0,                                1.0);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vColor = aColor;
    vRandomOffset = aOrientation.w; // Use w component as random seed
    
    float t = smoothstep(0.0, 1.0, uMix);
    
    // 1. Position Interpolation
    vec3 finalPos = mix(aScatterPos, aTreePos, t);

    // 2. Add Floating movement
    finalPos.y += sin(uTime * 0.5 + aOrientation.x * 10.0) * 0.15;
    finalPos.x += cos(uTime * 0.3 + aOrientation.y * 10.0) * 0.05;

    // 3. Rotation Logic
    float spinSpeed = mix(1.0, 0.0, t); 
    float angle = uTime * spinSpeed + aOrientation.z * 10.0;
    mat4 rot = rotationMatrix(vec3(aOrientation.x, aOrientation.y, 1.0), angle);

    // 4. Apply Scale and Rotation
    // IMPORTANT: Scale first, then rotate
    vec3 localScaled = position * uScale;
    vec3 transformed = (rot * vec4(localScaled, 1.0)).xyz;
    
    vLocalPos = transformed; 

    // Move to world position
    transformed += finalPos;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(transformed, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Refined PBR-like shader with noise for texture and High Intensity Blinking
export const ornamentFragmentShader = `
  uniform float uTime; // Added uTime to fragment for animation

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vColor;
  varying vec3 vLocalPos;
  varying float vRandomOffset;

  // Simple pseudo-random 3D noise
  float hash(vec3 p) {
    p  = fract( p*0.3183099 + .1 );
    p *= 17.0;
    return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Add subtle noise to normal for "textured" look on gold
    float noiseVal = hash(vLocalPos * 10.0); // High frequency noise
    
    // Detect Gold/Yellow elements based on color
    // Gold usually has high Red/Green and lower Blue
    bool isGold = (vColor.r > 0.8 && vColor.g > 0.6);
    
    if (isGold) {
        normal = normalize(normal + (noiseVal - 0.5) * 0.1); 
    }

    // Lighting
    vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Specular (Phong) - Sharper for metallic
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0); 
    
    // Rim light (Fresnel)
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

    // Base color
    vec3 finalColor = vColor * (0.2 + diff * 0.8); 
    
    // Warm, golden specular highlight
    finalColor += vec3(1.0, 0.9, 0.7) * spec * 2.5; 
    
    // Rim
    finalColor += vColor * fresnel * 1.5;

    // --- BLINKING LOGIC ---
    if (isGold) {
        // Create a sharp flash effect using pow(sin(), high_number)
        // Each particle has a unique offset (vRandomOffset) so they don't blink together
        float blinkSpeed = 2.0;
        // The pow(..., 30.0) creates a very sharp "on" time and long "off" time
        float blink = pow(sin(uTime * blinkSpeed + vRandomOffset * 20.0), 30.0);
        
        // Add intense additive white/gold glow when blinking
        finalColor += vec3(1.0, 0.9, 0.5) * blink * 20.0; 
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// ---------------- SNOW (PARTICLES) ---------------- //

export const snowVertexShader = `
  uniform float uTime;
  uniform float uHeight;
  
  attribute vec3 aPos;
  attribute float aSpeed;
  attribute float aGlow;
  
  varying float vGlow;
  varying float vAlpha;

  void main() {
    vGlow = aGlow;
    
    // Simple fall logic
    vec3 pos = aPos;
    pos.y = mod(pos.y - uTime * aSpeed, uHeight) - uHeight / 2.0;
    
    // Slight sway
    pos.x += sin(uTime + pos.y) * 0.1;
    pos.z += cos(uTime + pos.y) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size logic
    gl_PointSize = (4.0 + aGlow * 4.0) * (50.0 / -mvPosition.z);
  }
`;

export const snowFragmentShader = `
  uniform float uOpacity;
  varying float vGlow;

  void main() {
    // Circular
    vec2 uv = gl_PointCoord.xy - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    
    // Soften edge
    float alpha = (1.0 - smoothstep(0.3, 0.5, r)) * uOpacity;
    
    // Color: White usually, but if vGlow > 0, we add some warmth/brightness
    vec3 color = vec3(1.0);
    
    if (vGlow > 0.5) {
       color = vec3(1.0, 1.0, 0.8) * 2.0; // HDR Glow
    }

    gl_FragColor = vec4(color, alpha);
  }
`;