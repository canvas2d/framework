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
        return this
    }
    getAlpha() {
        return this.alphaComputed
    }
    update(session, camera) {
        if (this.texture) {
            this.texture.update(session, camera)
        }
        return this
    }
    setGraphicsInfo(session, camera, matrix, parentAlpha, width, height) {
        if (this.texture && this.texture.rotated) {
            matrix.translate(
                0,
                height
            )
            matrix.rotate(-Math.PI * 0.5)
        }
        session.setTransformMatrix(matrix)
        session.setAlpha(this.alphaComputed = parentAlpha * this.alpha)

        this.width = width
        this.height = height
    }
    render(session, camera, parentAlpha) {
        const node = this.host
        this.setGraphicsInfo(
            session,
            camera,
            node.spaceComponent.getMatrix(),
            parentAlpha,
            node.spaceComponent.getWidth(),
            node.spaceComponent.getHeight()
        )

        if (this.texture) {
            this.renderTexture(session, this.texture)
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
    remove() {
        this.host =
            this.texture = null
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