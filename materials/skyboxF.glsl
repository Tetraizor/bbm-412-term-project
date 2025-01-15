varying vec3 vPosition;

out vec4 fragColor;

uniform vec3 color1;
uniform vec3 color2;

void main() {
    float t = (vPosition.y + 1.0) / 30.0;

    vec3 colorTop = color1;
    vec3 colorBottom = color2; 

    vec3 gradientColor = mix(colorBottom, colorTop, t);

    fragColor = vec4(gradientColor, 1.0);
}