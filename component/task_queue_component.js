const cache = []
class TaskQueueComponent {
    constructor() {}
    init() {
        this.tasks = []
        return this
    }
    add(...task) {
        this.tasks.push(...task)
    }
    update() {
        this.tasks.forEach(task => task && task())
        this.tasks.length = 0
    }
    remove() {
        this.tasks = null
        this.constructor.collect(this)
    }
    static create() {
        return (cache.length ? cache.pop() : new this).init()
    }
    static collect(item) {
        cache.push(item)
    }
}

export default TaskQueueComponent