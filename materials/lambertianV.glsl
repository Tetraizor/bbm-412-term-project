// Base
varying vec3 vNormal;
varying vec3 vPosition;

// Texturing
varying vec2 vUv;

// Light
varying vec3 fLightDirection;
uniform vec3 lightDirection;

// Effects
varying float vFogDistance;

void main() {
    // Do lighting calculations in view space to avoid having to transform the light direction.
    vNormal = normalize(normalMatrix * normal);

    vec4 viewSpaceLightDir = viewMatrix * vec4(lightDirection, 0.0);
    fLightDirection = normalize(viewSpaceLightDir.xyz);

    // Pass the UV coordinates to the fragment shader.
    vUv = uv;

    // Calculate the fog distance.
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vFogDistance = length(worldPosition.xyz - cameraPosition);

    // Pass the position to the fragment shader.
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}