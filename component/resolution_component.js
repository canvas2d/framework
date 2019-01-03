import Matrix from '../common/matrix.js'
import Vector from '../common/vector.js'
import Node from '../node.js'

const cache = []
class ResolutionComponent {
    constructor() {}
    init() {
        this.design = {
            width: 0,
            height: 0,
            maxWidth: 0,
            maxHeight: 0,
            resolution: Vector.create(0, 0)
        }
        this.display = {
            width: 0,
            height: 0,
            baseTransform: Matrix.create(1, 0, 0, 1, 0, 0),
            _baseTransformI: Matrix.create(1, 0, 0, 1, 0, 0),
            scaleRatio: 1
        }
        this.patchA = Node.create()
        this.patchA.graphicsComponent.color = '#FFF'

        this.patchB = Node.create()
        this.patchB.graphicsComponent.color = '#FFF'
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

        if (Math.abs(paddingX) > 0.01) {
            this.patchA.graphicsComponent.width = Math.abs(paddingX * 0.5)
            this.patchA.graphicsComponent.height = fullH
            this.patchA.spaceComponent.position.update(0, 0)

            this.patchB.graphicsComponent.width = Math.abs(paddingX * 0.5)
            this.patchB.graphicsComponent.height = fullH
            this.patchB.spaceComponent.position.update(fullW - Math.abs(paddingX * 0.5), 0)

        } else if (Math.abs(paddingY) > 0.01) {
            this.patchA.graphicsComponent.width = fullW
            this.patchA.graphicsComponent.height = Math.abs(paddingY * 0.5)
            this.patchA.spaceComponent.position.update(0, 0)

            this.patchB.graphicsComponent.width = fullW
            this.patchB.graphicsComponent.height = Math.abs(paddingY * 0.5)
            this.patchB.spaceComponent.position.update(0, fullH - Math.abs(paddingY * 0.5))
        } else {
            this.patchA.graphicsComponent.width =
                this.patchA.graphicsComponent.height = 0
            this.patchA.spaceComponent.position.update(0, 0)

            this.patchB.graphicsComponent.width =
                this.patchB.graphicsComponent.height = 0
            this.patchB.spaceComponent.position.update(0, 0)
        }
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
    }
    renderPatch(session) {
        const posA = this.patchA.spaceComponent.position
        session.setNodeId(this.patchA.__id)
        session.setTransform(1, 0, 0, 1, posA.x, posA.y)
        this.patchA.graphicsComponent.draw(session, this.patchA.graphicsComponent.color)

        const posB = this.patchB.spaceComponent.position
        session.setNodeId(this.patchB.__id)
        session.setTransform(1, 0, 0, 1, posB.x, posB.y)
        this.patchB.graphicsComponent.draw(session, this.patchB.graphicsComponent.color)
    }
    remove() {
        this.design.resolution.remove()
        this.display.baseTransform.remove()
        this.display._baseTransformI.remove()
        this.patchA.remove()
        this.patchB.remove()
        this.design =
            this.display =
            this.patchA =
            this.patchB = null
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