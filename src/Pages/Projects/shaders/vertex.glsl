export const vertexShader = `
attribute vec3 startPosition;
attribute vec3 targetPosition;
uniform float time;

void main() {
    // Interpolate particle position from start to target based on time
    vec3 interpolatedPosition = mix(startPosition, targetPosition, smoothstep(0.0, 1.0, time));
    
    // Set final position for each particle
    gl_Position = projectionMatrix * modelViewMatrix * vec4(interpolatedPosition, 1.0);
    
    // Set particle size
    gl_PointSize = 2.0;
}
`;

