uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float lightIntensity;

uniform vec3 ambientColor;
uniform float ambientIntensity;

uniform float threshold1;
uniform float threshold2;

uniform vec3 baseColor;

varying vec3 vNormal;
varying vec3 vPosition;

varying vec3 fLightDirection;

void main() {
    float diffuse = max(dot(vNormal, normalize(fLightDirection)), 0.0) ;

    vec3 toonColor;

    if (diffuse > threshold2) {
        toonColor = lightColor * lightIntensity;
    } else if (diffuse > threshold1) {
        toonColor =  lightColor * lightIntensity * 0.5;
    } else {
        toonColor = lightColor * lightIntensity * 0.2;
    }

    toonColor += ambientColor * ambientIntensity;

    gl_FragColor = vec4(toonColor * baseColor, 1.0);
}
