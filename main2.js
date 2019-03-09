var eye = [0, -1.6, 0];
var target = [0, 0, 2000];
var up = [0, 1, 0];

var player;
var policeman;
var dog;
var finishLine;

var score = 0;
// var sky = [];
var tracks = [];
var barricades = [];
var pavement = [];
var trees = [];
var crates = [];
var jetpacks = [];
var jumpshoes = [];
var walls = [];
var hurdles = [];
var coins = [];
var trains = [];

var gameOver = false;
var gameWon = false;

var timer = 0;

const canvas = document.querySelector('#glcanvas');
const gl = canvas.getContext('webgl');
var gray = false;

// Vertex shader program

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      // Apply lighting effect
      highp vec3 ambientLight = vec3(0.5, 0.5, 0.5);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

const vsSourceFlash = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;
  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;
  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
    // Apply lighting effect
    highp vec3 ambientLight = vec3(0.8, 0.8, 0.8);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
`;
// Fragment shader program

const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;

const fsSourceGray = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    uniform sampler2D uSampler;
    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      texelColor[0] *= 0.299;
      texelColor[1] *= 0.587;
      texelColor[2] *= 0.114;
      highp float g = texelColor[0] + texelColor[1] + texelColor[2];
      texelColor[0] = g;
      texelColor[1] = g;
      texelColor[2] = g;
    //   highp float grey = dot(vec3(texelColor[0], texelColor[1], texelColor[3]), (0.289, 0.517, 0.114));
    //   gl_FragColor = vec4(g, g, g, 1);
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);

    }
  `;

// Initialize a shader program; this is where all the lighting
// for the vertices and so forth is established.
const shaderProgramNormal = initShaderProgram(gl, vsSource, fsSource);
const shaderProgramGray = initShaderProgram(gl, vsSource, fsSourceGray);
const shaderProgramGrayFlash = initShaderProgram(gl, vsSourceFlash, fsSourceGray);
const shaderProgramNormalFlash = initShaderProgram(gl, vsSourceFlash, fsSource);


// Collect all the info needed to use the shader program.
// Look up which attributes our shader program is using
// for aVertexPosition, aVertexNormal, aTextureCoord,
// and look up uniform locations.
const programInfoNormal = {
    program: shaderProgramNormal,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgramNormal, 'aVertexPosition'),
        vertexNormal: gl.getAttribLocation(shaderProgramNormal, 'aVertexNormal'),
        textureCoord: gl.getAttribLocation(shaderProgramNormal, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgramNormal, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgramNormal, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgramNormal, 'uNormalMatrix'),
        uSampler: gl.getUniformLocation(shaderProgramNormal, 'uSampler'),
    },
};

const programInfoGray = {
    program: shaderProgramGray,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgramGray, 'aVertexPosition'),
        vertexNormal: gl.getAttribLocation(shaderProgramGray, 'aVertexNormal'),
        textureCoord: gl.getAttribLocation(shaderProgramGray, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgramGray, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgramGray, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgramGray, 'uNormalMatrix'),
        uSampler: gl.getUniformLocation(shaderProgramGray, 'uSampler'),
    },
};

const programInfoNormalFlash = {
    program: shaderProgramNormalFlash,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgramNormalFlash, 'aVertexPosition'),
        vertexNormal: gl.getAttribLocation(shaderProgramNormalFlash, 'aVertexNormal'),
        textureCoord: gl.getAttribLocation(shaderProgramNormalFlash, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgramNormalFlash, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgramNormalFlash, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgramNormalFlash, 'uNormalMatrix'),
        uSampler: gl.getUniformLocation(shaderProgramNormalFlash, 'uSampler'),
    },
};

const programInfoGrayFlash = {
    program: shaderProgramGrayFlash,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgramGrayFlash, 'aVertexPosition'),
        vertexNormal: gl.getAttribLocation(shaderProgramGrayFlash, 'aVertexNormal'),
        textureCoord: gl.getAttribLocation(shaderProgramGrayFlash, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgramGrayFlash, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgramGrayFlash, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgramGrayFlash, 'uNormalMatrix'),
        uSampler: gl.getUniformLocation(shaderProgramGrayFlash, 'uSampler'),
    },
};


