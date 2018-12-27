const cache = []
class InteractComponent {
    constructor() {}
    init(host) {
        this.host = host
        this.interactMask = 0
        this.inputId = -1
        this.keyCode = 0
        this.acceptAll()
        return this
    }
    acceptAll() {
        this.interactMask |= 7
    }
    acceptTouch() {
        this.interactMask |= 1
    }
    acceptKeyboard() {
        this.interactMask |= 2
    }
    acceptMouse() {
        this.interactMask |= 4
    }
    removeTouch() {
        this.interactMask &= ~1
    }
    removeKeyboard() {
        this.interactMask &= ~2
    }
    removeMouse() {
        this.interactMask &= ~4
    }
    handle(session) {
        if (this.handleTouches(session.getTouchEvents()) ||
            this.handleKeyboardEvents(session.getKeyboardEvents()) ||
            this.handleMouseEvent(session.getMouseEvent())
        ) {
            session.commandInputComponent.addInput(this.inputId)
        }
    }
    handleTouches(touchEvents) {
        if (!(this.interactMask & 1) || !touchEvents || !touchEvents.length) {
            return false
        }
        const spaceComponent = this.host.spaceComponent
        for (let i = touchEvents.length - 1; i >= 0; i--) {
            const event = touchEvents[i]

            if (event) {
                if (spaceComponent.contains(event.x, event.y)) {
                    return true
                }
            }
        }
    }
    handleKeyboardEvents(keyEvents) {
        if (!(this.interactMask & 2) || !keyEvents) {
            return false
        }
        if (keyEvents[this.keyCode]) {
            return true
        }
    }
    handleMouseEvent(mouseEvent) {
        if (!(this.interactMask & 4) || !mouseEvent) {
            return false
        }
        if (this.host.spaceComponent.contains(mouseEvent.x, mouseEvent.y)) {
            return true
        }
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        InteractComponent.collect(this)
    }
    static create(host, session) {
        return (cache.length ? cache.pop() : new InteractComponent).init(host, session)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default InteractComponent