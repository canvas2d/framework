import TouchInputComponent from './touch_input_component.js'
import KeyBoardInputComponent from './keyboard_input_component.js'
import MouseInputComponent from './mouse_input_component.js'

const cache = []
class DomEventComponent {
    constructor() {}
    init(dom, session) {
        this.host = dom
        this.session = session
        this.touchComponent = null
        this.keyboardComponent = null
        this.mouseComponent = null
        return this
    }
    addTouchInputSupport() {
        this.touchComponent = TouchInputComponent.create(this.host, this.session)
        this.touchComponent.listen()
    }
    addMouseInputSupport() {
        this.mouseComponent = MouseInputComponent.create(this.host, this.session)
        this.mouseComponent.listen()
    }
    addKeyboardInputSupport() {
        this.keyboardComponent = KeyBoardInputComponent.create(this.host, this.session)
        this.keyboardComponent.listen()
    }
    listenToKeyCodes(keys) {
        this.keyboardComponent.addKeys(keys)
    }
    stopListenMouseEvents() {
        this.mouseComponent.stopListen()
        return this
    }
    stopListenTouchEvents() {
        this.touchComponent.stopListen()
        return this
    }
    stopListenKeyEvents() {
        this.keyboardComponent.stopListen()
        return this
    }
    remove() {
        this.touchComponent && this.touchComponent.remove()
        this.keyboardComponent && this.keyboardComponent.remove()
        this.mouseComponent && this.mouseComponent.remove()
        this.touchComponent =
            this.keyboardComponent =
            this.mouseComponent =
            this.host = null
        this._collect()
    }
    _collect() {
        DomEventComponent.collect(this)
    }
    static create(dom, session) {
        return (cache.length ? cache.pop() : new DomEventComponent).init(dom, session)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default DomEventComponent