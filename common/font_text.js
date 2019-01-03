const cache = []
let id = 0
class FontText {
    constructor() {}
    init(text, config) {
        this.__id = id++
        this.text = text
        this.textAlign = config && config.textAlign || 'start'
        this.textBaseline = config && config.textBaseline || "top"
        this.font = config && config.font
        this.x = config && config.x || 0
        this.y = config && config.y || 0
        return this
    }
    update() {
        this.isChanged = false
    }
    setText(text) {
        if (this.text === text) {
            return
        }
        this.text = text
        this.isChanged = true
    }
    setFont(font) {
        if (this.font === font) {
            return
        }
        this.font = font
        this.isChanged = true
    }
    remove() {
        this._collect()
    }
    _collect() {
        this.constructor.collect(this)
    }
    static create(text, config) {
        return (cache.length ? cache.pop() : new this).init(text, config)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default FontText