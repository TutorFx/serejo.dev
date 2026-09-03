uniform float uTime;
uniform vec3 uLightColors[5];

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

vec3 proceduralWander(float t, float seed) {
  float x = smoothstep(-1.0, 1.0, sin(t * 0.25 + seed)) * 3.0 - 1.5 + sin(t * 0.6 + seed * 2.0) * 0.5;
  float y = smoothstep(-1.0, 1.0, cos(t * 0.2 - seed)) * 3.0 - 1.5 + sin(t * 0.4 + seed * 1.5) * 0.5;
  float z = -0.8 + smoothstep(-1.0, 1.0, sin(t * 0.3 + seed * 0.8)) - 0.5 + cos(t * 0.15 - seed * 2.5) * 0.3;
  return normalize(vec3(x, y, z));
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  vec3 reflectVec = reflect(-viewDir, normal);
  
  vec3 c = vec3(0.0);
  float l;
  float z = uTime * 0.8; 
  
  for(int i = 0; i < 3; i++) {
    vec2 p = normal.xy * 0.7;
    vec2 uv = p;
    
    z += 0.07;
    l = length(p);
    
    float amplitude = sin(z) + 1.0;
    uv += p/(l + 0.001) * amplitude * abs(sin(l * 9.0 - z - z));
    
    float fadeInOut = smoothstep(-1.0, 1.0, sin(uTime * 0.5 + float(i) * 1.5)); 
    float intensity = 0.5 + (0.5 * fadeInOut); 
    
    c[i] = (0.01 / (length(mod(uv, 1.0) - 0.5) + 0.005)) * intensity;
  }
  
  float edgeFade = smoothstep(1.0, 0.3, length(normal.xy));
  vec3 coreColor = (c / (l + 0.1)) * edgeFade * 0.9;

  float fresnelTerm = dot(viewDir, normal);
  fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
  float fresnelPow = pow(fresnelTerm, 4.0); 

  vec3 specColor = vec3(0.0);
  vec3 rimColor = vec3(0.0);
  vec3 backColor = vec3(0.0);

  float timeMults[5] = float[5](0.5, 0.35, 0.6, 0.4, 0.55);
  float seeds[5] = float[5](0.0, 42.15, 98.42, 15.33, 77.77);
  float fadeTimeMults[5] = float[5](0.6, 0.45, 0.75, 0.55, 0.65);
  float fadeOffsets[5] = float[5](0.0, 2.0, 4.0, 1.5, 3.0);

  for (int i = 0; i < 5; i++) {
    vec3 lPos = proceduralWander(uTime * timeMults[i], seeds[i]);
    float fade = smoothstep(-1.0, 1.0, sin(uTime * fadeTimeMults[i] + fadeOffsets[i])); 
    
    float zDist = pow(1.0 - abs(lPos.z), 2.5);
    vec3 lCol = uLightColors[i] * (0.8 + 1.2 * fade) * zDist; 
    
    float spec = pow(max(dot(reflectVec, lPos), 0.0), 16.0);
    specColor += lCol * spec;

    float rim = pow(max(dot(normal, lPos), 0.0), 3.0) * fresnelPow;
    rimColor += lCol * rim;

    vec3 glowDir = normalize(vec3(lPos.xy, -lPos.z * 0.4));
    float back = pow(max(dot(normal, glowDir), 0.0), 3.0);
    backColor += lCol * back;
  }
  
  specColor *= 2.0;
  backColor *= 1.0;

  vec3 finalColor = coreColor + specColor + rimColor + backColor;

  gl_FragColor = vec4(finalColor, 1.0);
}
