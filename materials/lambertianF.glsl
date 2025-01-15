uniform vec3 lightColor;
uniform float lightIntensity;

uniform vec3 ambientColor;
uniform float ambientIntensity;

in vec3 vNormal;
in vec3 fLightDirection;
in float vFogDistance;
in vec2 vUv;

uniform vec3 baseColor;
uniform vec3 overlayColor;
uniform float opacity;
uniform sampler2D baseTexture;

out vec4 fragColor;

void main() {
    vec3 normal = normalize(vNormal);
    
    float lambertianFactor = max(dot(normal, fLightDirection), 0.2);
    float fogFactor = exp(-.06 * vFogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    vec3 shadedColor = vec3(ambientColor * ambientIntensity + 
                lambertianFactor * lightColor * lightIntensity * 1.8);
    
    vec3 finalColor = mix(baseColor * shadedColor * texture2D(baseTexture, vUv).xyz, vec3(0.0, 0.0, 0.0), 1.0 - fogFactor);

    fragColor =  vec4(finalColor * overlayColor * opacity, 1.0);
}