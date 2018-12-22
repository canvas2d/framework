const cache = []
class CameraComponent {
    constructor() {}
    init(scene) {
        this.host = scene
        return this
    }
    update() {
        // console.log('CameraComponent update')
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        CameraComponent.collect(this)
    }
    static create(scene) {
        return (cache.length ? cache.pop() : new CameraComponent).init(scene)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default CameraComponent