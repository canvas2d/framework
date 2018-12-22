const cache = []
class AnimationComponent {
    constructor() {}
    init(node) {
        this.host = node
        return this
    }
    update() {
        //console.log('AnimationComponent update')
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        AnimationComponent.collect(this)
    }
    static create(node) {
        return (cache.length ? cache.pop() : new AnimationComponent).init(node)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default AnimationComponent