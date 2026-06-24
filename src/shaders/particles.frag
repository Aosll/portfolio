// particles.frag — Phase 4.2: soft round particle sprites.
precision highp float;

uniform vec3 uColor;

varying vec3 vColor;

void main() {
  // Soft radial gradient alpha measured from the sprite center.
  float dist = distance(gl_PointCoord, vec2(0.5));
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  if (alpha < 0.01) discard;

  // Per-particle color (the blue/cyan/white mix) tinted by the global uColor.
  gl_FragColor = vec4(vColor * uColor, alpha);
}
