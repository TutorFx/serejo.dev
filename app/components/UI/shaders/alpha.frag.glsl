uniform sampler2D tDiffuse;
uniform float uAspect;
uniform float uScale;
uniform float uIsLight;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  float luma = max(max(texel.r, texel.g), texel.b);
  
  vec2 uv = vUv - 0.5;
  uv.x *= uAspect;
  
  float dist = (length(uv) * 1.48) / uScale;
  
  float isCore = 1.0 - smoothstep(0.32, 0.39, dist);
  float haloMask = 1.0 - smoothstep(0.35, 0.50, dist);
  
  float finalAlpha = max(isCore, (luma * 1.5) * haloMask);
  float alphaClamped = min(finalAlpha, 1.0);
  
  if (uIsLight > 0.5) {
    vec3 colorOnWhite = vec3(1.0 - luma) + texel.rgb;
    gl_FragColor = vec4(colorOnWhite * alphaClamped, alphaClamped);
  } else {
    gl_FragColor = vec4(texel.rgb * alphaClamped, alphaClamped);
  }
}
