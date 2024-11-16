// vertex.glsl
export const vertexShader = `
uniform float uTime;
attribute vec3 aStartPosition;
attribute vec3 aTargetPosition;
attribute vec3 aNextTargetPosition;
uniform float uTransitionProgress;
uniform float uAnimationSpeed;

void main() {
    // First, interpolate to the current target
    vec3 currentPos = mix(aStartPosition, aTargetPosition, 1.0 - exp(-uAnimationSpeed * uTime));
    
    // Then, interpolate from current target to next target
    vec3 finalPos = mix(currentPos, aNextTargetPosition, uTransitionProgress);
    
    vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    gl_PointSize = 2.0;
}
`;