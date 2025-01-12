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
    vec3 colorTop = vec3(1.0);
    vec3 colorBottom = vec3(0.75, 0.77, 0.78);
    vec3 gradientColor = mix(colorBottom, colorTop, vPosition.z * 2.0);

    // Combine lighting with color
    vec3 waterColor = gradientColor;
    vec3 fogColor = vec3(0.78, 0.91, 0.96);
    waterColor = mix(waterColor, fogColor, 1.0 - fogFactor);

    gl_FragColor = vec4(waterColor, 1.0);
}
