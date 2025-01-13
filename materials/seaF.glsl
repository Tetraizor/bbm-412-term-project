in vec3 v_position;      // Vertex position in world space
in vec2 v_uv;            // UV coordinates from vertex shader
in float v_fogDistance;  // Fog distance from vertex shader
in float v_height;       // Height from vertex shader

uniform sampler2D heightMap;  // Texture used for height map

out vec4 fragColor;

const vec3 fogColor = vec3(0.82, 0.84, 0.94);
const vec3 colorBottom = vec3(0.2, 0.26, 0.3); 
const vec3 colorTop = vec3(1.0); 

void main() {
    float fogFactor = exp(-0.04 * v_fogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    vec3 gradientColor = mix(colorBottom, colorTop, smoothstep(0.0, 1.0, v_height * 2.0));

    vec3 waterColor = mix(gradientColor, colorBottom, v_height);  

    vec3 finalColor = mix(waterColor, fogColor, 1.0 - fogFactor);

    fragColor = vec4(finalColor, 1.0);
}
