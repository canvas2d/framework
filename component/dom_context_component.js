import Matrix from '../common/matrix.js'
import DomTileRender from './dom_tile_render.js'
import DomTextureRender from './dom_texture_render.js'

const cache = []

class Context2d {
    constructor() {}
    init(dom) {
        this.dom = dom
        this._matrix = Matrix.create(1, 0, 0, 1, 0, 0)
        this.globalAlpha = 1

        this.fillStyle = 'rgba(0,0,0,1)'
        this.zIndex = 0

        this.tileRender = DomTileRender.create()
        this.textureRender = DomTextureRender.create()
        this.currentNodeId = 0
        return this
    }
    resize() {}
    beginRender() {
        this.textureRender.beginRender()
        this.tileRender.beginRender()
    }
    endRender() {
        this.textureRender.endRender()
        this.tileRender.endRender()
    }
    setFillStyle(fillStyle) {
        this.fillStyle = fillStyle
    }
    clearRect(x, y, width, height) {}
    setTransform(a, b, c, d, e, f) {
        this._matrix.update(a, b, c, d, e, f)
    }
    setAlpha(alpha) {
        this.globalAlpha = alpha
    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        const divs = this.textureRender.getDom(this.dom, this.currentNodeId)
        const div = divs[0]
        const child = divs[1]
        div.style.transformOrigin = 'left top'
        div.style.transform = this._matrix.toString()
        div.style.width = width + 'px'
        div.style.height = height + 'px'
        div.style.position = 'absolute'
        div.style.top = y + 'px'
        div.style.left = x + 'px'
        div.style.opacity = this.globalAlpha
        div.style.zIndex = ++this.zIndex

        child.style.width = swidth + 'px'
        child.style.height = sheight + 'px'
        child.style.backgroundImage = 'url(' + texture.src + ')'
        child.style.backgroundColor = ''
        child.style.backgroundPosition = '-' + sx + 'px -' + sy + 'px'
        child.style.backgroundRepeat = 'no-repeat'
        child.style.transform = 'scale(' + width / swidth + ',' + height / sheight + ')'
        child.style.transformOrigin = 'top left'
    }
    drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.tileRender.drawContainer(this.dom, this._matrix, this.globalAlpha)
        const divs = this.tileRender.getDom(x, y)

        const div = divs[0]
        const child = divs[1]

        div.style.transformOrigin = 'left top'
        div.style.transform = 'translate(' + x + 'px,' + y + 'px)'
        div.style.width = width + 'px'
        div.style.height = height + 'px'
        div.style.position = 'absolute'
        div.style.opacity = this.globalAlpha
        div.style.zIndex = ++this.zIndex

        child.style.width = swidth + 'px'
        child.style.height = sheight + 'px'
        child.style.backgroundImage = 'url(' + texture.src + ')'
        child.style.backgroundColor = ''
        child.style.backgroundPosition = '-' + sx + 'px -' + sy + 'px'
        child.style.backgroundRepeat = 'no-repeat'
        child.style.transform = 'scale(' + width / swidth + ',' + height / sheight + ')'
        child.style.transformOrigin = 'top left'

        div.style.display = 'block'
    }
    setNodeId(id) {
        this.currentNodeId = id
    }
    fillRect(x, y, width, height) {
        const divs = this.textureRender.getDom(this.dom, this.currentNodeId)
        const div = divs[0]
        const child = divs[1]
        div.style.transformOrigin = 'top left'
        div.style.transform = this._matrix.toString()
        div.style.width = width + 'px'
        div.style.height = height + 'px'
        div.style.position = 'absolute'
        div.style.top = y + 'px'
        div.style.left = x + 'px'
        div.style.backgroundColor = this.fillStyle
        div.style.backgroundImage = ''
        div.style.zIndex = ++this.zIndex
        div.style.opacity = this.globalAlpha
    }
    beginRender() {
        this.tileRender.beginRender()
        this.textureRender.beginRender()
        this.zIndex = 0
    }
    endRender() {
        this.tileRender.endRender()
        this.textureRender.endRender()
    }
    remove() {
        this._matrix.remove()
        this.tileRender.remove()
        this.textureRender.remove()
        this._matrix =
            this.tileRender =
            this.textureRender =
            this.dom = null

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
export default Context2d