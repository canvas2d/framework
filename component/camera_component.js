import Matrix from '../common/matrix.js'
import Vector from '../common/vector.js'
import Frame from '../common/frame.js'

const cache = []
class CameraComponent {
    constructor() {}
    init(scene) {
        this.host = scene
        this.position = Vector.create(0, 0)
        this.width = 0
        this.height = 0
        this.halfWidth = 0
        this.halfHeight = 0
        this._matrix = Matrix.create(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
        this._matrixI = Matrix.create(1, 0, 0, 1, 0, 0)
        this.frame = Frame.create(0, 0, 0, 0)
        this.onlyUseTranslate = true
        return this
    }
    update(session) {
        const resolution = session.getDesignInfo().resolution
        this.width = resolution.x
        this.height = resolution.y
        this.halfWidth = resolution.x >> 1
        this.halfHeight = resolution.y >> 1
        this.updateMatrix(session)
    }
    transform(matrix) {
        this._matrixI.transformMatrixTo(matrix, matrix)
    }
    updateMatrix(session) {
        const halfWidth = this.halfWidth
        const halfHeight = this.halfHeight
        if (this.onlyUseTranslate) {
            const tx = this.position.x - halfWidth
            const ty = this.position.y - halfHeight

            this._matrix.update(1, 0, 0, 1, tx, ty)

            this._matrixI.update(1, 0, 0, 1, -tx, -ty)

            this.frame.update(tx, ty, this.width, this.height)
        } else {
            //TODO add scale rotate support
        }

        session.transform(this._matrixI)
        return this
    }
    remove() {
        this.position.remove()
        this._matrix.remove()
        this._matrixI.remove()
        this.host =
            this.position =
            this._matrix =
            this._matrixI = null
        this._collect()
    }
    _collect() {
        CameraComponent.collect(this)
    }
    static create(scene) {
        return (cache.length ? cache.pop() : new CameraComponent).init(scene)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default CameraComponent