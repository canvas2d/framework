function sort(a, b) {
    return a.zIndex - b.zIndex
}

const cache = []
class NodeTreeComponent {
    constructor() {}
    init(node) {
        this.host = node
        this.parent = null
        this.children = []
        this.zIndex = 0
        return this
    }
    update(...args) {
        // console.log('NodeTreeComponent update')
        this.children.forEach((child) => {
            child && child.update(...args)
        })
    }
    render(...args) {
        // console.log('NodeTreeComponent render')
        this.children.forEach((child) => {
            child && child.render(...args)
        })
    }
    setParent(parent) {
        this.parent = parent
    }
    addChild(child, at) {
        const children = this.children
        if (undefined === at) {
            children.push(child)
        } else {
            for (let i = children.length; i > at; i--) {
                children[i] = children[i - 1]
            }
            children[at] = child
        }
        child.nodeTreeComponent.setParent(this)
        return this
    }
    sortChildren() {
        this.children.sort(sort)
        return this
    }
    setZIndex(index) {
        this.zIndex = index
    }
    removeChild(child, noClear) {
        return this.removeChildAt(this.children.indexOf(child), noClear)
    }
    removeChildAt(index, noClear) {
        const children = this.children
        noClear || children[index].remove()
        for (let i = index, j = children.length - 1; i < j; i++) {
            children[i] = children[i + 1]
        }
        --children.length
        return this
    }
    removeChildren(noClear) {
        const children = this.children
        if (!noClear) {
            for (let i = 0, j = children.length; i < j; i++) {
                children[i].remove()
            }
        }
        children.length = 0
        return this
    }
    removeFromParent(noClear) {
        if (this.parent) {
            this.parent.removeChild(this, noClear)
        }
        return this
    }
    remove() {
        this.children.forEach(function(child) {
            child.remove()
        })
        this.host =
            this.parent =
            this.children = null
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