import MoveBase from './move_base.js'

const cache = []

//18帧//160
const smallJumpVelocities = [
    12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    10, 8, 6, 6, 4, 4, 2, 0
]

//30帧.//226
const bigJumpVelocities = [
    12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    10, 10, 10, 10, 10, 10, 10, 8, 8, 8, 6, 6, 0, 0,
    0, 0, 0, 0, 0, 0
]

const velocityMoveX = 10
const velocitySwimX = 6
const velocityJumpX = 12
const velocityMaxY = 30

class HeroFSM extends MoveBase {
    constructor() {
        super()
    }
    init(host) {
        super.init(host)
        this.host = host
        this.spaceComponent = host.spaceComponent
        /*
        this.prevJumpPressed = false
        this.stateX = 0
        this.stateY = 0
        this.jumpFrameCount = 0
        this.jumpHoldFrameCount = 0
        this.smallJumpThreshold = 10
        this.jumpNumber = 0
        this.prevTouchWall = 0
        this.touchWallCount = 0
        */
        this.velocityX = 0
        this.velocityY = 0
        this.scaleX = 1
        return this
    }
    update(commandInput) {
        super.update(commandInput)
        this.spaceComponent.scale.x = this.scaleX
        this.spaceComponent.position.x += this.velocityX
    }
    moveLeft() {
        super.moveLeft()
        this.velocityX = -velocityMoveX
        this.scaleX = -1
    }
    moveRight() {
        super.moveRight()
        this.velocityX = velocityMoveX
        this.scaleX = 1
    }
    moveStop() {
        super.moveStop()

        //处理速度的惯性,不使用摩擦系数,因为会出现小数
        const absX = Math.abs(this.velocityX)
        const dirVx = this.velocityX > 0
        if (absX <= 2) {
            this.velocityX = 0
        } else {
            this.velocityX = dirVx ? (absX - 2) : (2 - absX)
        }
    }
    jump() {

    }
    _collect() {
        this.constructor.collect(this)
    }
    static create(host) {
        return (cache.length ? cache.pop() : new this).init(host)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default HeroFSM