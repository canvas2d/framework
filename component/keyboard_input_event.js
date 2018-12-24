import KeyEvent from '../common/key_event.js'

const keyEventTypes = [
    'keydown',
    'keypress',
    'keyup'
]

const passive = {
    passive: true
}

const cache = []

class KeyBoardInputComponent {
    constructor() {}
    init(host, session) {
        this.host = host
        this.session = session
        this.keyEvents = {}
        this.handler = this.eventHandler.bind(this)
        return this
    }
    listen() {
        this.stopListen()
        keyEventTypes.forEach((type) => {
            this.host.addEventListener(type, this.handler, passive)
        })
    }
    stopListen() {
        keyEventTypes.forEach((type) => {
            this.host.removeEventListener(type, this.handler, passive)
        })
    }
    addKeys(keys) {
        const keyEvents = this.keyEvents
        keys.forEach(function(key) {
            keyEvents[key] = null
        })
    }
    eventHandler(e) {
        const session = this.session
        const keyEvents = this.keyEvents
        const code = e.which || e.keyCode
        if (keyEvents[code] === undefined) {
            return
        }
        const type = e.type
        switch (type) {
            case 'keydown':
                if (!keyEvents[code]) {
                    keyEvents[code] = KeyEvent.create(code, e.type)
                }
                break
            case 'keyup':
                if (keyEvents[code]) {
                    keyEvents[code].remove()
                    keyEvents[code] = null
                }
                break
            case 'keypress':
                break
        }
    }
    _collect() {
        KeyBoardInputComponent.collect(this)
    }
    static create(host, session) {
        return (cache.length ? cache.pop() : new KeyBoardInputComponent).init(host, session)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default KeyBoardInputComponent