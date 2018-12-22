const cache = []
class SessionComponent {
    constructor() {}
    init() {
        return this
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        SessionComponent.collect(this)
    }
    static create() {
        return (cache.length ? cache.pop() : new SessionComponent).init()
    }
    static collect(item) {
        cache.push(item)
    }
}
export default SessionComponent