import NodeTreeComponent from './component/node_tree_component.js'
import GraphicsComponent from './component/graphics_component.js'
import SpaceComponent from './component/space_component.js'
import AnimationComponent from './component/animation_component.js'

class Node {
    constructor() {
        this.nodeTreeComponent = NodeTreeComponent.create(this)
        this.graphicsComponent = GraphicsComponent.create(this)
        this.spaceComponent = SpaceComponent.create(this)
    }
    addStateSupport(state) {
        this.stateComponent = state
    }
    addAnimationSupport() {
        this.animationComponent = AnimationComponent.create(this)
    }
    update() {
        this.stateComponent && this.stateComponent.update()
        this.animationComponent && this.animationComponent.update()
        this.spaceComponent.update()
        this.graphicsComponent.update()
        this.nodeTreeComponent.update()
    }
    render(session, camera) {
        this.graphicsComponent.render(session, camera)
        this.nodeTreeComponent.render(session, camera)
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
    }
}
export default Node