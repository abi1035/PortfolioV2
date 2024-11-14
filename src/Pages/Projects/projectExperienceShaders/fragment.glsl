export const fragmentShader = `
void main() {
    // Create a circular particle
    float distanceToCenter = length(gl_PointCoord - 0.5);
    float alpha = 1.0 - smoothstep(0.45, 0.5, distanceToCenter);
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`;
