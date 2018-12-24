const cache = []
class TileComponent {
    constructor() {}
    init(scene) {
        this.host = scene
        return this
    }
    update() {
        // console.log('TileComponent update')
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        TileComponent.collect(this)
    }
    static create(scene) {
        return (cache.length ? cache.pop() : new TileComponent).init(scene)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default TileComponent