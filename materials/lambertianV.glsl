// Define precision
precision highp float;

// Output variables
out vec3 vNormal;
out vec3 vPosition;

void main() {
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(mat3(modelViewMatrix) * normal);

    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}