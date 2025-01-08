varying vec3 vNormal;
varying vec3 vPosition;

varying vec3 fLightDirection;

uniform vec3 lightDirection;

void main() {
    vNormal = normalize(normalMatrix * normal);

    vec4 viewSpaceLightDir = viewMatrix * vec4(lightDirection, 0.0);
    fLightDirection = normalize(viewSpaceLightDir.xyz);

    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
