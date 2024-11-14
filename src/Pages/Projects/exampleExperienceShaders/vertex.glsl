// vertex.glsl
export const vertexShader = `
uniform float uTime;
attribute vec3 aStartPosition;
attribute vec3 aTargetPosition;
attribute vec3 aNextTargetPosition;
uniform float uTransitionProgress;
uniform float uAnimationSpeed;

void main() {
    // Interpolate between current target and next target based on transition progress
    vec3 currentTarget = mix(aTargetPosition, aNextTargetPosition, uTransitionProgress);
    
    // Animate from start position to current target
    vec3 pos = mix(aStartPosition, currentTarget, 1.0 - exp(-uAnimationSpeed * uTime));
    
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    gl_PointSize = 2.0;
}
`;