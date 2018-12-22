const cache = []

class FadeTo {
    constructor() {}

    init(to, duration, ease, callback) {
        this.name = 'FadeTo'
        this.parent = null
        this.target = null
        this.from = 0
        this.to = to
        this.delta = 0
        this.tick = 0
        this.duration = duration
        this.iDuration = duration != 0 ? 1 / duration : 0
        this.ease = ease
        this.callback = callback
        this.fn = null
        this.isFinished = false
        return this
    }
    initWithFn(fn, duration, ease, callback) {
        this.init(null, duration, ease, callback)
        this.fn = fn
        return this
    }
    run(target) {
        this.target = target
        if (this.fn) {
            this.fn(target)
        }
        this.from = target.graphicsComponent.alpha
        this.delta = this.to - this.from
        return this
    }
    updateFrame(percent) {
        this.target.graphicsComponent.alpha = this.delta * percent + this.from
        return this
    }
    update(frameElapsedTime) {
        this.tick += frameElapsedTime
        if (this.tick >= this.duration) {
            this.updateFrame(1)
            this.isFinished = true
            if (this.callback) {
                this.callback(this.target)
            }
            this.parent.removeAction(this)
        } else {
            this.updateFrame(this.tick * this.iDuration)
        }
        return this
    }
    restore() {
        this.tick = 0
        this.isFinished = false
        return this
    }
    remove() {
        this.parent =
            this.target =
            this.callback =
            this.fn = null
        this._collect()
    }
    _collect() {
        FadeTo.collect(this)
    }
    static create(to, duration, ease, callback) {
        return (cache.length ? cache.pop() : new FadeTo).init(to, duration, ease, callback)
    }
    static createWithFn(fn, duration, ease, callback) {
        return (cache.length ? cache.pop() : new FadeTo).initWithFn(fn, duration, ease, callback)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default FadeTo