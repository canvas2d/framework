const cache = []
class ActionManager {
    constructor() {}
    init(target) {
        this.target = target
        this.actions = []
        return this
    }
    update(session) {
        for (let i = 0, j = this.actions.length; i < j; i++) {
            const action = this.actions[i]
            if (action) {
                action.update(session.deltaTime)
            }
        }
        return this
    }
    remove() {
        for (let i = 0, j = this.actions.length; i < j; i++) {
            const action = this.actions[i]
            if (action) {
                action.remove()
            }
        }
        this.actions = []
        this.target = null
        this._collect()
    }
    runAction(action) {
        this.addAction(action)
        action.run(this.target)
        return this
    }
    stopAction(action) {
        action.stop()
        return this
    }
    pauseAction(action) {
        action.pause()
        return this
    }
    resumeAction(action) {
        action.resume()
        return this
    }
    addAction(action) {
        this.actions.push(action)
        action.parent = this
        return this
    }
    removeAction(action) {
        for (let i = 0, j = this.actions.length; i < j; i++) {
            if (this.actions[i] === action) {
                j--
                while (i < j) {
                    this.actions[i] = this.actions[++i]
                }
                this.actions.length = j
                break
            }
        }
        action.remove()
        return this
    }
    _collect() {
        ActionManager.collect(this)
    }
    static create(target) {
        return (cache.length ? cache.pop() : new ActionManager).init(target)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default ActionManager