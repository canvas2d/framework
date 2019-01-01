const cache = []
class CanvasContextComponent {
    constructor() {}
    init(dom) {
        this.ctx = dom.getContext('2d')
        return this
    }
    clearRect(x, y, width, height) {
        this.ctx.clearRect(x, y, width, height)
    }
    setTransform(a, b, c, d, e, f) {
        this.ctx.setTransform(a, b, c, d, e, f)
    }
    setAlpha(alpha) {
        this.ctx.globalAlpha = alpha
    }
    setFillStyle(fillStyle) {
        this.ctx.fillStyle = fillStyle
    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.ctx.drawImage(texture, sx, sy, swidth, sheight, x, y, width, height)
    }
    drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.drawImage(texture, sx, sy, swidth, sheight, x, y, width, height)
    }
    setNodeId(id) {}
    fillRect(x, y, width, height) {
        this.ctx.fillRect(x, y, width, height)
    }
    beginRender() {}
    endRender() {}
    remove() {
        this.ctx = null
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
export default CanvasContextComponent