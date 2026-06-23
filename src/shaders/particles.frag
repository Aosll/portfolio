// particles.frag — Phase 1 placeholder (expanded in Phase 4: WebGL scene engine)
precision highp float;

varying vec3 vColor;

void main() {
  // Soft circular point sprite.
  float dist = distance(gl_PointCoord, vec2(0.5));
  float strength = 1.0 - smoothstep(0.0, 0.5, dist);

  if (strength < 0.01) discard;

  gl_FragColor = vec4(vColor, strength);
}
