import DomEventComponent from './dom_event_component.js'
import ResolutionComponent from './resolution_component.js'
import DomContextComponent from './dom_context_component.js'
import CanvasContextComponent from './canvas_context_component.js'
import WebglContextComponent from './webgl_context_component.js'
import FPSComponent from './fps_component.js'
import FontText from '../common/font_text.js'
import Node from '../node.js'
import debounce from '../common/debounce.js'

const cache = []
class CanvasComponent {
    constructor() {}
    init(dom, type) {
        this.host = dom
        this.type = -1
        this.renderType = null
        this.ctx = null

        this.resolutionComponent = ResolutionComponent.create()
        this.fpsComponent = FPSComponent.create()
        this.fpsNode = Node.create()

        this.fpsNode.graphicsComponent.width =
            this.fpsNode.spaceComponent.width = 400
        this.fpsNode.graphicsComponent.height =
            this.fpsNode.spaceComponent.height = 100

        const fpsText = FontText.create()
        fpsText.textAlign = 'right' //left center right
        fpsText.textBaseline = "bottom" //top, middle, bottom
        
        this.fpsNode.graphicsComponent.fontText = fpsText

        this.domEventComponent = null
        this.resizeHandler = debounce(this.onResize.bind(this), 100)
        this.resizeListen()
        this.setRenderType(type)
        return this
    }
    setRenderType(type) {
        type = type | 0
        if (this.type == type) {
            return
        }
        switch (type) {
            case 1:
            case 2:
                this.ctx && this.ctx.remove()
                break
        }
        if (this.host) {
            this.host.parentNode.removeChild(this.host)
        }
        this.type = type
        switch (type) {
            case 0:
                this.renderType = ' canvas'
                break
            case 1:
                this.renderType = ' dom'
                break
            case 2:
                this.renderType = ' webgl'
                break
        }
        if (!this.host) {
            this.host = document.createElement(type == 1 ? 'div' : 'canvas')
            document.body.appendChild(this.host)
        }
        const dom = this.host
        dom.width = document.documentElement.scrollWidth
        dom.height = document.documentElement.scrollHeight
        dom.setAttribute('tabindex', '1')
        dom.focus()
        switch (type) {
            case 0:
                this.ctx = CanvasContextComponent.create(dom)
                break
            case 1:
                this.ctx = DomContextComponent.create(dom)
                break
            case 2:
                this.ctx = WebglContextComponent.create(dom)
                break
        }
        if (this.domEventComponent) {
            this.domEventComponent.remove()
        }
        this.domEventComponent = DomEventComponent.create(dom, this)
    }
    onResize() {
        const scaleRatio = window.devicePixelRatio
        console.log('resize', scaleRatio)

        let fullWidth = window.innerWidth //document.documentElement.scrollWidth
        let fullHeight = window.innerHeight //document.documentElement.scrollHeight

        // console.log(fullWidth, fullHeight)
        if (this.type != 1) {
            this.host.style.width = fullWidth + 'px'
            this.host.style.height = fullHeight + 'px'
            fullWidth *= scaleRatio
            fullHeight *= scaleRatio
            fullWidth |= 0
            fullHeight |= 0
            this.host.width = fullWidth
            this.host.height = fullHeight
        } else {

            fullWidth *= scaleRatio
            fullHeight *= scaleRatio
            fullWidth |= 0
            fullHeight |= 0
            this.host.style.width = fullWidth + 'px'
            this.host.style.height = fullHeight + 'px'
            this.host.style.transform = 'scale(' + 1 / scaleRatio + ',' + 1 / scaleRatio + ')'
            this.host.style.transformOrigin = 'top left'
        }
        this.resolutionComponent.resize(fullWidth, fullHeight, scaleRatio)
        this.ctx.resize(fullWidth, fullHeight, scaleRatio)
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
        this.ctx.setAlpha(alpha)
    }
    drawImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.ctx.drawImage(texture, sx, sy, swidth, sheight, x, y, width, height)
    }
    drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height) {
        this.ctx.drawTileImage(texture, sx, sy, swidth, sheight, x, y, width, height)
    }
    setNodeId(id) {
        this.ctx.setNodeId(id)
    }
    beginRender(session) {
        this.ctx.beginRender(session)
    }
    endRender(session) {
        this.renderFPS(session)
        this.ctx.endRender(session)
    }
    renderFPS(session) {
        this.fpsComponent.update()
        this.fpsNode.graphicsComponent.color = 'red'

        const text = this.fpsNode.graphicsComponent.fontText
        text.setText(this.fpsComponent.frameNumber + this.renderType)
        text.setFont('32px Arail')
        this.fpsNode.render(session)
    }
    drawFontText(color, fontText, width, height) {
        this.ctx.setFillStyle(color)
        this.ctx.drawFontText(fontText, width, height)
    }
    draw(color, x, y, width, height) {
        this.ctx.setFillStyle(color)
        this.ctx.fillRect(x, y, width, height)
    }
    remove() {
        this.ctx && this.ctx.remove()
        this.domEventComponent && this.domEventComponent.remove()
        this.fpsComponent.remove()
        this.fpsText.remove()
        this.fpsNode.remove()
        window.removeEventListener('resize', this.resizeHandler)
        this.host =
            this.dom =
            this.ctx =
            this.domEventComponent =
            this.fpsComponent =
            this.fpsNode =
            this.fpsText =
            this.resizeHandler =
            this.session = null
        this._collect()
    }
    _collect() {
        CanvasComponent.collect(this)
    }
    static create(dom, type) {
        return (cache.length ? cache.pop() : new this).init(dom, type)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default CanvasComponent