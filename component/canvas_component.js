import DomEventComponent from './dom_event_component.js'

const cache = []
class CanvasComponent {
    constructor() {}
    init(dom) {
        if (!dom) {
            dom = document.createElement('canvas')
            dom.width = document.documentElement.scrollWidth
            dom.height = document.documentElement.scrollHeight
            document.body.appendChild(dom)
        }
        this.host = dom
        this.ctx = dom.getContext('2d')
        this.domEventComponent = DomEventComponent.create(dom, this)
        return this
    }
    setTransform(a, b, c, d, e, f) {
        this.ctx.setTransform(a, b, c, d, e, f)
    }
    setAlpha(alpha) {
        this.ctx.globalAlpha = alpha
    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.ctx.drawImage(texture, sx, sy, swidth, sheight, x, y, width, height)
    }
    draw(color, x, y, width, height) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, width, height)
    }
    remove() {
        this.domEventComponent.remove()
        this.host =
            this.dom =
            this.ctx =
            this.domEventComponent = null
        this._collect()
    }
    _collect() {
        CanvasComponent.collect(this)
    }
    static create(dom) {
        return (cache.length ? cache.pop() : new CanvasComponent).init(dom)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default CanvasComponent