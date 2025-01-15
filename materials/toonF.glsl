uniform vec3 lightColor;
uniform float lightIntensity;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform vec3 baseColor;
uniform vec3 overlayColor;
uniform sampler2D baseTexture;

uniform vec2 textureOffset;

uniform float opacity;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vFogDistance;

varying vec3 fLightDirection;

const float pixelSize = 2.0;

out vec4 fragColor;

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
    float diffuse = max(dot(vNormal, normalize(fLightDirection)), 0.0) ;

    vec3 toonFactor;
    vec2 pixelCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;

    if (diffuse > .6) {
        toonFactor = lightColor * lightIntensity * 1.0 * dither(pixelCoord, 0.0, 1, .9) ;
    } else if (diffuse > .2) {
        toonFactor = lightColor * lightIntensity * 0.5 * dither(pixelCoord, .2, 1, 0.0);
    } else if (diffuse > .001) {
        toonFactor = lightColor * lightIntensity * 0.2 * dither(pixelCoord, .1, 2, 0.0);
    }else {
        toonFactor = lightColor * lightIntensity * 0.1 * dither(pixelCoord, .0, 1, 0.0);
    }

    vec3 shadedColor = toonFactor + ambientColor * ambientIntensity;
    
    vec2 offsetUv = vUv + textureOffset;
    vec4 textureColor = texture2D(baseTexture, offsetUv);
        
    vec4 finalColor = vec4(shadedColor, 1.0) * textureColor * vec4(baseColor.xyz * overlayColor.xyz, opacity);

    float fogFactor = exp(-.02 * vFogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    finalColor = mix(finalColor, vec4(0.15, 0.51, 0.52, 1.0), 1.0 - fogFactor);

    fragColor = finalColor;
}
