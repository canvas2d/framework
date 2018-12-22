const cache = []
class NodeTreeComponent {
    constructor() {}
    init(node) {
        this.host = node
        return this
    }
    update() {
        // console.log('NodeTreeComponent update')
    }
    render() {
        // console.log('NodeTreeComponent render')
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        NodeTreeComponent.collect(this)
    }
    static create(node) {
        return (cache.length ? cache.pop() : new NodeTreeComponent).init(node)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default NodeTreeComponent