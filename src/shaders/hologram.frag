// hologram.frag — Phase 4.4: holographic surface material.
precision highp float;

uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Fresnel rim — brightest where the surface faces away from the camera.
  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.0);

  // Travelling scanlines.
  float scan = sin(vUv.y * 200.0 + uTime * 5.0) * 0.04;

  // Color blends from A (faces) to B (rim) by fresnel, lifted by scanlines.
  vec3 color = mix(uColorA, uColorB, fresnel) + scan;

  // Alpha: fresnel edge fade + a subtle high-frequency flicker.
  float flicker = 0.9 + 0.1 * sin(uTime * 40.0);
  float alpha = (0.18 + fresnel * 0.82) * flicker + scan;
  alpha = clamp(alpha, 0.0, 1.0);

  // Premultiplied alpha for clean transparent compositing.
  gl_FragColor = vec4(color * alpha, alpha);
}
