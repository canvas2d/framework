import DomEventComponent from './dom_event_component.js'

const cache = []
class CanvasComponent {
    constructor() {}
    init(dom) {
        this.host = dom
        this.domEventComponent = DomEventComponent.create(dom, this)
        return this
    }
    setTransform(a, b, c, d, e, f) {

    }
    setAlpha(alpha) {

    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {

    }
    draw(color, x, y, width, height) {

    }
    remove() {
        this.host = null
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