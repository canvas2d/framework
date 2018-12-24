import NodeTreeComponent from './component/node_tree_component.js'
import GraphicsComponent from './component/graphics_component.js'
import SpaceComponent from './component/space_component.js'
import AnimationComponent from './component/animation_component.js'
import HookComponent from './component/hook_component.js'
import InteractComonent from './component/interact_component.js'

const cache = []
class Node {
    constructor() {}
    init() {
        this.nodeTreeComponent = NodeTreeComponent.create(this)
        this.graphicsComponent = GraphicsComponent.create(this)
        this.spaceComponent = SpaceComponent.create(this)
        this.hookComponent = null
        this.stateComponent = null
        this.animationComponent = null
        this.interactComonent = null
        return this
    }
    addInteractSupport() {
        this.interactComonent = this.interactComonent || InteractComonent.create(this)
    }
    addStateSupport(state) {
        this.stateComponent = state
    }
    addAnimationSupport() {
        this.animationComponent = this.animationComponent || AnimationComponent.create(this)
    }
    addHookSupport() {
        this.hookComponent = this.hookComponent || HookComponent.create(this)
    }
    handleInteract(session) {
        this.interactComonent && this.interactComonent.handle(session)
    }
    update(session, camera, parentMatrix) {
        this.hookComponent && this.hookComponent.handleOnUpdate(session, camera)
        this.stateComponent && this.stateComponent.update(session)
        this.animationComponent && this.animationComponent.update(session)
        this.spaceComponent.update(session, camera, parentMatrix)
        this.graphicsComponent.update(session)
        this.nodeTreeComponent.update(session, camera, this.spaceComponent.getMatrix())
        this.hookComponent && this.hookComponent.handleAfterUpdate(session, camera)
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