const cache = []
class HookComponent {
    constructor() {}
    init(host) {
        this.host = host
        this.onUpdate = []
        this.onRemove = []
        this.afterUpdate = []
        return this
    }
    update() {
        return this
    }
    handleOnUpdate() {
        const args = arguments
        for (let i = 0, j = this.onUpdate.length; i < j; i++) {
            this.onUpdate[i].apply(this.host, args)
        }
    }
    handleAfterUpdate() {
        const args = arguments
        for (let i = 0, j = this.afterUpdate.length; i < j; i++) {
            this.afterUpdate[i].apply(this.host, args)
        }
    }
    handleOnRemove() {
        const args = arguments
        for (let i = 0, j = this.onRemove.length; i < j; i++) {
            this.onRemove[i].apply(this.host, args)
        }
    }
    remove() {
        this.handleOnRemove()
        this.host =
            this.onUpdate =
            this.afterUpdate =
            this.onRemove = null
        this._collect()
    }
    _collect() {
        HookComponent.collect(this)
    }
    static create(host) {
        return (cache.length ? cache.pop() : new HookComponent).init(host)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default HookComponent