class Player {

    constructor(gl, pos) {
        this.initSpeed = [0, 0, 0.15];
        this.speed = [0, 0, 0.15];
        this.gravity = [0, -0.01, 0];
        this.pos = pos;
        this.rotate = 0;
        this.rotationSpeed = 1;
        this.is_jump = false;
        this.superJump = false;
        this.superJumpTimer = 250;
        this.jetPack = false;
        this.jetPackTimer = 250;
        this.strike1 = false;
        this.strike2 = false;

        this.texture = loadTexture(gl, 'player.jpg');

        // Create a buffer for the cube's vertex positions.

        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the cube.
        var baseWidth = 0.25;
        var baseDepth = 0.01;
        var topWidth = 0.25;
        var topDepth = 0.01;
        var height = 0.4;

        this.baseWidth = baseWidth;
        this.baseDepth = baseDepth;
        this.topWidth = topWidth;
        this.topDepth = topDepth;
        this.height = height;



        this.minX = -baseWidth + pos[0];
        this.minY = -height + pos[1];
        this.minZ = -baseDepth + pos[2];
        this.maxX = +topWidth + pos[0];
        this.maxY = +height + pos[1];
        this.maxZ = +topDepth + pos[2];


        const positions = [
            // Front face
            -baseWidth, -height, baseDepth,
            baseWidth, -height, baseDepth,
            topWidth, height, topDepth,
            -topWidth, height, topDepth,

            // Back face
            -baseWidth, -height, -baseDepth,
            -topWidth, height, -topDepth,
            topWidth, height, -topDepth,
            baseWidth, -height, -baseDepth,

            // Top face
            -topWidth, height, -topDepth,
            topWidth, height, -topDepth,
            topWidth, height, topDepth,
            -topWidth, height, topDepth,

            // Bottom face
            -baseWidth, -height, -baseDepth,
            baseWidth, -height, -baseDepth,
            baseWidth, -height, baseDepth,
            -baseWidth, -height, baseDepth,

            // Right face
            baseWidth, -height, -baseDepth,
            topWidth, height, -topDepth,
            topWidth, height, topDepth,
            baseWidth, -height, baseDepth,

            // Left face
            -baseWidth, -height, -baseDepth,
            -baseWidth, -height, baseDepth,
            -topWidth, height, topDepth,
            -topWidth, height, -topDepth,
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
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Back
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Top
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Bottom
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Right
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // Left
            0.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
            gl.STATIC_DRAW);

        // Now set up the texture coordinates for the faces.

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
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


        mat4.rotate(modelMatrix, // destination matrix
            modelMatrix, // matrix to rotate
            Math.PI, // amount to rotate in radians
            [0, 1, 0]); // axis to rotate around (Z)


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
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    tick(deltaTime) {
        if (this.superJump) {
            this.superJumpTimer--;
            if (this.superJumpTimer < 0) {
                this.superJump = false;
                this.superJumpTimer = 100;
            }
        }

        if (this.jetPack) {
            this.jetPackTimer--;
            if (this.jetPackTimer < 0) {
                this.jetPack = false;
                this.jetPackTimer = 100;
            }
        }

        if (this.jetPack) {
            this.pos[1] = 3;
            this.pos[0] += this.initSpeed[0];
            this.pos[2] += this.initSpeed[2];
        } else {

            if (this.pos[1] < -2.5) {
                this.pos[1] = -2.51;
                this.is_jump = false;
                // this.speed = [0, 0, 0.1];
                this.speed[1] = 0;
                vec3.add(this.pos, this.pos, this.speed);

            } else {
                // this.speed[1] += this.gravity[1];
                vec3.add(this.speed, this.speed, this.gravity);
                vec3.add(this.pos, this.pos, this.speed);
            }
            this.minX = this.pos[0] - this.baseWidth;
            this.minY = this.pos[1] - this.height;
            this.minZ = this.pos[2] - this.baseDepth;
            this.maxX = this.pos[0] + this.topWidth;
            this.maxY = this.pos[1] + this.height;
            this.maxZ = this.pos[2] + this.topDepth;
        }
    }
}