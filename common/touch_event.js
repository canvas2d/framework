const cache = []
class TouchEvent {
    constructor() {}
    init(x, y, type, identifier) {
        this.x = x
        this.y = y
        this.identifier = identifier
        this.type = type
        return this
    }
    remove() {
        this._collect()
    }
    _collect() {
        TouchEvent.collect(this)
    }
    static create(x, y, type, identifier) {
        return (cache.length ? cache.pop() : new TouchEvent).init(x, y, type, identifier)
    }
    static collect(e) {
        cache.push(e)
    }
}

export default TouchEvent