const cache = []
class HeroCollision {
    constructor() {}
    remove() {
        this._collect()
    }
    _collect() {
        this.constructor.collect(this)
    }
    static create(host) {
        return (cache.length ? cache.pop() : new this).init(host)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default HeroCollision