import {
    requestAnimationFrame,
    cancelAnimationFrame
} from './util/animation_frame.js'

import SessionComponent from './component/session_component.js'

const cache = []
class App {
    constructor() {}
    init() {
        this.run = this.runLoop.bind(this)
        this.sessionComponent = SessionComponent.create()
        return this
    }
    update() {
        this.currentScene && this.currentScene.update(this.sessionComponent)
    }
    render() {
        this.currentScene && this.currentScene.render(this.sessionComponent)
    }
    runLoop() {
        this.update()
        this.render()
        this.requestAnimFrameId = requestAnimationFrame(this.run)
    }
    presentScene(scene) {
        this.currentScene = scene
    }
    remove() {
        cancelAnimationFrame(this.requestAnimFrameId)
        this.sessionComponent.remove()
        this.currentScene && this.currentScene.remove()
        this.sessionComponent =
            this.currentScene =
            this.run = null
        this._collect()
    }
    _collect() {
        App.collect(this)
    }
    static create() {
        return (cache.length ? cache.pop() : new App).init()
    }
    static collect(item) {
        cache.push(item)
    }
}
export default App