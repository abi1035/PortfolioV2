// fragment.glsl
export const fragmentShader=`
varying vec2 vUv;
varying vec3 vColor;

void main() {

    vec2 uv= gl_PointCoord;
    float distanceToCenter=distance(uv,vec2(0.5)); // To get the center of the circle since we are using circle particles

    if(distanceToCenter>0.5){
        discard; // Do this to convert those square particles to circle
    }

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;