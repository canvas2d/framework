const cache = []
class Rotation {
    constructor() {}
    clone() {
        return Rotation.create(this.angle)
    }
    add(angle) {
        return this.update(this.angle + angle)
    }
    set(angle) {
        if (this.angle != angle) {
            this.update(angle)
        }
        return this
    }
    reset() {
        this.angle = 0
        this.sin = 0
        this.cos = 1
        return this
    }
    update(angle) {
        this.angle = angle
        this.sin = Math.sin(angle)
        this.cos = Math.cos(angle)
        return this
    }
    remove() {
        this._collect()
    }
    _collect() {
        Rotation.collect(this)
    }
    static create(angle) {
        return (cache.length ? cache.pop() : new Rotation).update(angle)
    }
    static collect(rotation) {
        cache.push(rotation)
    }
}

export default Rotation