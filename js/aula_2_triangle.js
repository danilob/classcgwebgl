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

	gl.clearColor(1.0, 1.0, 1.0, 0.0);
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

	//
	// Create buffer
	//
	var triangleVertices = 
	[ // X,   Y,   Z,       R,   G,   B
		0.0,  0.5, 0.0,   1.0, 0.0, 0.0,
	   -0.5, -0.5, 0.0,   0.0, 1.0, 0.0,
		0.5, -0.5, 0.0,   0.0, 0.0, 1.0
	];


	//https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
	


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
	var identity = new Float32Array(16);
	var mat4 = glMatrix.mat4;
	mat4.identity(worldMatrix);
	mat4.identity(viewMatrix);
	mat4.identity(projMatrix);
	mat4.identity(identity);

	//mat4.scale(worldMatrix,identity,[2.0,0.5,1.0]);
	mat4.lookAt(viewMatrix,[0,0,-2],[0,0,0],[0,1,0]);
	mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(90),canvas.height/canvas.width,0.1,1000);

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

	//gl.drawArrays(gl.TRIANGLES, 0, 3);

	//https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
	//Usando as matrizes de transformação com uniform: https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html
    //gl.drawArrays(gl.TRIANGLES, 0, 3);
	//createOther(gl,program);
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function(){
		angle = performance.now() / 1000/ 60 * 2 * Math.PI;
		mat4.rotate(worldMatrix,identityMatrix, angle,[0,1,0]);
		gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
		
		gl.clearColor(1.0, 1.0, 1.0, 0.0);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		
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