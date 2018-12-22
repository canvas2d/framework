const cache = []
class ResolutionComponent {
    constructor() {}
    init() {
        return this
    }
    remove() {
        this._collect()
    }
    _collect() {}
    static create() {
        return (cache.length ? cache.pop() : new ResolutionComponent).init()
    }
    static collect(item) {
        cache.push(item)
    }
}
export default ResolutionComponent