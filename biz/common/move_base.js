import INPUT_ENUM from './input_enum.js'

const cache = []
class MoveBaseComponent {
    constructor() {}
    init() {
        //状态相关
        this.touchTop = false
        this.touchRight = false
        this.touchBottom = false
        this.touchLeft = false

        //接触计数相关
        this.touchTopFrameTick = 0
        this.touchRightFrameTick = 0
        this.touchBottomFrameTick = 0
        this.touchLeftFrameTick = 0

        //输入相关
        this.inputUp = false
        this.inputRight = false
        this.inputLeft = false

        //输入计数相关
        this.inputUpFrameTick = 0
        this.inputRightFrameTick = 0
        this.inputLeftFrameTick = 0
        this.inputFrameTick = 0

        //运动能力相关
        this.jumpLimit = 1
        this.canJump = false
        this.canMoveLeft = true
        this.canMoveRight = true

        //运动计数相关
        this.jumpTick = 0
        this.jumpFrameTick = 0
        this.moveLeftFrameTick = 0
        this.moveRightFrameTick = 0
        this.moveFrameTick = 0
        return this
    }
    update(commandInput) {
        this.inputLeft = !!(commandInput & INPUT_ENUM.LEFT.inputId)
        this.inputRight = !!(commandInput & INPUT_ENUM.RIGHT.inputId)
        this.inputUp = !!(commandInput & INPUT_ENUM.UP.inputId)

        //同时按下等于都没按
        if (this.tryToMove()) {
            if (this.tryToMoveLeft()) {
                this.holdMoveLeft()
            } else {
                this.holdMoveLeftStop()
            }

            if (this.tryToMoveRight()) {
                this.holdMoveRight()
            } else {
                this.holdMoveRightStop()
            }
            this.holdMove()
        } else {
            this.holdMoveStop()
        }

        if (this.tryToJump()) {
            this.holdJump()
        } else {
            this.holdJumpStop()
        }

        if (this.tryToJump() && this.canStillJump()) {
            this.jump()
        } else {
            this.jumpStop()
        }

        if (this.tryToMove() && this.canStillMove()) {
            if (this.canStillMoveLeft() && this.tryToMoveLeft()) {
                this.moveLeft()
            } else {
                this.moveLeftStop()
            }
            if (this.canStillMoveRight() && this.tryToMoveRight()) {
                this.moveRight()
            } else {
                this.moveRightStop()
            }
            this.checkMoveStop()
        } else {
            this.moveStop()
        }
    }
    canStillJump() {
        return this.canJump && (this.jumpCount < this.jumpLimit) && this.touchBottom
    }
    canStillMoveLeft() {
        return this.canMoveLeft
    }
    canStillMoveRight() {
        return this.canMoveRight
    }
    canStillMove() {
        return this.canStillMoveLeft() || this.canStillMoveRight()
    }
    tryToJump() {
        return this.inputUp
    }
    tryToMoveLeft() {
        return this.inputLeft
    }
    tryToMoveRight() {
        return this.inputRight
    }
    tryToMove() {
        return this.tryToMoveLeft() != this.tryToMoveRight()
    }
    jump() {
        this.jumpFrameCount++
    }
    jumpStop() {
        this.jumpFrameCount = 0
    }
    moveLeft() {
        this.moveLeftFrameCount++
    }
    moveLeftStop() {
        this.moveLeftFrameCount = 0
    }
    moveRight() {
        this.moveRightFrameCount++
    }
    moveRightStop() {
        this.moveRightFrameCount = 0
    }
    checkMoveStop() {
        if (!this.moveLeftFrameCount && !this.moveRightFrameCount) {
            this.moveStop()
        }
    }
    moveStop() {
        this.moveFrameCount =
            this.moveLeftFrameCount =
            this.moveRightFrameCount = 0
    }
    holdJump() {
        this.inputUpFrameTick++
    }
    isHoldingJump() {
        return this.inputUpFrameTick > 0
    }
    holdJumpStop() {
        this.inputUpFrameTick = 0
    }
    holdMoveLeft() {
        this.inputLeftFrameTick++
    }
    isHoldingMoveLeft() {
        return this.inputLeftFrameTick > 0
    }
    holdMoveLeftStop() {
        this.inputLeftFrameTick = 0
    }
    holdMoveRight() {
        this.inputRightFrameTick++
    }
    isHoldingMoveRight() {
        return this.inputRightFrameTick > 0
    }
    holdMoveRightStop() {
        this.inputRightFrameTick = 0
    }
    holdMove() {
        this.inputFrameTick++
    }
    isHoldingMove() {
        return this.inputFrameTick > 0
    }
    holdMoveStop() {
        this.inputLeftFrameTick =
            this.inputRightFrameTick =
            this.inputUpFrameTick =
            this.inputFrameTick = 0
    }
    remove() {
        this._collect()
    }
    _collect() {
        this.constructor.collect(this)
    }
    static create(...args) {
        return (cache.length ? cache.pop() : new this).init(...args)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default MoveBaseComponent