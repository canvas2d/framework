const cache = []
class MouseEvent {
    constructor() {}
    init(x, y, type) {
        this.x = x
        this.y = y
        this.type = type
        return this
    }
    remove() {
        this._collect()
    }
    _collect() {
        MouseEvent.collect(this)
    }
    static create(x, y, type) {
        return (cache.length ? cache.pop() : new MouseEvent).init(x, y, type)
    }
    static collect(e) {
        cache.push(e)
    }
}

export default MouseEvent