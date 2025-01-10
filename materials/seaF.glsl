varying vec3 vNormal;       // Updated normal
varying vec3 vPosition;     // Updated position
varying vec2 vUv;

varying float vFogDistance;

uniform vec3 lightDirection;

void main() {
    // Fog calculations.
    float fogFactor = exp(-.02 * vFogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    // Gradient for water color
    vec3 colorTop = vec3(0.21, 0.74, 0.66);
    vec3 colorBottom = vec3(0.14, 0.47, 0.58);
    vec3 gradientColor = mix(colorBottom, colorTop, vPosition.z * 2.0);

    // Combine lighting with color
    vec3 waterColor = gradientColor;
    waterColor = mix(waterColor, vec3(0.15, 0.51, 0.52), 1.0 - fogFactor);

    gl_FragColor = vec4(waterColor, 1.0);
}
