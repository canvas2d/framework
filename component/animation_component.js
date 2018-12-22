import ActionManager from '../action/action_manager.js'

const cache = []
class AnimationComponent {
    constructor() {}
    init(node) {
        this.host = node
        this.actionManager = ActionManager.create(node)
        return this
    }
    update(session) {
        this.actionManager.update(session)
    }
    remove() {
        this.host = null
        this.actionManager.remove()
        this.actionManager = null
        this._collect()
    }
    _collect() {
        AnimationComponent.collect(this)
    }
    runAction(...args) {
        return this.actionManager.runAction(...args)
    }
    static create(node) {
        return (cache.length ? cache.pop() : new AnimationComponent).init(node)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default AnimationComponent