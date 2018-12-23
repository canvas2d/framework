import Matrix from '../common/matrix.js'
import Vector from '../common/vector.js'

const cache = []
class ResolutionComponent {
    constructor() {}
    init() {
        this.design = {
            width: 0,
            height: 0,
            maxWidth: 0,
            maxHeight: 0,
            resolution: Vector.create(0,0)
        }
        this.display = {
            width: 0,
            height: 0,
            baseTransform: Matrix.create(1, 0, 0, 1, 0, 0),
            _baseTransformI: Matrix.create(1, 0, 0, 1, 0, 0),
            scaleRatio: 1
        }
        return this
    }
    resize(fullW, fullH, scaleRatio) {
        this.display.width = fullW
        this.display.height = fullH
        this.display.scaleRatio = scaleRatio

        const designW = this.design.width
        const designH = this.design.height
        const maxWidth = this.design.maxWidth
        const maxHeight = this.design.maxHeight

        const fullRatio = fullW / fullH
        const designRatio = designW / designH

        let width = 0
        let height = 0
        let realRatio
        if (fullRatio > designRatio) {
            //dom过宽，高度可以固定
            realRatio = fullH / designH
            const computedFullWidth = Math.ceil(fullW / realRatio)
            width = Math.min(maxWidth, computedFullWidth)
            height = designH
        } else {
            realRatio = fullW / designW

            const computedFullHeight = Math.ceil(fullH / realRatio)
            height = Math.min(maxHeight, computedFullHeight)
            width = designW
        }

        const paddingX = width * realRatio - fullW
        const paddingY = height * realRatio - fullH
        this.display.baseTransform.update(
            1 / realRatio,
            0, 0,
            1 / realRatio,
            1 / realRatio * paddingX * 0.5,
            1 / realRatio * paddingY * 0.5
        )
        this.display._baseTransformI.update(
            realRatio,
            0,
            0,
            realRatio,
            paddingX * -0.5,
            paddingY * -0.5
        )
        this.design.resolution.update(width, height)

        // this.pubsubComponent.pub('resolution-change', this.design)
    }
    remove() {
        this.design =
            this.display = null
        this._collect()
    }
    _collect() {
        ResolutionComponent.collect(this)
    }
    static create() {
        return (cache.length ? cache.pop() : new ResolutionComponent).init()
    }
    static collect(item) {
        cache.push(item)
    }
}
export default ResolutionComponent