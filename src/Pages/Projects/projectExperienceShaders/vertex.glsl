export const vertexShader = `
uniform float uTime;
attribute vec3 aStartPosition;
attribute vec3 aTargetPosition;
uniform float uTransitionSpeed;

void main() {
    // Interpolate between start and target positions
    vec3 pos = mix(aStartPosition, aTargetPosition, 1.0 - exp(-uTransitionSpeed * uTime));
    
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 2.0;
}
`;

