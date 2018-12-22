const cache = []
class Texture {
    constructor() {}
    init(source, x, y, width, height) {
        this.source = source
        this.x = x === undefined ? 0 : x
        this.y = y === undefined ? 0 : y
        this.width = width === undefined ? source.width : width
        this.height = height === undefined ? source.height : height
        this.rotated = false
        return this
    }
    updateFrame(frame) {
        this.x = frame[0]
        this.y = frame[1]
        this.width = frame[2]
        this.height = frame[3]
        this.rotated = frame[4]
    }
    renderToSession(session, width, height) {
        if (this.rotated) {
            session.drawImage(
                this.source,
                this.x,
                this.y,
                this.height,
                this.width,
                0,
                0,
                height,
                width
            )
        } else {
            session.drawImage(this.source, this.x, this.y, this.width, this.height, 0, 0, width, height)
        }
    }
    update() {
        return this
    }
    remove() {
        this.source = null
        this._collect()
    }
    _collect() {
        Texture.collect(this)
    }
    static create(source, x, y, width, height) {
        return (cache.length ? cache.pop() : new Texture).init(source, x, y, width, height)
    }
    static collect() {
        cache.push(this)
    }
}

export default Texture