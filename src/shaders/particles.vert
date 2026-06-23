// particles.vert — Phase 1 placeholder (expanded in Phase 4: WebGL scene engine)
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;

attribute float aScale;

varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Gentle ambient drift; replaced by real field motion in Phase 4.
  modelPosition.y += sin(uTime + modelPosition.x * 0.5) * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = uSize * aScale * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vColor = color;
}
