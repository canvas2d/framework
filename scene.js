import Node from './node.js'
import CameraComponent from './component/camera_component.js'
import TileComponent from './component/tile_component.js'

const cache = []
class Scene extends Node {
    constructor() {
        super()
    }
    init() {
        super.init()
        return this
    }
    addCameraSupport(camera) {
        this.cameraComponent = camera || CameraComponent.create(this)
    }
    addTileSupport(tile) {
        this.tileComponent = tile || TileComponent.create(this)
    }
    update(session) {
        const camera = this.cameraComponent

        super.update(session, camera, this.spaceComponent.getMatrix())

        this.tileComponent && this.tileComponent.update(session, camera)

        camera && camera.update(session)
        return this
    }
    render(session) {
        this.nodeTreeComponent.render(session, this.cameraComponent, this.graphicsComponent.getAlpha())
    }
    remove() {
        this.cameraComponent && this.cameraComponent.remove()
        this.tileComponent && this.tileComponent.remove()
        this.cameraComponent = this.tileComponent = null
    }
    static create() {
        return (cache.length ? cache.pop() : new Scene).init()
    }
    static collect(item) {
        cache.push(item)
    }
}

export default Scene