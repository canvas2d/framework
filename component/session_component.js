import CanvasComponent from './canvas_component.js'
import DomEventComponent from './dom_event_component.js'
import CommandInputComponent from './command_input_component.js'

const cache = []
class SessionComponent {
    constructor() {}
    init(dom, renderType) {
        this.canvasComponent = CanvasComponent.create(dom, renderType)
        this.domEventComponent = DomEventComponent.create(this.canvasComponent.host, this)
        this.commandInputComponent = CommandInputComponent.create(this)
        this.deltaTime = 16.66
        return this
    }
    getCommandInput(inputId) {
        return this.commandInputComponent.getInput(inputId)
    }
    getDisplayInfo() {
        return this.canvasComponent.resolutionComponent.display
    }
    getDesignInfo() {
        return this.canvasComponent.resolutionComponent.design
    }
    getScaleRatio() {
        return this.getDisplayInfo().scaleRatio
    }
    getTransform() {
        return this.getDisplayInfo().baseTransform
    }
    getTouchEvents() {
        return this.domEventComponent.touchComponent && this.domEventComponent.touchComponent.touchEvents
    }
    getKeyboardEvents() {
        return this.domEventComponent.keyboardComponent && this.domEventComponent.keyboardComponent.keyEvents
    }
    getMouseEvent() {
        return this.domEventComponent.mouseComponent && this.domEventComponent.mouseComponent.mouseEvent
    }
    setDesignSize(width, height, maxWidth, maxHeight) {
        const resolution = this.canvasComponent.resolutionComponent
        const design = resolution.design
        design.width = width
        design.height = height
        design.maxWidth = maxWidth
        design.maxHeight = maxHeight
        this.canvasComponent.onResize()
    }
    update() {
        this.canvasComponent.update()
    }
    transform(matrix) {
        const display = this.getDisplayInfo()
        display._baseTransformI.transformMatrixTo(matrix, matrix)
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
    setNodeId(id) {
        this.canvasComponent.setNodeId(id)
    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.canvasComponent.drawImage(texture, sx, sy, swidth, sheight, x, y, width, height)
        return this
    }
    drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.canvasComponent.drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height)
        return this
    }
    beginRender() {
        this.canvasComponent.beginRender()
    }
    endRender() {
        this.canvasComponent.endRender()
    }
    draw(color, x, y, width, height) {
        if (!color) {
            return
        }
        this.canvasComponent.draw(color, x, y, width, height)
    }
    remove() {
        this.canvasComponent.remove()
        this.domEventComponent.remove()
        this.commandInputComponent.remove()
        this.commandInputComponent =
            this.canvasComponent =
            this.domEventComponent = null
        this._collect()
    }
    _collect() {
        SessionComponent.collect(this)
    }
    static create(dom, renderType) {
        return (cache.length ? cache.pop() : new SessionComponent).init(dom, renderType)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default SessionComponent