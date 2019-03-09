class Coin {

    constructor(gl, pos, depth) {
        this.pos = pos;
        this.rotate = 0;
        this.rotationSpeed = 1;

        this.texture = loadTexture(gl, './assets/gold.jpg');

        // Create a buffer for the cube's vertex positions.

        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var radius = 0.15;



        this.minX = -radius + pos[0];
        this.minY = -radius + pos[1];
        this.minZ = -radius + pos[2]; 
        this.maxX = +radius + pos[0];
        this.maxY = +radius + pos[1];
        this.maxZ = +radius + pos[2];

        var nSides = 20;
        var theta = (2 * Math.PI) / nSides;
        this.nSides = nSides;

        var positions = []


        for (var i = 0; i < nSides; ++i) {
            positions.push(0);
            positions.push(0);
            positions.push(0);

            positions.push(radius * Math.cos(theta * i));
            positions.push(radius * Math.sin(theta * i));
            positions.push(0);

            positions.push(radius * Math.cos(theta * (i + 1)));
            positions.push(radius * Math.sin(theta * (i + 1)));
            positions.push(0);

        }

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Set up the normals for the vertices, so that we can compute lighting.

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        var vertexNormals = []

        for (var i = 0; i < 3 * nSides; ++i) {
            vertexNormals.push(0.0)
            vertexNormals.push(0.0)
            vertexNormals.push(-1.0)
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
            gl.STATIC_DRAW);

        // Now set up the texture coordinates for the faces.

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        var textureCoordinates = []

        for (var i = 0; i < nSides; ++i) {
            textureCoordinates.push(0.0, 0.0);
            textureCoordinates.push(0.5, 0.0);
            textureCoordinates.push(0.5, 0.5);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
            gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        var indices = []


        for (var i = 0; i < positions.length / 3; ++i) {
            indices.push(i);
        }

        // const indices = [
        //     0, 1, 2, 0, 2, 3, // front
        //     4, 5, 6, 4, 6, 7, // back
        //     8, 9, 10, 8, 10, 11, // top
        //     12, 13, 14, 12, 14, 15, // bottom
        //     16, 17, 18, 16, 18, 19, // right
        //     20, 21, 22, 20, 22, 23, // left
        //     24, 25, 26 , 24, 26, 27,
        //     28, 29,30,28,30,31,
        //     32,33,34,32,34,35,
        //     36,37,38,36,38,39,
        // ];

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
            const vertexCount = 3 * this.nSides;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    tick(deltaTime) {
        this.rotate = this.rotate + this.rotationSpeed * deltaTime
    }
}