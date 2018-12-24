import MouseEvent from '../common/mouse_event.js'

const mouseEventTypes = [
    'mousedown',
    'mousemove',
    'mouseup',
    'mouseleave'
]

const passive = {
    passive: true
}

const cache = []

class MouseInputComponent {
    constructor() {}
    init(host, session) {
        this.host = host
        this.session = session
        this.mouseEvent = null
        this.handler = this.eventHandler.bind(this)
        return this
    }
    listen() {
        this.stopListen()
        mouseEventTypes.forEach((type) => {
            this.host.addEventListener(type, this.handler, passive)
        })
    }
    stopListen() {
        mouseEventTypes.forEach((type) => {
            this.host.removeEventListener(type, this.handler, passive)
        })
    }
    eventHandler(e) {
        const session = this.session
        const scaleRatio = session.getScaleRatio()
        const matrix = session.getTransform()
        this.mouseEvent && this.mouseEvent.remove()
        switch (e.type) {
            case 'mouseup':
                this.mouseEvent = null
                break
            case 'mousedown':
                this.mouseEvent = MouseEvent.create(
                    matrix.a * e.clientX * scaleRatio + matrix.e,
                    matrix.d * e.clientY * scaleRatio + matrix.f,
                    e.type
                )
                break
            case 'mousemove':
                if (this.mouseEvent) {
                    this.mouseEvent = MouseEvent.create(
                        matrix.a * e.clientX * scaleRatio + matrix.e,
                        matrix.d * e.clientY * scaleRatio + matrix.f,
                        e.type
                    )
                }
                break
        }
    }
    remove() {
        this.mouseEvent && this.mouseEvent.remove()
        this.host =
            this.session =
            this.handler =
            this.mouseEvent = null
        this._collect()
    }
    _collect() {
        MouseInputComponent.collect(this)
    }
    static create(host, session) {
        return (cache.length ? cache.pop() : new MouseInputComponent).init(host, session)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default MouseInputComponent