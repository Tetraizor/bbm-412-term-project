varying vec3 vPosition;

void main() {
    float t = (vPosition.y + 1.0) / 30.0;

    vec3 colorTop = vec3(0.2, 0.77, 0.67);
    vec3 colorBottom = vec3(0.15, 0.51, 0.52); 

    vec3 gradientColor = mix(colorBottom, colorTop, t);

    gl_FragColor = vec4(gradientColor, 1.0);
}