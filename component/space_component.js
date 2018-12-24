const cache = []
class SpaceComponent {
    constructor() {}
    init(node) {
        this.host = node
        return this
    }
    update() {
        // console.log('SpaceComponent update')
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        SpaceComponent.collect(this)
    }
    static create(node) {
        return (cache.length ? cache.pop() : new SpaceComponent).init(node)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default SpaceComponent