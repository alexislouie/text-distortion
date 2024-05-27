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
    float distortionIntensity = 1.0 - distance(uv, uRayCastUvCoordinates);
    distortionIntensity = smoothstep(0.0, 1.5, distortionIntensity) + 1.0; 
    vDistortionIntensity = distortionIntensity;

    // Pushes vertices away from cursor
    // vec3 normalizedVertexPosition = normalize(position);
    // vec3 direction = normalizedVertexPosition - vec3(uRayCastUvCoordinates, -1.0);
    // vec3 normalizedDirection = normalize(direction);
    // newPosition += normalizedDirection * 0.1 * distortionIntensity;

    // Scale based on Intensity ------------------------
    vec3 scale = vec3(distortionIntensity);
    mat4 newModelMatrix = scaleMatrix(modelMatrix, scale);

    // Final Position
    vec4 modelPosition = newModelMatrix * vec4(newPosition, 1.0);
    // vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // vDisplacement = displacement;
    // vNormalizedVertexPosition = normalizedVertexPosition;
    // vDirection = normalizedDirection;
    vRayCastUvCoordinates = uRayCastUvCoordinates;
}