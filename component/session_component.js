import ResolutionComponent from './resolution_component.js'
import CanvasComponent from './canvas_component.js'

const cache = []
class SessionComponent {
    constructor() {}
    init(dom) {
        this.resolutionComponent = ResolutionComponent.create()
        this.canvasComponent = CanvasComponent.create(dom)
        this.deltaTime = 16.66
        return this
    }
    update() {
        this.canvasComponent.update()
    }
    setTransformMatrix(matrix) {
        this.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f)
    }
    setTransform(a, b, c, d, e, f) {
        this.canvasComponent.setTransform(a, b, c, d, e, f)
    }
    setAlpha(alpha) {
        this.canvasComponent.setAlpha(alpha)
    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.canvasComponent.drawImage(texture, sx, sy, swidth, sheight, x, y, width, height)
        return this
    }
    draw(color, x, y, width, height) {
        if (!color) {
            return
        }
        this.canvasComponent.draw(color, x, y, width, height)
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        SessionComponent.collect(this)
    }
    static create(dom) {
        return (cache.length ? cache.pop() : new SessionComponent).init(dom)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default SessionComponent