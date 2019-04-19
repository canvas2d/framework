import {
    requestAnimationFrame,
    cancelAnimationFrame
} from './util/animation_frame.js'

import SessionComponent from './component/session_component.js'
import TaskQueueComponent from './component/task_queue_component.js'

const cache = []
class App {
    constructor() {}
    init(dom, renderType) {
        this.run = this.runLoop.bind(this)
        this.sessionComponent = SessionComponent.create(dom, renderType)
        this.taskQueueComponent = TaskQueueComponent.create()
        return this
    }
    update() {
        this.sessionComponent.update()
        this.currentScene && this.currentScene.update(this.sessionComponent)
    }
    render() {
        this.sessionComponent.beginRender()
        this.currentScene && this.currentScene.render(this.sessionComponent)
        this.sessionComponent.endRender()
    }
    runLoop() {
        this.update()
        this.render()
        this.taskQueueComponent.update()
        this.requestAnimFrameId = requestAnimationFrame(this.run)
    }
    presentScene(scene) {
        this.currentScene = scene
    }
    remove() {
        cancelAnimationFrame(this.requestAnimFrameId)
        this.sessionComponent.remove()
        this.taskQueueComponent.remove()
        this.currentScene && this.currentScene.remove()
        this.sessionComponent =
            this.taskQueueComponent =
            this.currentScene =
            this.run = null
        this._collect()
    }
    _collect() {
        App.collect(this)
    }
    static create(dom, renderType) {
        return (cache.length ? cache.pop() : new this).init(dom, renderType)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default App