const cache = []
class CommandInputComponent {
    constructor() {}
    init(host) {
        this.mask = 0
        this.host = host
        return this
    }
    addInput(input) {
        this.mask |= input
    }
    removeInput(input) {
        this.mask &= ~input
    }
    getInput(input) {
        return this.mask & input
    }
    getMask() {
        return this.mask
    }
    reset() {
        this.mask = 0
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        CommandInputComponent.collect(this)
    }
    static create(host) {
        return (cache.length ? cache.pop() : new CommandInputComponent).init(host)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default CommandInputComponent