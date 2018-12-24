import DomEventComponent from './dom_event_component.js'
import ResolutionComponent from './resolution_component.js'
import debounce from '../common/debounce.js'

const cache = []
class CanvasComponent {
    constructor() {}
    init(dom) {
        if (!dom) {
            dom = document.createElement('canvas')
            dom.width = document.documentElement.scrollWidth
            dom.height = document.documentElement.scrollHeight
            dom.setAttribute('tabindex', '1')
            document.body.appendChild(dom)
            dom.focus()
        }
        this.host = dom
        this.ctx = dom.getContext('2d')

        this.resolutionComponent = ResolutionComponent.create()
        this.domEventComponent = DomEventComponent.create(dom, this)
        this.resizeHandler = debounce(this.onResize.bind(this), 100)
        this.resizeListen()
        return this
    }
    onResize() {
        const scaleRatio = window.devicePixelRatio
        console.log('resize', scaleRatio)

        let fullWidth = window.innerWidth //document.documentElement.scrollWidth
        let fullHeight = window.innerHeight //document.documentElement.scrollHeight

        // console.log(fullWidth, fullHeight)
        this.host.style.width = fullWidth + 'px'
        this.host.style.height = fullHeight + 'px'
        fullWidth *= scaleRatio
        fullHeight *= scaleRatio
        fullWidth |= 0
        fullHeight |= 0
        this.host.width = fullWidth
        this.host.height = fullHeight

        this.resolutionComponent.resize(fullWidth, fullHeight, scaleRatio)
    }
    resizeListen() {
        window.addEventListener('resize', this.resizeHandler)
    }
    update() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.clearRect(0, 0, this.host.width, this.host.height)
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
        window.removeEventListener('resize', this.resizeHandler)

        this.host =
            this.dom =
            this.ctx =
            this.domEventComponent =
            this.resizeHandler = null
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