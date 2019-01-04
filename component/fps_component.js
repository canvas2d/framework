import Node from '../node.js'
import FontText from '../common/font_text.js'

const cache = []
class FPSComponent {
    constructor() {}
    init() {
        this.currentTime = Date.now()
        this.frameNumber = 60
        this.frameCount = 0

        this.fpsNode = Node.create()

        this.fpsNode.graphicsComponent.width =
            this.fpsNode.spaceComponent.width = 400
        this.fpsNode.graphicsComponent.height =
            this.fpsNode.spaceComponent.height = 100

        const fpsText = FontText.create()
        fpsText.textAlign = 'right' //left center right
        fpsText.textBaseline = "bottom" //top, middle, bottom

        this.fpsNode.graphicsComponent.fontText = fpsText

        return this
    }
    render(session, renderType) {
        if (++this.frameCount == 60) {
            const now = Date.now()
            this.frameNumber = (60000 / (now - this.currentTime)).toFixed(1)
            this.frameCount = 0
            this.currentTime = now
        }

        this.fpsNode.graphicsComponent.color = 'red'

        const text = this.fpsNode.graphicsComponent.fontText
        text.setText(this.frameNumber + renderType)
        text.setFont('32px Arail')
        this.fpsNode.render(session)
    }
    remove() {
        this.fpsText.remove()
        this.fpsNode.remove()
        this.fpsNode =
            this.fpsText = null
        this._collect()
    }
    _collect() {
        this.constructor.collect(this)
    }
    static create() {
        return (cache.length ? cache.pop() : new this).init()
    }
    static collect(item) {
        cache.push(item)
    }
}
export default FPSComponent