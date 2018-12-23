const cache = []
class Frame {
    constructor() {}
    update(x, y, width, height) {
        this.x1 = x
        this.y1 = y
        this.x2 = x + width
        this.y2 = y + height
        this.width = width
        this.height = height
        this.halfWidth = width * 0.5
        this.halfHeight = height * 0.5
        this.centerX = x + width * 0.5
        this.centerY = y + height * 0.5
        return this
    }
    collide(to) {
        if (
            to.x > this.x2 ||
            to.y > this.y2 ||
            to.x2 < this.x ||
            to.y2 < this.y
        ) {
            return false
        }
        return true
    }
    collideTo(x1, y1, x2, y2) {
        if (
            x1 > this.x2 ||
            y1 > this.y2 ||
            x2 < this.x1 ||
            y2 < this.y1
        ) {
            return false
        }
        return true
    }
    contains(x, y) {
        return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2
    }
    remove() {
        this._collect()
    }
    _collect() {
        Frame.collect(this)
    }
    static create(x, y, width, height) {
        return (cache.length ? cache.pop() : new Frame).update(x, y, width, height)
    }
    static collect(frame) {
        cache.push(frame)
    }
}

export default Frame