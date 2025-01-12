varying vec3 vNormal;       // Updated normal
varying vec3 vPosition;     // Updated position for fragment shader
varying vec2 vUv;

varying float vFogDistance;

uniform float time;

// Simple hash function for pseudo-random values
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    // Parameters for wave displacement
    float baseFrequency1 = 100.0;
    float baseFrequency2 = 130.0;
    float baseAmplitude1 = 0.02;
    float baseAmplitude2 = 0.01;

    // Randomize wave properties
    float randomFactor = random(position.xy); // Random value based on vertex position
    float waveFrequency1 = baseFrequency1 + randomFactor * 20.0;
    float waveFrequency2 = baseFrequency2 + randomFactor * 15.0;
    float waveAmplitude1 = baseAmplitude1 + randomFactor * 0.2;
    float waveAmplitude2 = baseAmplitude2 + randomFactor * 0.1;

    // Displace vertex position
    vec3 pos = position + vec3(0.0 + 10.0 * time / 1000.0, 0.0, 0.0);
    pos.z += sin(pos.x * waveFrequency1 ) * waveAmplitude1;
    pos.z += cos(pos.y * waveFrequency2  * 1.5) * waveAmplitude2;

    // Calculate neighboring positions
    vec3 offsetX = position + vec3(0.01, 0.0, 0.0);
    vec3 offsetY = position + vec3(0.0, 0.01, 0.0);

    // Apply the same displacement to the neighbors
    offsetX.z += sin(offsetX.x * waveFrequency1 ) * waveAmplitude1;
    offsetX.z += cos(offsetX.y * waveFrequency2  * 1.5) * waveAmplitude2;

    offsetY.z += sin(offsetY.x * waveFrequency1 ) * waveAmplitude1;
    offsetY.z += cos(offsetY.y * waveFrequency2  * 1.5) * waveAmplitude2;

    // Calculate the fog distance.
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vFogDistance = length(worldPosition.xyz - cameraPosition);

    // Calculate tangents and normal
    vec3 tangentX = offsetX - pos;
    vec3 tangentY = offsetY - pos;
    vec3 normal = normalize(cross(tangentX, tangentY));

    // Pass data to fragment shader
    vPosition = pos;
    vNormal = normal;
    vUv = uv;

    // Transform the displaced position into clip space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
