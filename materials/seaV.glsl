out vec2 v_uv;
out vec3 v_position;
out float v_height;
out float v_fogDistance;

uniform float time;
uniform sampler2D heightMap;

const float repeatFactor = 5.0;
const float waveSpeed = -0.04;

void main() {
    v_fogDistance = -(modelViewMatrix * vec4(position, 1.0)).z;
    v_uv = fract(uv * repeatFactor + vec2(0, waveSpeed) * time); 
    v_height = texture2D(heightMap, v_uv).r;

    vec3 pos = vec3(position.x, position.y, position.z + v_height * 1.4);

    v_position = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
