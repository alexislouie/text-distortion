uniform vec3 uColor;
varying vec3 vDirection;
varying vec3 vDisplacement;
varying vec2 vRayCastUvCoordinates;
varying float vDistortionIntensity;


void main()
{   
    // gl_FragColor = vec4(vRayCastUvCoordinates, 0.0, 1.0);
    // gl_FragColor = vec4(vDirection, 1.0);
    // gl_FragColor = vec4(vec3(vDistortionIntensity), 1.0);

    gl_FragColor = vec4(uColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}