// Precision specifier
precision highp float;

// Input variables from the vertex shader
in vec3 vNormal;
in vec3 vPosition;

// Uniform variables for lighting and color
uniform vec3 lightPosition;
uniform vec3 ambientColor; // Ambient color can be a simple value (e.g., vec3(0.1, 0.1, 0.1))
uniform vec3 baseColor;        // Uniform base color for the material

// Output color of the fragment
out vec4 FragColor;

void main() {
    // Lambertian lighting model (simple diffuse lighting)
    vec3 lightDir = normalize(lightPosition - vPosition); // Direction from fragment to light
    float diff = max(dot(vNormal, lightDir), 0.0); // Lambertian reflectance

    // Combine diffuse lighting with ambient color
    vec3 color = (ambientColor + diff) * baseColor; // Simple red color with shading
    FragColor = vec4(color, 1.0); // Output the final fragment color
}