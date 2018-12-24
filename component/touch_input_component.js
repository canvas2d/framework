import TouchEvent from '../common/touch_event.js'
const inEjecta = typeof ejecta != 'undefined'

const touchEventTypes = [
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel'
]

const passive = {
    passive: true
}

const cache = []

class TouchInputComponent {
    constructor() {}
    init(host, session) {
        this.host = host
        this.session = session
        this.touchEvents = []
        this.touchIdentifiers = {}
        this.handler = this.eventHandler.bind(this)
        return this
    }
    listen() {
        this.stopListen()
        touchEventTypes.forEach((type) => {
            this.host.addEventListener(type, this.handler, passive)
        })
    }
    stopListen() {
        touchEventTypes.forEach((type) => {
            this.host.removeEventListener(type, this.handler, passive)
        })
    }
    eventHandler(e) {
        const session = this.session
        const touchEvents = this.touchEvents
        const touchIdentifiers = this.touchIdentifiers
        const scaleRatio = session.getScaleRatio()
        const matrix = session.getTransform()
        for (let i = 0, j = e.changedTouches.length; i < j; i++) {
            const touch = e.changedTouches[i]
            const identifier = touch.identifier
            const touchEvent = TouchEvent.create(
                matrix.a * touch.clientX * scaleRatio + matrix.e,
                matrix.d * touch.clientY * scaleRatio + matrix.f,
                e.type,
                identifier
            )
            // console.log(e.type, touchEvent.x, touchEvent.y)
            switch (e.type) {
                case 'touchstart':
                    // console.log('set identifier touchstart')
                    touchIdentifiers[identifier] = touchEvent
                    const totalEvents = touchEvents.length
                    let i = 0
                    while (i < totalEvents) {
                        if (touchEvents[i] == null) {
                            touchEvents[i] = touchEvent
                            break
                        }
                        i++
                    }
                    if (i == totalEvents) {
                        touchEvents.push(touchEvent)
                    }
                    break
                case 'touchmove':
                    if (touchIdentifiers[identifier]) {
                        const index = touchEvents.indexOf(touchIdentifiers[identifier])
                        if (index > -1) {
                            touchEvents[index].remove()
                            touchEvents[index] = touchEvent
                        }
                        // console.log('set identifier touchmove')
                        touchIdentifiers[identifier] = touchEvent
                    }
                    break
                case 'touchend':
                case 'touchcancel':
                    if (touchIdentifiers[identifier]) {
                        const index = touchEvents.indexOf(touchIdentifiers[identifier])
                        if (index > -1) {
                            touchEvents[index].remove()
                            touchEvents[index] = null
                        }
                        this.removeIdentifier(identifier)
                    }
                    break
                default:
                    break
            }
        }

        let allEmpty = true
        for (let total = touchEvents.length - 1; total >= 0; total--) {
            if (touchEvents[total]) {
                allEmpty = false
                break
            }
        }
        if (allEmpty) {
            touchEvents.length = 0
        }
    }
    removeIdentifier(identifier) {
        if (inEjecta) {
            delete this.touchIdentifiers[identifier]
        } else {
            this.touchIdentifiers[identifier] = null
        }
    }
    remove() {
        this.host =
            this.session =
            this.handler = null
        this._collect()
    }
    _collect() {
        TouchInputComponent.collect(this)
    }
    static create(host, session) {
        return (cache.length ? cache.pop() : new TouchInputComponent).init(host, session)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default TouchInputComponent