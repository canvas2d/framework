const cache = []
class DomEventComponent {
    constructor() {}
    init(dom) {
        this.host = dom
        return this
    }
    remove() {
        this._collect()
    }
    _collect() {
        DomEventComponent.collect(this)
    }
    static create(dom) {
        return (cache.length ? cache.pop() : new DomEventComponent).init(dom)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default DomEventComponent