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

varying vec3 fLightDirection;

void main() {
    vec3 normal = normalize(vNormal);
    
    float lambertian = max(dot(normal, fLightDirection), 0.2);

    vec3 color = ambientColor * ambientIntensity + 
                lambertian * lightColor * lightIntensity;
    
    gl_FragColor = vec4(color * baseColor, 1.0);
}