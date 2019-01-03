import Matrix from '../common/matrix.js'

const cache = []
class GraphicsComponent {
    constructor() {}
    init(node) {
        this.host = node
        this.texture = null
        this.color = null
        this.alpha = 1
        this.alphaComputed = 1
        this.width = 0
        this.height = 0
        this.notUseCamera = false
        this._renderMatrix = Matrix.create(1, 0, 0, 1, 0, 0)
        this.fontText = null
        return this
    }
    getAlpha() {
        return this.alphaComputed
    }
    update(session, camera) {
        if (this.texture) {
            this.texture.update(session, camera)
        }
        if (this.fontText) {
            this.fontText.update(session, camera)
        }
        return this
    }
    setGraphicsInfo(session, camera, node, parentAlpha) {
        const spaceComponent = node.spaceComponent
        const matrix = this._renderMatrix.set(spaceComponent.getMatrix())
        const width = spaceComponent.getWidth()
        const height = spaceComponent.getHeight()
        if (this.texture && this.texture.rotated) {
            matrix.translate(
                0,
                height
            )
            matrix.rotateWithSinCos(-1, 0)
        }

        if (camera && !this.notUseCamera) {
            camera.transform(matrix)
        } else {
            session.transform(matrix)
        }
        session.setTransformMatrix(matrix)

        session.setAlpha(this.alphaComputed = parentAlpha * this.alpha)

        session.setNodeId(node.__id)
        this.width = width
        this.height = height
    }
    render(session, camera, parentAlpha) {
        const node = this.host
        this.setGraphicsInfo(
            session,
            camera,
            node,
            parentAlpha
        )

        if (this.texture) {
            this.renderTexture(session, this.texture)
        } else if (this.fontText) {
            this.drawFontText(session)
        } else if (this.color) {
            this.draw(session, this.color)
        }
    }
    renderTexture(session, texture) {
        texture.renderToSession(session, this.width, this.height)
    }
    draw(session, color) {
        session.draw(color, 0, 0, this.width, this.height)
        return this
    }
    drawFontText(session) {
        session.drawFontText(this.color, this.fontText, this.width, this.height)
    }
    remove() {
        this._renderMatrix.remove()
        this.fontText && this.fontText.remove()
        this.host =
            this.texture =
            this._renderMatrix =
            this.fontText = null
        this._collect()
    }
    _collect() {
        GraphicsComponent.collect(this)
    }
    static create(node) {
        return (cache.length ? cache.pop() : new GraphicsComponent).init(node)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default GraphicsComponent