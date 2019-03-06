class Tree {

    constructor(gl, pos, depth) {
        this.pos = pos;
        this.rotate = 0;
        this.rotationSpeed = 1;

        this.texture = loadTexture(gl, 'tree.jpg');

        // Create a buffer for the cube's vertex positions.

        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // var nSides = 100;
        // var radius = 2;
        // var x = 0;
        // var y = radius;
        // var theta = 2 * Math.PI / nSides;
        // var sinTheta = Math.sin(theta);
        // var cosTheta = Math.cos(theta);

        // var positions = []
        // positions.push(0);
        // positions.push(0);
        // positions.push(0);

        // positions.push(0);
        // positions.push(2);
        // positions.push(0);

        // for(var i=0; i < nSides ;++i)
        // {
        //     var tempX = x*cosTheta + y*sinTheta;
        //     var tempY = y*cosTheta - x*sinTheta;
        //     positions.push(tempX);
        //     positions.push(tempY);
        //     positions.push(0);
        //     x = tempX;
        //     y = tempY;
        // }

        // Now create an array of positions for the cube.
        var baseWidth = 0.6;
        var baseDepth = 0.6;
        var topWidth = 0.6;
        var topDepth = 0;
        var height = 2;


        const positions = [
            // Front face
            -baseWidth, -height, baseDepth,
            baseWidth, -height, baseDepth,
            0, height, 0,
            -0, height, 0,

            // Back face
            -baseWidth, -height, -baseDepth,
            -0, height, -0,
            0, height, -0,
            baseWidth, -height, -baseDepth,

            // Top face
            0, height, 0,
            0, height, 0,
            0, height, 0,
            0, height, 0,

            // Bottom face
            -baseWidth, -height, -baseDepth,
            baseWidth, -height, -baseDepth,
            baseWidth, -height, baseDepth,
            -baseWidth, -height, baseDepth,

            // Right face
            baseWidth, -height, -baseDepth,
            0, height, -0,
            0, height, 0,
            baseWidth, -height, baseDepth,

            // Left face
            -baseWidth, -height, -baseDepth,
            -baseWidth, -height, baseDepth,
            -0, height, 0,
            -0, height, -0,


            -0.25, -3.5, 0.25,
            0.25, -3.5, 0.25,
            0.25,0, 0.25,
            -0.25,0, 0.25,

            -0.25, -3.5, -0.25,
            0.25, -3.5, -0.25,
            0.25,0, -0.25,
            -0.25,0, -0.25,

            0.25, -3.5, -0.25,
            0.25, -3.5, 0.25,
            0.25,0, 0.25,
            0.25,0, -0.25,

            -0.25, -3.5, -0.25,
            -0.25, -3.5, 0.25,
            -0.25,0, 0.25,
            -0.25,0, -0.25,

        ];
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Set up the normals for the vertices, so that we can compute lighting.

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        const vertexNormals = [
            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,

            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
            gl.STATIC_DRAW);

        // Now set up the texture coordinates for the faces.

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Front
            0.0, 0.0,
            0.5, 0.0,
            0.5, 0.5,
            0.0, 0.5,
            // Back
            0.0, 0.0,
            0.5, 0.0,
            0.5, 0.5,
            0.0, 0.5,
            // Top
            0.0, 0.0,
            0.5, 0.0,
            0.5, 0.5,
            0.0, 0.5,
            // Bottom
            0.0, 0.0,
            0.5, 0.0,
            0.5, 0.5,
            0.0, 0.5,
            // Right
            0.0, 0.0,
            0.5, 0.0,
            0.5, 0.5,
            0.0, 0.5,
            // Left
            0.0, 0.0,
            0.5, 0.0,
            0.5, 0.5,
            0.0, 0.5,

            0.8, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.8, 1.0,
            
            0.8, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.8, 1.0,

            0.8, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.8, 1.0,

            0.8, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.8, 1.0,


        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
            gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // back
            8, 9, 10, 8, 10, 11, // top
            12, 13, 14, 12, 14, 15, // bottom
            16, 17, 18, 16, 18, 19, // right
            20, 21, 22, 20, 22, 23, // left
            24, 25, 26 , 24, 26, 27,
            28, 29,30,28,30,31,
            32,33,34,32,34,35,
            36,37,38,36,38,39,
        ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: positionBuffer,
            normal: normalBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };
    }


    drawObject(gl, viewMatrix, projectionMatrix, programInfo) {
        console.log("lel");

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        mat4.translate(modelMatrix, // destination matrix
            modelMatrix, // matrix to translate
            this.pos); // amount to translate

        // mat4.rotate(modelMatrix,  // destination matrix
        //               modelMatrix,  // matrix to rotate
        //               this.rotate,     // amount to rotate in radians
        //               [0, 0, 1]);       // axis to rotate around (Z)


        // mat4.rotate(modelMatrix,  // destination matrix
        //                 modelMatrix,  // matrix to rotate
        //                 this.rotate,     // amount to rotate in radians
        //                 [0, 1, 0]);       // axis to rotate around (Z)


        const modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);


        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the texture coordinates from
        // the texture coordinate buffer into the textureCoord attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
        }

        // Tell WebGL how to pull out the normals from
        // the normal buffer into the vertexNormal attribute.
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.normal);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexNormal);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);

        // Specify the texture to map onto the faces.

        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = 40;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    tick(deltaTime) {
        this.rotate = this.rotate + this.rotationSpeed * deltaTime
    }
}