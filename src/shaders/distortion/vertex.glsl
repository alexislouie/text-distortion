// uniform vec2 uResolution;
uniform sampler2D uDistortionTexture;
uniform vec2 uScreenCursorPosition;
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

    // Update the distortion according to however white the cursor on the canvas is 
    float distortionIntensity = texture(uDistortionTexture, uv).r;
    distortionIntensity = smoothstep(0.1, 0.8, distortionIntensity * 0.5); 
    // ^ lowered from 1.0 to 0.8 bc the brighest white shouldn't move outward...
    distortionIntensity += 1.0;

    // Normalize the vertex position so it's -1 to 1 to match the cursor position
    vec3 normalizedVertexPosition = normalize(position);

    // This needs to be updated so black is 1 and white is something bigger than 1
    vec3 scale = vec3(distortionIntensity);

    // USING THE DIRECTION  -------------------------------
    // // Get the direction of vertex to mouse
    // vec3 direction = vec3(uScreenCursorPosition, 0.0) - normalizedVertexPosition;
    // // normalize it and use the negative because we want to push the vertices outwards
    // vec3 normalizedDirection = normalize(-direction);
    // newPosition += normalizedDirection  * 0.5 * distortionIntensity;


    // this is the same as the lines above, but instead it's the direction of the cursor to the vertex
    // vec3 direction = normalizedVertexPosition - vec3(uScreenCursorPosition, 0.0);
    // vec3 normalizedDirection = normalize(direction);
    // newPosition += normalizedDirection  * 0.5 * distortionIntensity;

    // Use the UV Coordinates
    // vec3 direction = normalizedVertexPosition - vec3(uRayCastUvCoordinates, 0.0);
    // vec3 normalizedDirection = normalize(direction);
    // newPosition += normalizedDirection  * 0.5 * distortionIntensity;


    // USING TAN TO GET ANGLE -----------------------------
    // float angle = -tan(position.y / position.x);
    // vec3 displacement = vec3(cos(angle), sin(angle), 1.0);
    // displacement = normalize(displacement);
    // displacement *= distortionIntensity;
    // displacement *= 2.0;
    // newPosition += displacement;

    // -----------------------------------------


    // Final position
    mat4 newModelMatrix = scaleMatrix(modelMatrix, scale);

    // vec4 transformedPosition = modelMatrix * vec4(position, 1.0);


    // Final Position
    vec4 modelPosition = newModelMatrix * vec4(newPosition, 1.0);



    // vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // vNormalizedVertexPosition = normalizedVertexPosition;
    // vScreenCursorPosition = uScreenCursorPosition;
    // vDirection = normalizedDirection;
    // vAngle = angle;
    // vDisplacement = displacement;
    // vRayCastUvCoordinates = uRayCastUvCoordinates;


    // Point size
    // gl_PointSize = 0.3 * uResolution.y;
    // gl_PointSize *= (1.0 / - viewPosition.z);
}