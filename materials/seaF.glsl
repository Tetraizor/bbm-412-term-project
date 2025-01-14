in vec3 v_position;      // Vertex position in world space
in vec2 v_uv;            // UV coordinates from vertex shader
in float v_fogDistance;  // Fog distance from vertex shader
in float v_height;       // Height from vertex shader

uniform sampler2D heightMap;  // Texture used for height map

out vec4 fragColor;

const vec3 fogColor = vec3(0.82, 0.84, 0.94);
const vec3 colorBottom = vec3(0.19, 0.39, 0.53); 
const vec3 colorTop = vec3(1.0); 

const float pixelSize = 2.25;

const float pattern1[9] = float[9](1.0, 1.0, 1.0,
                                  1.0, 0.0, 1.0,
                                  1.0, 1.0, 1.0);

const float pattern2[9] = float[9](0.0, 1.0, 0.0,
                                    1.0, 0.0, 1.0,
                                    0.0, 1.0, 0.0);

float dither(vec2 coord, float ditherStrength, int pattern, float minOpacity) {
    int xIndex = int(mod(coord.x, 3.0));
    int yIndex = int(mod(coord.y, 3.0));

    if(pattern == 1) {
        return (1.0 - ditherStrength) * max(pattern1[
            3 * yIndex + xIndex
        ], minOpacity);
    } else {
        return (1.0 - ditherStrength) * max(pattern2[
            3 * yIndex + xIndex
        ], minOpacity);
    };
}

void main() {
    float fogFactor = exp(-0.05 * v_fogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    vec3 gradientColor = mix(colorBottom, colorTop, smoothstep(0.0, 1.0, v_height * 1.0));
    vec3 toonColor = colorBottom;

    if(v_height > 0.4) {
        toonColor = mix(colorBottom, colorTop, .4) ;
    } else if(v_height > 0.2) {
        toonColor = mix(colorBottom, colorTop, .5);
    }else {
        toonColor = mix(colorBottom, colorTop, .9);
    }

    vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
    float ditherStrength = dither(pixelCoord, 0.3, 2, 0.8);
    toonColor = mix(toonColor, gradientColor * 1.5 * ditherStrength,  v_height);

    vec3 finalColor = mix(toonColor, fogColor, 1.0 - fogFactor);

    fragColor = vec4(finalColor, 1.0);
}
