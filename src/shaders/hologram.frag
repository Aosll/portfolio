// hologram.frag — Phase 1 placeholder (expanded in Phase 7: project showcases)
precision highp float;

uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Animated scanlines + fresnel-ish edge glow placeholder.
  float scan = sin((vUv.y + uTime * 0.1) * 80.0) * 0.5 + 0.5;
  float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));

  float alpha = clamp(scan * 0.25 + edge * 0.75, 0.0, 1.0);
  gl_FragColor = vec4(uColor, alpha);
}
