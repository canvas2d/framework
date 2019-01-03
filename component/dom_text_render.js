const cache = []
class DomTextRender {
    constructor() {}
    init() {
        this.map = {}
        this.divCache = []
        this.visibleTiles = []
        this.prevVisibleTiles = []
        return this
    }
    getExistedDiv(id) {
        const div = this.map[id]
        if (div) {
            this.visibleTiles.push(id)
        }
        return div
    }
    createDiv(id) {
        let divs
        if (this.divCache.length) {
            divs = this.divCache.pop()
        } else {
            const div = document.createElement('div')
            const child = document.createElement('div')
            div.appendChild(child)
            divs = [div, child]
        }
        this.map[id] = divs
        this.visibleTiles.push(id)
        return divs
    }
    getDom(parent, id) {
        let divs = this.getExistedDiv(id)
        if (!divs) {
            divs = this.createDiv(id)
            parent.appendChild(divs[0])
        }
        return divs
    }
    beginRender() {}
    endRender() {
        const prevVisibleTiles = this.prevVisibleTiles
        const visibleTiles = this.visibleTiles
        prevVisibleTiles.forEach((hash) => {
            if (visibleTiles.indexOf(hash) == -1) {
                this.cache(hash)
            }
        })
        this.prevVisibleTiles = visibleTiles
        this.visibleTiles = prevVisibleTiles
        this.visibleTiles.length = 0
    }
    cache(hash) {
        const divs = this.map[hash]
        if (divs) {
            divs[0].style.display = 'none'
            this.divCache.push(divs)
        }
        this.map[hash] = null
    }
    remove() {
        this.map =
            this.divCache =
            this.visibleTiles =
            this.prevVisibleTiles = null
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
export default DomTextRender