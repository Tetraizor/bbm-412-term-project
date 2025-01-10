uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightIntensity;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform vec3 baseColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

varying float vFogDistance;

varying vec3 fLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    
    float lambertianFactor = max(dot(normal, fLightDirection), 0.2);
    float fogFactor = exp(-.1 * vFogDistance);
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    vec3 shadedColor = ambientColor * ambientIntensity + 
                lambertianFactor * lightColor * lightIntensity;
    
    vec3 finalColor = mix(baseColor * shadedColor, vec3(0.0, 0.0, 0.0), 1.0 - fogFactor);

    gl_FragColor = vec4( finalColor, 1.0);
}