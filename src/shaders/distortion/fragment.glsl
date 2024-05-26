uniform vec3 uColor;
// varying vec3 vCursorDirection;
// varying vec2 vScreenCursorPosition;
varying vec3 vNormalizedVertexPosition;
varying vec2 vScreenCursorPosition;
varying vec3 vDirection;
varying float vAngle;
varying vec3 vDisplacement;
varying vec2 vRayCastUvCoordinates;


void main()
{
    // gl_FragColor = vec4(vScreenCursorPosition, 0.0, 1.0);
    // gl_FragColor = vec4(vNormalizedVertexPosition, 1.0);
    // gl_FragColor = vec4(vDirection, 1.0);
    // gl_FragColor = vec4(vRayCastUvCoordinates, 0.0, 1.0);
    // gl_FragColor = vec4(vAngle,vAngle,vAngle, 1.0);
    // gl_FragColor = vec4(vDisplacement, 1.0);
    
    gl_FragColor = vec4(uColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}