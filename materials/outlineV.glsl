uniform float outlineThickness;
uniform float curvatureFactor; // Optional: a factor to control curvature-based outline thickness
uniform float distanceFactor; // Optional: Adjust outline thickness based on distance

void main() {
    // Adjust outline thickness based on curvature (smoothly scale for flatter geometry)
    float dynamicOutlineThickness = outlineThickness * (1.0 + curvatureFactor * (normal.x + normal.y + normal.z));

    // Optionally: Apply distance-based outline adjustment for a better visual effect
    dynamicOutlineThickness *= distanceFactor;

    // Apply the outline offset along the normal direction
    vec3 newPosition = position + normal * dynamicOutlineThickness;

    // Final position in clip space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
