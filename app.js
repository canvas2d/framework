import {
    requestAnimationFrame,
    cancelAnimationFrame
} from './util/animation_frame.js'

import SessionComponent from './component/session_component.js'

const cache = []
class App {
    constructor() {
        this.run = this.runLoop.bind(this)
        this.sessionComponent = SessionComponent.create()
    }
    update() {
        this.currentScene && this.currentScene.update()
    }
    render() {
        this.currentScene && this.currentScene.render()
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
            this.currentScene = null
    }
    static create() {
        return (cache.length ? cache.pop() : new App)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default App