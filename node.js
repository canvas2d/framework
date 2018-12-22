import NodeTreeComponent from './component/node_tree_component.js'
import GraphicsComponent from './component/graphics_component.js'
import SpaceComponent from './component/space_component.js'
import AnimationComponent from './component/animation_component.js'

const cache = []
class Node {
    constructor() {}
    init() {
        this.nodeTreeComponent = NodeTreeComponent.create(this)
        this.graphicsComponent = GraphicsComponent.create(this)
        this.spaceComponent = SpaceComponent.create(this)
        return this
    }
    addStateSupport(state) {
        this.stateComponent = state
    }
    addAnimationSupport() {
        this.animationComponent = AnimationComponent.create(this)
    }
    update(session, camera, parentMatrix) {
        this.stateComponent && this.stateComponent.update()
        this.animationComponent && this.animationComponent.update()
        this.spaceComponent.update(session, camera, parentMatrix)
        this.graphicsComponent.update()
        this.nodeTreeComponent.update(session, camera, this.spaceComponent.getMatrix())
    }
    render(session, camera) {
        const alpha = this.graphicsComponent.getAlpha()
        this.graphicsComponent.render(session, camera, alpha)
        this.nodeTreeComponent.render(session, camera, alpha)
    }
    remove() {
        this.nodeTreeComponent.remove()
        this.graphicsComponent.remove()
        this.spaceComponent.remove()
        this.stateComponent && this.stateComponent.remove()
        this.animationComponent && this.animationComponent.remove()
        this.nodeTreeComponent =
            this.graphicsComponent =
            this.spaceComponent =
            this.stateComponent =
            this.animationComponent = null
        this._collect()
    }
    _collect() {
        Node.collect(this)
    }
    static create() {
        return (cache.length ? cache.pop() : new Node).init()
    }
    static collect(item) {
        cache.push(item)
    }
}
export default Node