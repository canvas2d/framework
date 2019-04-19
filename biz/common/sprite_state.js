import StateComponent from '../../component/state_component.js'
import MoveBase from './move_base.js'

const cache = []

class SpriteStateComponent extends StateComponent {
    constructor() {
        super()
    }
    init(...args) {
        super.init(...args)
        this.moveComponent = MoveBase.create()

        return this
    }
    update() {

    }
    _collect() {
        this.moveComponent.remove()
        this.moveComponent = null
        this.constructor.collect(this)
    }
    static create(host) {
        return (cache.length ? cache.pop() : new this).init(host)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default SpriteStateComponent