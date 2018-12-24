const cache = []
class InteractComonent {
    constructor() {}
    init(host) {
        this.host = host
        this.interactive = true
        this.inputId = -1
        this.keyCode = 0
        return this
    }
    handle(session) {
        if (!this.interactive) {
            return
        }
        if (this.handleTouches(session.getTouchEvents()) ||
            this.handleKeyboardEvents(session.getKeyboardEvents()) ||
            this.handleMouseEvent(session.getMouseEvent())
        ) {
            session.commandInputComponent.addInput(this.inputId)
        }
    }
    handleTouches(touchEvents) {
        if (!touchEvents || !this.interactive || !touchEvents.length) {
            return false
        }
        const frame = this.host.spaceComponent.frame
        for (let i = touchEvents.length - 1; i >= 0; i--) {
            const event = touchEvents[i]

            if (event) {
                const x = event.x
                const y = event.y

                if (frame.contains(x, y)) {
                    return true
                }
            }
        }
    }
    handleKeyboardEvents(keyEvents) {
        if (!keyEvents || !this.interactive) {
            return false
        }
        if (keyEvents[this.keyCode]) {
            return true
        }
    }
    handleMouseEvent(mouseEvent) {
        if (!mouseEvent || !this.interactive) {
            return false
        }
        if (this.host.spaceComponent.frame.contains(mouseEvent.x, mouseEvent.y)) {
            return true
        }
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        InteractComonent.collect(this)
    }
    static create(host, session) {
        return (cache.length ? cache.pop() : new InteractComonent).init(host, session)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default InteractComonent