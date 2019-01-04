import colorUtil from '../util/color.js'
const cache = []

const VSHADER_SOURCE = `
    attribute vec2 a_position;
    attribute vec2 a_tex_coord; // 接受纹理坐标
    varying vec2 v_tex_coord;   // 传递纹理坐标

    uniform vec2 u_texture_size; //图片尺寸
    uniform mat2 u_matrix;
    uniform vec2 u_translate;
    uniform vec2 u_resolution;

    void main() {
        //设置坐标
        // gl_Position = ((u_matrix * a_position + u_translate) / u_resolution * 2.0 - 1.0) * vec2(1, -1), 1))
        gl_Position = vec4(((u_matrix * a_position + u_translate) / u_resolution * 2.0 - 1.0) * vec2(1, -1), 0, 1); //vec4(matrix * vec3(a_position, 1), 1);  // 设置坐标
        v_tex_coord = a_tex_coord / u_texture_size;  // 设置纹理坐标
    }`

const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_image; // 取样器
    varying vec2 v_tex_coord; // 接受纹理坐标
    uniform float opacity;
    void main() {
       /*if (v_tex_coord.x < 0.0 ||
           v_tex_coord.y < 0.0 ||
           v_tex_coord.x > 1.0 ||
           v_tex_coord.y > 1.0) {
         discard;
       }*/
        gl_FragColor = texture2D(u_image, v_tex_coord) * opacity;// * opacity;//; // 设置颜色
    }`

const V_COLOR_SHADER_SOURCE = `
    attribute vec2 a_position;

    uniform mat2 u_matrix;
    uniform vec2 u_translate;
    uniform vec2 u_resolution;

    void main() {
        //设置坐标
        gl_Position = vec4(((u_matrix * a_position + u_translate) / u_resolution * 2.0 - 1.0) * vec2(1, -1), 0, 1);
    }`


const F_COLOR_SHADER_SOURCE = `
    precision mediump float;
    uniform vec4 color;
    void main() {
        gl_FragColor = color;
    }`

function compileShader(gl, source, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        window.console.log(gl.getShaderInfoLog(shader))
        return
    }

    return shader
}

function compileFragmentShader(gl, FSHADER_SOURCE) {
    return compileShader(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER)
}

function compileVertexShader(gl, VSHADER_SOURCE) {
    return compileShader(gl, VSHADER_SOURCE, gl.VERTEX_SHADER)
}

const textures = {}

function getTexture(gl, img) {
    const src = img.src
    let texture = textures[src]
    if (!texture) {
        texture = textures[src] = {
            width: img.width,
            height: img.height,
            texture: gl.createTexture()
        }
        gl.bindTexture(gl.TEXTURE_2D, texture.texture)

        // let's assume all images are not a power of 2
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    }
    return texture
}

function compileColorProgram(gl, V_COLOR_SHADER_SOURCE, F_COLOR_SHADER_SOURCE) {

    const vertexShader = compileVertexShader(gl, V_COLOR_SHADER_SOURCE)
    const fragmentShader = compileFragmentShader(gl, F_COLOR_SHADER_SOURCE)
    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        window.console.log("Could not initialise shaders")
    }

    return {
        program: program,

        position_buffer: gl.createBuffer(),
        location_attr_position: gl.getAttribLocation(program, 'a_position'),
        position_buffer_data: new Float32Array([
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0
        ]),

        location_uniform_matrix: gl.getUniformLocation(program, 'u_matrix'),
        location_uniform_translate: gl.getUniformLocation(program, 'u_translate'),

        location_uniform_resolution: gl.getUniformLocation(program, 'u_resolution'),
        location_uniform_color: gl.getUniformLocation(program, 'color')
    }
}

function compileTextureProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    const vertexShader = compileVertexShader(gl, VSHADER_SOURCE)
    const fragmentShader = compileFragmentShader(gl, FSHADER_SOURCE)
    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        window.console.log("Could not initialise shaders")
    }

    return {
        program: program,
        texture: gl.createTexture(),

        position_buffer: gl.createBuffer(),
        position_buffer_data: new Float32Array([
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0
        ]),
        location_attr_position: gl.getAttribLocation(program, 'a_position'),

        texture_coord_buffer: gl.createBuffer(),
        texture_coord_buffer_data: new Float32Array([
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0,
            0, 0
        ]),
        location_attr_text_coord: gl.getAttribLocation(program, 'a_tex_coord'),

        location_uniform_texture_size: gl.getUniformLocation(program, 'u_texture_size'),

        location_uniform_matrix: gl.getUniformLocation(program, 'u_matrix'),
        location_uniform_translate: gl.getUniformLocation(program, 'u_translate'),

        location_uniform_opacity: gl.getUniformLocation(program, 'opacity'),
        location_uniform_resolution: gl.getUniformLocation(program, 'u_resolution')
    }
}

function setTextureCoordBuffer(gl, program, x, y, width, height) {
    //处理纹理，从纹理中裁剪一部分用于绘制
    /*
    sx    可选。开始剪切的 x 坐标位置。
    sy    可选。开始剪切的 y 坐标位置。
    swidth    可选。被剪切图像的宽度。
    sheight    可选。被剪切图像的高度。
    */
    //1.enable
    gl.enableVertexAttribArray(program.location_attr_text_coord)

    //2.bindBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, program.texture_coord_buffer)

    const data = program.texture_coord_buffer_data
    data[0] = x
    data[1] = y
    data[2] = x + width
    data[3] = y
    data[4] = x
    data[5] = y + height
    data[6] = x + width
    data[7] = y
    data[8] = x
    data[9] = y + height
    data[10] = x + width
    data[11] = y + height

    //3.bufferData
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2 // 2 components per iteration
    const type = gl.FLOAT // the data is 32bit floats

    const normalize = false // don't normalize the data
    const step = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0 // start at the beginning of the position_buffernIndex就是指jsArrayData

    //4.vertexAttribPointer
    gl.vertexAttribPointer(
        program.location_attr_text_coord,
        size,
        type,
        normalize,
        step,
        offset
    )
}

function setPositionBuffer(gl, program, x, y, width, height) {
    //1.enable
    gl.enableVertexAttribArray(program.location_attr_position)

    //2.bindBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, program.position_buffer)

    const data = program.position_buffer_data
    data[0] = x
    data[1] = y
    data[2] = x + width
    data[3] = y
    data[4] = x
    data[5] = y + height
    data[6] = x + width
    data[7] = y
    data[8] = x
    data[9] = y + height
    data[10] = x + width
    data[11] = y + height

    //3.bufferData
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    //4.vertexAttribPointer
    //Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(
        program.location_attr_position,
        2, //size: 2 components per iteration
        gl.FLOAT, //type: the data is 32bit floats
        false, //normalize: don't normalize the data
        0, // 0 = move forward size * sizeof(type) each iteration to get the next position
        0 // start at the beginning of the position_buffer
    )
}

class WebglContextComponent {
    constructor() {}
    init(dom) {
        const gl = this.ctx = dom.getContext('webgl')
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.enable(gl.BLEND)
        this.textureProgram = compileTextureProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)
        this.colorProgram = compileColorProgram(gl, V_COLOR_SHADER_SOURCE, F_COLOR_SHADER_SOURCE)

        this.matrix = new Float32Array([1, 0, 0, 1])
        this.color = [0, 0, 0, 1]
        this.fillStyle = null
        this.translate = [0, 0]
        this.globalAlpha = 1
        this.width = 0
        this.height = 0
        this.textCanvas = null
        this.textCanvasCtx = null
        return this
    }
    clearRect(x, y, width, height) {}
    setTransform(a, b, c, d, e, f) {
        this.matrix[0] = a
        this.matrix[1] = b
        this.matrix[2] = c
        this.matrix[3] = d
        this.translate[0] = e
        this.translate[1] = f
    }
    setAlpha(alpha) {
        this.globalAlpha = alpha
        this.color[3] = alpha
    }
    setFillStyle(fillStyle) {
        this.fillStyle = fillStyle
        let color = colorUtil.get(fillStyle)
        this.color[0] = color[0]
        this.color[1] = color[1]
        this.color[2] = color[2]
        if (color.length == 4) {
            this.color[3] *= color[3]
        }
    }
    resize(width, height, scaleRatio) {
        this.width = width
        this.height = height

        this.ctx.viewport(0, 0, width, height)
    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height, forceReadTexture) {
        const gl = this.ctx
        const textureProgram = this.textureProgram
        gl.useProgram(textureProgram.program)
        const tex = getTexture(gl, texture)

        gl.uniformMatrix2fv(textureProgram.location_uniform_matrix, false, this.matrix)
        gl.uniform2f(textureProgram.location_uniform_translate, this.translate[0], this.translate[1])

        gl.uniform1f(textureProgram.location_uniform_opacity, this.globalAlpha)
        gl.uniform2f(textureProgram.location_uniform_resolution, this.width, this.height)
        gl.uniform2f(textureProgram.location_uniform_texture_size, tex.width, tex.height)

        setTextureCoordBuffer(gl, textureProgram, sx, sy, swidth, sheight)
        setPositionBuffer(gl, textureProgram, x, y, width, height)

        gl.bindTexture(gl.TEXTURE_2D, tex.texture)
        if (forceReadTexture) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture)
        }
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.drawImage(texture, sx, sy, swidth, sheight, x, y, width, height)
    }
    drawFontText(text, width, height) {
        let canvas = this.textCanvas
        if (!canvas) {
            canvas = document.createElement('canvas')
            this.textCanvasCtx = canvas.getContext('2d')
            canvas.src = 'TEXT_CANVAS'
            canvas.width = width
            canvas.height = height
        }
        const ctx = this.textCanvasCtx
        ctx.fillStyle = this.fillStyle
        ctx.font = text.font
        ctx.textAlign = text.textAlign
        ctx.textBaseline = text.textBaseline
        ctx.clearRect(0, 0, width, height)

        ctx.fillText(text.text, width >> 1, height >> 1)
        this.drawImage(canvas, 0, 0, width, height, 0, 0, width, height, text.isChanged)
    }
    setNodeId(id) {}
    fillRect(x, y, width, height) {
        const gl = this.ctx
        const colorProgram = this.colorProgram
        gl.useProgram(colorProgram.program)

        gl.uniformMatrix2fv(colorProgram.location_uniform_matrix, false, this.matrix)
        gl.uniform2f(colorProgram.location_uniform_translate, this.translate[0], this.translate[1])
        gl.uniform4f(colorProgram.location_uniform_color, this.color[0], this.color[1], this.color[2], this.color[3])

        gl.uniform2f(colorProgram.location_uniform_resolution, this.width, this.height)

        setPositionBuffer(gl, colorProgram, x, y, width, height)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    beginRender() {}
    endRender() {}
    remove() {
        this.ctx.deleteProgram(this.textureProgram)
        this.ctx.deleteProgram(this.colorProgram)

        this.ctx =
            this.textCanvas =
            this.textCanvasCtx =
            this.textureProgram =
            this.colorProgram =

            this.matrix =
            this.color =
            this.translate = null

        this._collect()
    }
    _collect() {
        this.constructor.collect(this)
    }
    static create(dom) {
        return (cache.length ? cache.pop() : new this).init(dom)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default WebglContextComponent