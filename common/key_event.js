const cache = []
class KeyEvent {
    constructor() {}
    init(code, type) {
        this.code = code
        this.type = type
        return this
    }
    remove() {
        this.code = null
        this.type = null
        this._collect()
    }
    _collect() {
        KeyEvent.collect(this)
    }
    static create(code, type) {
        return (cache.length ? cache.pop() : new KeyEvent).init(code, type)
    }
    static collect(e) {
        cache.push(e)
    }
}

export default KeyEvent