uniform vec2 uRayCastUvCoordinates;

varying float vDistortionIntensity;
varying vec3 vNormalizedVertexPosition;
varying vec2 vScreenCursorPosition;
varying vec2 vRayCastUvCoordinates;

varying vec3 vDirection;

varying float vAngle;
varying vec3 vDisplacement;

mat4 scaleMatrix(mat4 matrix, vec3 scale) {
    matrix[0] *= scale.x;
    matrix[1] *= scale.y;
    matrix[2] *= scale.z;
    return matrix;
}

void main()
{
    vec3 newPosition = position;
    // TODO: make distortion in a tighter circle 
    float distortionIntensity = distance(uv, uRayCastUvCoordinates);
    distortionIntensity = smoothstep(0.1, 1.0, distortionIntensity);
    distortionIntensity = clamp(distortionIntensity, 0.1, 0.3); 
    vDistortionIntensity = distortionIntensity;
 

    // Use the UV Coordinates  -------------------------------
    vec3 normalizedVertexPosition = normalize(position);

    // Find direction 
    vec3 direction = normalizedVertexPosition - vec3(uRayCastUvCoordinates, -1.0);
    vec3 normalizedDirection = normalize(direction);

    newPosition += normalizedDirection * 0.1 * distortionIntensity;

    // Final Position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // vDisplacement = displacement;
    // vNormalizedVertexPosition = normalizedVertexPosition;
    vDirection = normalizedDirection;
    vRayCastUvCoordinates = uRayCastUvCoordinates;
}