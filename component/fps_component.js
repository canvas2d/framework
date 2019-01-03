const cache = []
class FPSComponent {
    constructor() {}
    init() {
        this.currentTime = Date.now()
        this.frameNumber = 60
        this.frameCount = 0
        return this
    }
    update() {
        if (++this.frameCount == 60) {
            const now = Date.now()
            this.frameNumber = (60000 / (now - this.currentTime)).toFixed(1)
            this.frameCount = 0
            this.currentTime = now
        }
    }
    remove() {
        this._collect()
    }
    _collect() {
        this.constructor.collect(this)
    }
    static create() {
        return (cache.length ? cache.pop() : new this).init()
    }
    static collect(item) {
        cache.push(item)
    }
}
export default FPSComponent