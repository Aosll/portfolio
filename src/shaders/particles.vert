// particles.vert — Phase 4.2: global ambient particle field.
uniform float uTime;
uniform float uScroll;
uniform float uPixelRatio;

attribute vec3 aColor;

varying vec3 vColor;

void main() {
  vColor = aColor;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Scroll-driven drift: the whole field slides as the page scrolls.
  modelPosition.y += uScroll * 8.0;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Base size + per-particle twinkle, attenuated by distance (perspective).
  float base = 55.0;
  float twinkle = sin(uTime + position.x) * 18.0;
  gl_PointSize = (base + twinkle) * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
