uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightIntensity;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform vec3 baseColor;
uniform sampler2D baseTexture;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying float vFogDistance;

varying vec3 fLightDirection;

void main() {
    float diffuse = max(dot(vNormal, normalize(fLightDirection)), 0.0) ;

    vec3 toonFactor;

    if (diffuse > .8) {
        toonFactor = lightColor * lightIntensity;
    } else if (diffuse > .6) {
        toonFactor =  lightColor * lightIntensity * 0.5;
    } else if (diffuse > .3) {
        toonFactor = lightColor * lightIntensity * 0.2;
    }else {
        toonFactor = lightColor * lightIntensity * 0.1;
    }

    vec3 shadedColor = toonFactor + ambientColor * ambientIntensity;
    vec4 textureColor = texture2D(baseTexture, vUv);
    vec3 finalColor = shadedColor * textureColor.xyz;

    float fogFactor = exp(-.08 * vFogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    finalColor = mix(finalColor, vec3(0.15, 0.51, 0.52), 1.0 - fogFactor);

    gl_FragColor = vec4(finalColor, 1.0);
}
