import Vector from '../common/vector.js'
import Matrix from '../common/matrix.js'
import Rotation from '../common/rotation.js'
import Frame from '../common/frame.js'

const cache = []

class SpaceComponent {
    constructor() {}
    init(node) {
        this.host = node

        this.width = 0
        this.height = 0
        this.anchor = Vector.create(0.5, 0.5)
        this.rotation = Rotation.create(0)
        this.scale = Vector.create(1.0, 1.0)
        this.position = Vector.create(0, 0)
        this.relative = Vector.create(0, 0)
        this._matrix = Matrix.create(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)

        this.frame = Frame.create(0, 0, 0, 0)
        return this
    }
    update(session, camera, parentMatrix) {
        // console.log('SpaceComponent update')

        const design = session.getDesignInfo()
        const ax = this.width * this.anchor.x
        const ay = this.height * this.anchor.y
        const tx = this.position.x + this.relative.x * design.resolution.x
        const ty = this.position.y + this.relative.y * design.resolution.y
        const sin = this.rotation.sin
        const cos = this.rotation.cos
        const sx = this.scale.x
        const sy = this.scale.y
        const A = cos * sx
        const B = sin * sx
        const C = -sin * sy
        const D = cos * sy

        const matrix = this._matrix
        if (parentMatrix) {
            matrix.set(parentMatrix)
        } else {
            matrix.reset()
        }
        matrix.transform(
            A,
            B,
            C,
            D,
            A * -ax + C * -ay + tx,
            B * -ax + D * -ay + ty
        )
        this.frame.computeWithMatrix(this.width, this.height, matrix)
        return this
    }
    getMatrix() {
        return this._matrix
    }
    getWidth() {
        return this.width
    }
    getHeight() {
        return this.height
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        SpaceComponent.collect(this)
    }
    static create(node) {
        return (cache.length ? cache.pop() : new SpaceComponent).init(node)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default SpaceComponent