const cache = []
class DomTileRender {
    constructor() {}
    init() {
        this.map = {}
        this.divCache = []
        this.visibleTiles = []
        this.prevVisibleTiles = []
        this.container = null
        this._containerUpdated = false
        return this
    }
    getContainer(parent) {
        let container = this.container
        if (!container) {
            container = document.createElement('div')
            parent.appendChild(container)
            this.container = container
        }
        return container
    }
    getDom(x, y) {
        const container = this.container
        let divs = this.getExistedDiv(x, y)
        if (!divs) {
            divs = this.createDiv(x, y)
            container.appendChild(divs[0])
        }
        return divs
    }
    beginRender() {
        this._containerUpdated = false
    }
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
    drawContainer(dom, matrix, globalAlpha) {
        if (!this._containerUpdated) {
            this._containerUpdated = true
            const container = this.getContainer(dom)
            container.style.transform = matrix.toString()
            container.style.transformOrigin = 'left top'
            container.style.opacity = globalAlpha
        }
    }
    cache(hash) {
        const divs = this.map[hash]
        if (divs) {
            divs[0].style.display = 'none'
            this.divCache.push(divs)
        }
        this.map[hash] = null
    }
    getExistedDiv(x, y) {
        const div = this.map[x + '_' + y]
        if (div) {
            this.visibleTiles.push(x + '_' + y)
        }
        return div
    }
    createDiv(x, y) {
        let divs
        if (this.divCache.length) {
            divs = this.divCache.pop()
        } else {
            const div = document.createElement('div')
            const child = document.createElement('div')
            div.appendChild(child)
            divs = [div, child]
        }
        this.map[x + '_' + y] = divs
        this.visibleTiles.push(x + '_' + y)
        return divs
    }
    remove() {
        this.map =
            this.divCache =
            this.visibleTiles =
            this.prevVisibleTiles =
            this.container = null
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
export default DomTileRender