programInfo = programInfoNormal;

Mousetrap.bind('g', function () {
    if (programInfo == programInfoNormal) {
        document.getElementById("glcanvas").style = "background: url('skygray.jpeg'); background-size: cover; background-repeat: no-repeat";
        programInfo = programInfoGray;
        gray = true;
    } else {
        document.getElementById("glcanvas").style = "background: url('sky.jpeg'); background-size: cover; background-repeat: no-repeat";
        programInfo = programInfoNormal;
        gray = false;
    }
});




main();

//
// Start here
//
function main() {

    player = new Player(gl, [0, -2.5, 7]);
    policeman = new Police(gl, [0, -2.5, 2]);
    dog = new Dog(gl, [0, -2.5, 3]);
    finishLine = new FinishLine(gl, [0, 0, 1000]);

    keyBindings();

    {
        trains.push(new Train(gl, [0, -2, 100], 5, 'cargo1.jpg'));
        trains.push(new Train(gl, [2, -2, 300], 5, 'cargo2.png'));
        trains.push(new Train(gl, [-2, -2, 400], 5, 'cargo3.png'));

        trains.push(new Train(gl, [0, -2, 600], 5, 'cargo4.png'));
        trains.push(new Train(gl, [2, -2, 700], 5, 'cargo3.png'));
        trains.push(new Train(gl, [-2, -2, 800], 5, 'cargo2.png'));

        trains.push(new Train(gl, [0, -2, 900], 5, 'cargo1.jpg'));
        trains.push(new Train(gl, [2, -2, 1000], 5, 'cargo2.png'));

        trains.push(new Train(gl, [-2, -2, 650], 5, 'cargo4.png'));
        trains.push(new Train(gl, [0, -2, 750], 5, 'cargo3.png'));
        trains.push(new Train(gl, [2, -2, 850], 5, 'cargo2.png'));
    }

    for (var i = 0; i < 10; ++i) {
        jetpacks.push(new JetPack(gl, [2, -2.7, 20 * i]));
        jumpshoes.push(new JumpShoes(gl, [-2, -2.7, 20 * i + 2]));
    }

    for (var i = 0; i < 30; ++i) {
        // hurdles.push(new Hurdle(gl, [0, , +50 * i]));
        var pos = [];
        lane = Math.floor(Math.random() * 3)
        if (lane == 0) pos.push(0);
        else if (lane == 1) pos.push(2);
        else pos.push(-2);

        pos.push(-1.65);

        pos.push(60 * i);

        hurdles.push(new Hurdle(gl, pos));
    }

    for (var i = 0; i < 40; ++i) {
        walls.push(new Wall(gl, [6, 0.6, +50 * i]))
        walls.push(new Wall(gl, [-6, 0.6, +50 * i]))
    }

    for (var i = 0; i < 105; ++i) {
        tracks.push(new Track(gl, [0, -3, 10 * i]));
    }



    for (var i = 0; i < 30; ++i) {
        var pos = [];
        lane = Math.floor(Math.random() * 3)
        if (lane == 0) pos.push(0);
        else if (lane == 1) pos.push(2);
        else pos.push(-2);

        pos.push(-2.5);

        pos.push(50 * i);

        crates.push(new Crate(gl, pos));
    }
    for (var i = 0; i < 40; ++i) {
        pavement.push(new Pavement(gl, [0, -3.3, +50 * i]));
        //   sky.push(new Sky(gl, [0, 4,+50*i]));
    }
    for (var i = 0; i < 40; ++i) {
        trees.push(new Tree(gl, [3.9, 0, +20 * i], 0.25));
        trees.push(new Tree(gl, [-3.9, 0, +20 * i], 0.25));
    }
    for (var i = 0; i < 30; ++i) {
        var pos = [];
        lane = Math.floor(Math.random() * 3)
        if (lane == 0) pos.push(0);
        else if (lane == 1) pos.push(1.75);
        else pos.push(-2);

        pos.push(-2.5);

        pos.push(eye[2] + 40 * i);

        barricades.push(new Barricade(gl, pos));

    }

    for (var i = 0; i < 260; ++i) {
        var pos = [];
        var lane = Math.floor(Math.random() * 3)
        if (lane == 0) pos.push(0);
        else if (lane == 1) pos.push(2);
        else pos.push(-2);

        pos.push(-2.6);

        pos.push(3 * i);

        coins.push(new Coin(gl, pos));
    }

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }


    var then = 0;

    // Draw the scene repeatedly
    function render(now) {
        timer++;
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;

        tick(deltaTime);
        drawScene(gl, programInfo, deltaTime);
        document.getElementById("Score").innerHTML = "Score: "+score;
        if (gameOver) 
        {
            if(gameWon)
            {
                document.getElementById("Win").style.display = "block";
                document.getElementById("Win").innerHTML = "Game Won";
            }
            else
            {
                document.getElementById("Win").style.display = "block";
                document.getElementById("Win").innerHTML = "Game Lost";
            }
            return;
        }

        requestAnimationFrame(render);


    }
    requestAnimationFrame(render);
}


