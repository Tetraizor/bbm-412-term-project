in vec2 v_uv;

out vec4 fragColor;

uniform sampler2D baseTexture;
uniform float time;
uniform float opacity;

uniform float width;
uniform float length;

uniform bool direction;
uniform float speed;

const float repeatFactor = 1.0;

void main() {
    float directedSpeed = direction ? -speed : -speed;
    float vRepeat = (direction ? repeatFactor : -repeatFactor) * length / width;
    float hRepeat = 1.0;

    vec2 slideUv = fract(vec2(v_uv.x * hRepeat, v_uv.y * vRepeat) + vec2(0, directedSpeed) * time);

    float verticalOpacityModifier = (1.0 - abs(v_uv.y - 0.5) * 2.0) * 3.0;
    verticalOpacityModifier = min(verticalOpacityModifier, 1.0);
    
    float horizontalOpacityModifier = (1.0 - abs(v_uv.x - 0.5) * 2.0) * 3.0;
    horizontalOpacityModifier = min(horizontalOpacityModifier, 1.0);

    fragColor = vec4(texture(baseTexture, slideUv).rgb, opacity * verticalOpacityModifier * horizontalOpacityModifier);
}