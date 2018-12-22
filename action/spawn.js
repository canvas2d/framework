const cache = []
class Spawn {
    constructor() {}

    init(children, callback) {
        this.name = 'Spawn'
        this.children = children
        this.parent = null
        this.target = null
        this.tick = 0
        this.callback = callback
        this.duration = -1

        this.isFinished = false
        return this
    }
    run(target) {
        this.target = target
        return this
    }
    removeAction(action) {
        return this
    }
    remove() {
        for (let i = 0, j = this.children.length; i < j; i++) {
            const child = this.children[i]
            if (child) {
                child.remove()
            }
        }
        this.target =
            this.parent =
            this.callback =
            this.children = null
        this._collect()
    }
    _collect() {
        Spawn.collect(this)
    }
    restore() {
        this.tick = 0
        for (let i = 0, j = this.children.length; i < j; i++) {
            const child = this.children[i]
            if (child) {
                child.restore()
            }
        }
        this.isFinished = false
        return this
    }
    update(frameElapsedTime) {
        let finished = true
        for (let i = 0, j = this.children.length; i < j; i++) {
            const child = this.children[i]
            if (child) {
                if (!child.isFinished) {
                    if (!child.parent) {
                        child.parent = this
                        child.run(this.target)
                    }
                    child.update(frameElapsedTime)
                    finished = false
                }
            }
        }
        if (finished) {
            this.isFinished = true
            if (this.callback) {
                this.callback(this.target)
            }
            this.parent.removeAction(this)
        } else {
            this.tick++
        }
        return this
    }
    static create(children, callback) {
        return (cache.length ? cache.pop() : new Spawn).init(children, callback)
    }
    static collect(action) {
        cache.push(action)
    }
}

export default Spawn