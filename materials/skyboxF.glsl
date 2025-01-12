varying vec3 vPosition;

void main() {
    float t = (vPosition.y + 1.0) / 30.0;

    vec3 colorTop = vec3(0.56, 0.76, 0.89);
    vec3 colorBottom = vec3(0.78, 0.83, 0.93); 

    vec3 gradientColor = mix(colorBottom, colorTop, t);

    gl_FragColor = vec4(gradientColor, 1.0);
}