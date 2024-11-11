export const vertexShader = `
uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform vec2 uMousePosition;
uniform float uHover;
uniform float uRadius;
uniform float uStrength;

varying vec2 vUv;
varying vec3 vColor;

// Random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Noise function for more organic movement
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vUv = uv;
    
    // Get the current position
    vec3 pos = position;
    
    // Calculate distance from current vertex to mouse position
    float dist = distance(pos.xy, uMousePosition);
    
    // Create a more dynamic falloff based on distance and noise
    float influence = 1.0 - smoothstep(0.0, uRadius, dist);
    
    // Create random variation for the smash effect
    float randomFactor = random(pos.xy * 2.0) * 2.0 - 1.0; // Range -1 to 1
    float noiseFactor = noise(pos.xy * 3.0) * 2.0 - 1.0;   // More organic variation
    
    // Combine different factors for displacement
    float displacement = influence * uHover * uStrength;
    
    // Apply displacement with random variations
    // The closer to the mouse, the more random the displacement
    float zDisplacement = displacement * (
        randomFactor * 0.7 +    // Random sharp variations
        noiseFactor * 0.3 +     // Smooth noise variations
        sin(dist * 8.0) * 0.2   // Some wave-like variation
    );
    
    // Apply the displacement
    pos.z += zDisplacement;
    
    // Add some subtle horizontal/vertical movement based on distance
    pos.x += randomFactor * displacement * 0.1;
    pos.y += noiseFactor * displacement * 0.1;
    
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture intensity
    float pictureIntensity = texture(uPictureTexture, uv).r;

    // Set point size based on resolution and add some variation based on displacement
    gl_PointSize = 0.2 * pictureIntensity * uResolution.y / -viewPosition.z;
    gl_PointSize *= (1.0 + abs(zDisplacement) * 0.2); // Points get slightly bigger when displaced

    // Add more dramatic color variation based on displacement
    float colorIntensity = pow(pictureIntensity, 2.0);
    float colorVariation = abs(zDisplacement) * 0.5;
    vColor = vec3(
        colorIntensity + colorVariation,
        colorIntensity + colorVariation * 0.8,
        colorIntensity + colorVariation * 0.6
    );
}
`;