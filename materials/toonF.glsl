uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightIntensity;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform vec3 baseColor;
uniform sampler2D baseTexture;

uniform float opacity;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vFogDistance;

varying vec3 fLightDirection;

void main() {
    float diffuse = max(dot(vNormal, normalize(fLightDirection)), 0.0) ;

    vec3 toonFactor;

    if (diffuse > .6) {
        toonFactor = lightColor * lightIntensity;
    } else if (diffuse > .2) {
        toonFactor =  lightColor * lightIntensity * 0.5;
    } else if (diffuse > .001) {
        toonFactor = lightColor * lightIntensity * 0.2;
    }else {
        toonFactor = lightColor * lightIntensity * 0.1;
    }

    vec3 shadedColor = toonFactor + ambientColor * ambientIntensity;
    vec4 textureColor = texture2D(baseTexture, vUv);
    vec4 finalColor = vec4(shadedColor, 1.0) * textureColor * vec4(baseColor.xyz, opacity);

    float fogFactor = exp(-.02 * vFogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    finalColor = mix(finalColor, vec4(0.15, 0.51, 0.52, 1.0), 1.0 - fogFactor);

    gl_FragColor = finalColor;
}
