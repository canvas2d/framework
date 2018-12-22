const cache = []
class GraphicsComponent {
    constructor() {}
    init(node) {
        this.host = node
        return this
    }
    update() {
        // console.log('GraphicsComponent update')
    }
    render() {
        // console.log('GraphicsComponent render')
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        GraphicsComponent.collect(this)
    }
    static create(node) {
        return (cache.length ? cache.pop() : new GraphicsComponent).init(node)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default GraphicsComponent