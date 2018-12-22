const cache = []
class Vector {
    init(x, y) {
        return this.update(x, y)
    }
    clone() {
        return Vector.create(this.x, this.y)
    }
    update(x, y) {
        this.x = x
        this.y = y
        return this
    }
    set(to) {
        this.x = to.x
        this.y = to.y
        return this
    }
    negate() {
        this.x = -this.x
        this.y = -this.y
        return this
    }
    distance(to) {
        return Math.sqrt(this.sqrtDistance(to))
    }
    sqrtDistance(to) {
        const x = this.x - to.x,
            y = this.y - to.y
        return x * x + y * y
    }
    normalize() {
        const inv = 1 / this.length()
        this.x *= inv
        this.y *= inv
        return this
    }
    length() {
        return Math.sqrt(this.sqrtLength())
    }
    sqrtLength() {
        return this.x * this.x + this.y * this.y
    }
    add(v) {
        return this.addxy(v.x, v.y)
    }
    addxy(x, y) {
        this.x += x
        this.y += y
        return this
    }
    substract(v) {
        return this.substractxy(v.x, v.y)
    }
    substractxy(x, y) {
        this.x -= x
        this.y -= y
        return this
    }
    multiply(num) {
        this.x *= num
        this.y *= num
        return this
    }
    devide(num) {
        return this.multiply(1 / num)
    }
    dot(v) {
        //向量内积 a.b
        return this.dotxy(v.x, v.y)
    }
    dotxy(x, y) {
        return this.x * x + this.y * y
    }
    cross(v) {
        //向量外积
        return this.crossxy(v.x, v.y)
    }
    crossxy(x, y) {
        return this.x * y - this.y * x
    }
    rotate(angle, cx, cy) {
        return this.rotateWithSinCos(Math.sin(angle), Math.cos(angle), cx, cy)
    }
    rotateWithSinCos(sin, cos, cx, cy) {
        let x = this.x,
            y = this.y
        x -= cx
        y -= cy
        this.x = cos * x + sin * y + cx
        this.y = -sin * x + cos * y + cy
        return this
    }
    angleTo(vector) {
        return Math.acos(this.dot(vector) / (this.length() * vector.length()))
    }
    transform(matrix) {
        const x = this.x,
            y = this.y
        this.x = matrix.a * x + matrix.c * y + matrix.e
        this.y = matrix.b * x + matrix.d * y + matrix.f
        return this
    }
    remove() {
        Vector.collect(this)
    }
    normal() {
        return Vector.create(this.y, -this.x)
    }
    major() {
        if (Math.abs(this.x) > Math.abs(this.y)) {
            return Vector.create(this.x >= 0 ? 1 : -1, 0)
        } else {
            return Vector.create(0, this.y >= 0 ? 1 : -1)
        }
    }
    lerp(to, ratio) {
        ratio = Math.max(0, Math.min(1, ratio))
        return this.lerpNoClamp(to, ratio)
    }
    lerpNoClamp(to, ratio) {
        this.addxy((to.x - this.x) * ratio, (to.y - this.y) * ratio)
        return this
    }
    static create(x, y) {
        return (cache.length ? cache.pop() : new Vector).update(x, y)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default Vector