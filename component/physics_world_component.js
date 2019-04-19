const cache = []
class PhysicsWorldComponent {
    constructor() {}
    update() {}
    resolve() {}
    remove() {
        this.constructor.collect(this)
    }
    static create() {
        return cache.length ? cache.pop() : new this
    }
    static collect(item) {
        cache.push(item)
    }
}
export default PhysicsWorldComponent