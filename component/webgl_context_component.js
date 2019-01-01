//TODO: add webgl support
const cache = []
class WebglContextComponent {
    constructor() {}
    init(dom) {
        return this
    }
    clearRect(x, y, width, height) {}
    setTransform(a, b, c, d, e, f) {}
    setAlpha(alpha) {}
    setFillStyle(fillStyle) {}
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {}
    drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height) {}
    setNodeId(id) {}
    fillRect(x, y, width, height) {}
    beginRender() {}
    endRender() {}
    remove() {
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