/*
 * File: texture_shader.js
 *
 * wrapps over GLSL texture shader, supporting the working with the entire file texture
 * 
 */
"use strict";

import * as glSys from "../core/gl.js";
import * as vertexBuffer from "../core/vertex_buffer.js";
import  SimpleShader from "./simple_shader.js";

class TextureShader extends SimpleShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        // reference to aTextureCoordinate within the shader
        this.mTextureCoordinateRef = null;

        this.mCurrentTransparency = 1.0;

        // get the reference of aTextureCoordinate within the shader
        let gl = glSys.get();
        this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
        this.mSamplerRef =  gl.getUniformLocation(this.mCompiledShader, "uSampler");
        this.mTransparencyFactorRef = gl.getUniformLocation(this.mCompiledShader, "uTransparency");
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: enable texture coordinate array
        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        gl.vertexAttribPointer(this.mTextureCoordinateRef, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef);        

        // bind uSampler to texture 0
        gl.uniform1i(this.mSamplerRef, 0);  // texture.activateTexture() binds to Texture0

        // Set the tranparency factor
        gl.uniform1f(this.mTransparencyFactorRef, this.mCurrentTransparency);
    }

    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }

    setTransparency(factor) {
        if (factor <= 1.0 && factor >= 0.0) {
            this.mCurrentTransparency = factor;
        }
    }

    getTransparency() {
        return this.mCurrentTransparency;
    }
}

export default TextureShader;