//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}



function tick(deltaTime) {
    eye[2] += 0.15;
    eye[1] = player.pos[1] + 1;
    eye[0] = player.pos[0];

    policeman.pos[0] = player.pos[0];
    dog.pos[0] = player.pos[0];

    player.tick(deltaTime);
    policeman.tick(deltaTime);
    dog.tick(deltaTime);



    for (var i = 0; i < trains.length; ++i) {
        trains[i].tick(deltaTime);
        if (intersect(player, trains[i])) {
            player.strike1 = true;
            gameOver = true;
        } else {
            if (eye[2] > trains[i].pos[2] + 20) {
                trains.splice(i, 1);
            }
        }
    }

    for (var i = 0; i < jetpacks.length; ++i) {
        if (intersect(player, jetpacks[i])) {
            jetpacks.splice(i, 1);
            player.jetPack = true;
            var f = player.pos[2]+5;

            for(var j=0;j < 20;++j)
            {   
                var pos = [];
                var lane = Math.floor(Math.random() * 3)
                if (lane == 0) pos.push(0);
                else if (lane == 1) pos.push(2);
                else pos.push(-2);
        
                pos.push(3.0);
        
                pos.push(5 * j);
        
                coins.push(new Coin(gl, pos));
            }
        } else {

            jetpacks[i].tick();
            if (eye[2] > jetpacks[i].pos[2] + 20) {
                jetpacks.splice(i, 1);
            }
        }
    }

    for (var i = 0; i < coins.length; ++i) {

        coins[i].tick(deltaTime);
        if (intersect( player,coins[i])) {
            coins.splice(i, 1);
            score += 1;
        }
    }

    for (var i = 0; i < tracks.length; ++i) {
        if (eye[2] > tracks[i].pos[2] + 20) {
            tracks.splice(i, 1);
        }
    }

    for (var i = 0; i < barricades.length; ++i) {
        if (intersect(player, barricades[i])) {
            player.strike1 = true;
            gameOver = true;
            // if (player.strike1) {
            //     gameOver = true;
            //     policeman.pos[2] += 2;
            // } else {
            //     policeman.pos[2] += 1;
            //     player.strike1 = true;
            //     barricades.splice(i, 1);
            // }
        } else {
            if (eye[2] > barricades[i].pos[2] + 20) {
                barricades.splice(i, 1);
            }
        }
    }
    for (var i = 0; i < pavement.length; ++i) {
        if (eye[2] > pavement[i].pos[2] + 20) {
            pavement.splice(i, 1);
        }
    }
    for (var i = 0; i < trees.length; ++i) {
        if (eye[2] > trees[i].pos[2] + 20) {
            trees.splice(i, 1);
        }
    }
    for (var i = 0; i < crates.length; ++i) {
        if (intersect(player, crates[i])) {
            if (player.strike1) {
                gameOver = true;
                policeman.pos[2] += 2;
            } else {
                policeman.pos[2] += 1;
                player.strike1 = true;
                crates.splice(i, 1);
            }
        } else {
            if (eye[2] > crates[i].pos[2] + 20) {
                crates.splice(i, 1);
            }
        }

    }

    for (var i = 0; i < jumpshoes.length; ++i) {
        if (intersect(player, jumpshoes[i])) {
            jumpshoes.splice(i, 1);
            player.superJump = true;
        } else {
            jumpshoes[i].tick();
            if (eye[2] > jumpshoes[i].pos[2] + 20) {
                jumpshoes.splice(i, 1);
            }
        }
    }
    for (var i = 0; i < walls.length; ++i) {
        if (eye[2] > walls[i].pos[2] + 20) {
            walls.splice(i, 1);
        }
    }
    for (var i = 0; i < hurdles.length; ++i) {
        if (intersect(player, hurdles[i])) {
            if (player.strike1) {
                gameOver = true;
                policeman.pos[2] += 2;
            } else {
                policeman.pos[2] += 1;
                player.strike1 = true;
                hurdles.splice(i, 1);
            }

        } else {
            if (eye[2] > hurdles[i].pos[2] + 20) {
                hurdles.splice(i, 1);
            }
        }
    }

    if (player.strike1) {
        if (!gameOver) {
            if (timer % 1000 == 0) {
                policeman.pos[2] -= 1;
                player.strike1 = false;
            }
        }
    }

    if (timer == 300) {
        policeman.pos[2] -= 0.25;
    }
    if (player.pos[2] > 1000) {
        gameOver = true;
        gameWon = true;
    }
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    var viewMatrix = mat4.create();

    mat4.lookAt(viewMatrix, eye, target, up);

    player.drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    policeman.drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    dog.drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    finishLine.drawObject(gl, viewMatrix, projectionMatrix, programInfo);

    for (var i = 0; i < tracks.length; ++i) {
        tracks[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < barricades.length; ++i) {
        barricades[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < pavement.length; ++i) {
        pavement[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    // for(var i=0;i<sky.length;++i)
    // {
    //     sky[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    // }
    for (var i = 0; i < crates.length; ++i) {
        crates[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < trees.length; ++i) {
        trees[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < jumpshoes.length; ++i) {
        jumpshoes[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < jetpacks.length; ++i) {
        jetpacks[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < hurdles.length; ++i) {
        hurdles[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < coins.length; ++i) {
        coins[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }
    for (var i = 0; i < trains.length; ++i) {
        trains[i].drawObject(gl, viewMatrix, projectionMatrix, programInfo);
    }


    var flash = (timer % 100 <= 5)
    for (var i = 0; i < walls.length; ++i) {
        if (flash) {
            if (gray) {
                walls[i].drawObject(gl, viewMatrix, projectionMatrix, programInfoGrayFlash);
            } else {
                walls[i].drawObject(gl, viewMatrix, projectionMatrix, programInfoNormalFlash);
            }
        } else {
            if (gray) {
                walls[i].drawObject(gl, viewMatrix, projectionMatrix, programInfoGray);
            } else {
                walls[i].drawObject(gl, viewMatrix, projectionMatrix, programInfoNormal);
            }
        }

    }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


function keyBindings() {

    Mousetrap.bind('w', function () {
        eye[1] += 0.1;
    });
    Mousetrap.bind('s', function () {
        eye[1] -= 0.1;
    });
    Mousetrap.bind('left', function () {
        player.pos[0] += 2;
    });
    Mousetrap.bind('right', function () {
        player.pos[0] -= 2;
    });
    Mousetrap.bind('up', function () {
        if (!player.is_jump) {
            var jumpVelocity = 0.18;
            if (player.superJump) {
                jumpVelocity = 0.28;
            }
            player.is_jump = true;
            player.pos[1] += 0.02;
            vec3.add(player.speed, player.speed, [0, jumpVelocity, 0]);
        }

    }, 'keydown');
    Mousetrap.bind('down', function () {
        // player.pos[] -= 2;
    });
    Mousetrap.bind('a', function () {
        eye[0] -= 2;
    });
    Mousetrap.bind('d', function () {
        eye[0] += 2;
    });

}

function intersect(a, b) {
    return (a.minX <= b.maxX && a.maxX >= b.minX) &&
        (a.minY <= b.maxY && a.maxY >= b.minY) &&
        (a.minZ <= b.maxZ && a.maxZ >= b.minZ);
}

