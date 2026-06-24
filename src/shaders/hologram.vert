// hologram.vert — Phase 4.4: holographic surface material.
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  // Slight rippling displacement along the surface normal.
  float disp = sin(position.y * 10.0 + uTime) * 0.002;
  vec3 displaced = position + normal * disp;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz; // direction toward the camera (view space)

  gl_Position = projectionMatrix * mvPosition;
}
