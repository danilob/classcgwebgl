var InitDemo = function () {
    
var vertexShaderText = document.getElementById('vertex-shader').value;
var fragmentShaderText =document.getElementById('fragment-shader').value;
	console.log('This is working');

	var canvas = document.getElementById('glCanvasTriangle');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(217/255., 228/255., 221/255., 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create buffer
	//
	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-0.5, 0.5, -0.5,   0.5, 0.5, 0.5,
		-0.5, 0.5, 0.5,    0.5, 0.5, 0.5,
		0.5, 0.5, 0.5,     0.5, 0.5, 0.5,
		0.5, 0.5, -0.5,    0.5, 0.5, 0.5,

		// Left
		-0.5, 0.5, 0.5,    0.75, 0.25, 0.5,
		-0.5, -0.5, 0.5,   0.75, 0.25, 0.5,
		-0.5, -0.5, -0.5,  0.75, 0.25, 0.5,
		-0.5, 0.5, -0.5,   0.75, 0.25, 0.5,

		// Right
		0.5, 0.5, 0.5,    0.25, 0.25, 0.75,
		0.5, -0.5, 0.5,   0.25, 0.25, 0.75,
		0.5, -0.5, -0.5,  0.25, 0.25, 0.75,
		0.5, 0.5, -0.5,   0.25, 0.25, 0.75,

		// Front
		0.5, 0.5, 0.5,    0.5, 0.3, 0.15,
		0.5, -0.5, 0.5,    0.5, 0.3, 0.15,
		-0.5, -0.5, 0.5,    0.5, 0.3, 0.15,
		-0.5, 0.5, 0.5,    0.5, 0.3, 0.15,

		// Back
		0.5, 0.5, -0.5,    0.0, 0.5, 0.15,
		0.5, -0.5, -0.5,    0.0, 0.5, 0.15,
		-0.5, -0.5, -0.5,    0.0, 0.5, 0.15,
		-0.5, 0.5, -0.5,    0.0, 0.5, 0.15,

		// Bottom
		-0.5, -0.5, -0.5,   0.0, 0.5, 0.5,
		-0.5, -0.5, 0.5,    0.0, 0.5, 0.5,
		0.5, -0.5, 0.5,     0.0, 0.5, 0.5,
		0.5, -0.5, -0.5,    0.0, 0.5, 0.5,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
	


	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // localização do atributo
		3, // numero de elementos por atributo
		gl.FLOAT, // Tipo de elemento
		gl.FALSE, //Normalização
		6 * Float32Array.BYTES_PER_ELEMENT, // Tamanho do vertice individual
		0 // Offset para iniciar a capturar os valores
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	gl.useProgram(program);

	//fazendo a ponte com o shader
	var matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program,'mView');
	var matProjUniformLocation = gl.getUniformLocation(program,'mProj');

	//inicializando as matrizes de transformação
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	var mat4 = glMatrix.mat4;
	mat4.identity(worldMatrix);
	mat4.identity(viewMatrix);
	mat4.identity(projMatrix);

	mat4.lookAt(viewMatrix,[0,0,-4],[0,0,0],[0,1,0]);
	mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45),canvas.width/canvas.height,0.1,1000);

	//inserindo valores nas variáveis no shader
	gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation,gl.FALSE,viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation,gl.FALSE,projMatrix);

	
	//
	// Main render loop
	//
	//var matrixLocationX = gl.getUniformLocation(program, "u_tx");
	//var matrixLocationY = gl.getUniformLocation(program, "u_ty");
	
	//gl.uniform1f(matrixLocationX, 0.0);//uniform float u_tx;
	//gl.uniform1f(matrixLocationY, 0.0);//uniform float u_ty;



	//https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
	//Usando as matrizes de transformação com uniform: https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html
    //gl.drawArrays(gl.TRIANGLES, 0, 3);
	//createOther(gl,program);
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);


	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);

	var mScale = new Float32Array(16); 
	mat4.scale(mScale,identityMatrix,[1,1,1]);
	
	var mTranslate = new Float32Array(16); 
    mat4.translate(mTranslate,identityMatrix,[0,0,0]);

	var angle = 0;
	var loop = function(){
		angle = performance.now() / 1000/ 6 * 2 * Math.PI;
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
		mat4.mul(worldMatrix, worldMatrix, mScale);
		mat4.mul(worldMatrix, mTranslate, worldMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
		
		gl.clearColor(1.0, 1.0, 1.0, 0.0);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT,0);
		
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);

    
};

/*
function createOther(gl,program){
	var triangleVertices2 = 
	[ // X, Y,       R, G, B
		0.5, 1,    1.0, 0.0, 0.0,
		0, 0,  0.0, 1.0, 0.0,
		1, 0,   0.0, 0.0, 1.0
	];
	var triangleVertexBufferObject2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject2);
	//console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices2), gl.STATIC_DRAW);
	
   

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	 // lookup uniforms
	 var matrixLocationX = gl.getUniformLocation(program, "u_tx");
	 var matrixLocationY = gl.getUniformLocation(program, "u_ty");
	 gl.useProgram(program);
	//
	// Main render loop
	//
	//https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
	gl.uniform1f(matrixLocationX, -0.47);
	gl.uniform1f(matrixLocationY, -0.47);
	
	
	//https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
	//Usando as matrizes de transformação com uniform: https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html
    gl.drawArrays(gl.LINE_LOOP, 0, 3);
}

*/
var textarea_shader = document.getElementById("vertex-shader");
textarea_shader.addEventListener("input", InitDemo);

var textarea_fragment = document.getElementById("fragment-shader");
textarea_fragment.addEventListener("input", InitDemo);