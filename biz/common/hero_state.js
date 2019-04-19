import StateComponent from '../../component/state_component.js'
import HeroFSM from './hero_fsm.js'
import Ajax from '../../util/ajax.js'
import PlistParser from '../../util/plist_parser.js'
import Texture from '../../common/texture.js'
import ImageLoader from '../../util/image_loader.js'
import FrameChange from '../../action/frame_change.js'

const cache = []

class HeroStateComponent extends StateComponent {
    constructor() {
        super()
    }
    init(...args) {
        super.init(...args)
        this.fsm = HeroFSM.create(this.host)
        this.initAnimation()
        this.initCameraFollow()
        return this
    }
    update(session, camera) {
        this.fsm.update(session.commandInputComponent.getMask())
    }
    initCameraFollow() {
        this.host.addHookSupport()
        this.host.hookComponent.onUpdate.push(function(session, camera) {
            const nodePos = this.spaceComponent.position
            const cameraPos = camera.position
            const deltaX = cameraPos.x - nodePos.x
            const deltaY = cameraPos.y - nodePos.y
            cameraPos.substractxy(
                Math.ceil(deltaX * 0.1),
                Math.ceil(deltaY * 0.1)
            )
            cameraPos.x = Math.max(session.getDesignInfo().resolution.x >> 1, cameraPos.x)
        })
    }
    async initAnimation() {
        const [plistText, img] = await Promise.all([
            Ajax.get('./resource/PlayerSkeleton.plist'),
            ImageLoader.load('./resource/PlayerSkeleton.png')
        ])

        const runFrame = /^Player_Skeleton_run_\d+.png$/

        const frames = PlistParser.parse(plistText).frames

        const runFrames = Object.keys(frames).filter(function(key) {
            return key.match(runFrame)
        }).map(function(key) {
            return frames[key].frame
        })

        this.host.graphicsComponent.texture = Texture.create(img)
        this.host.addAnimationSupport()
        this.host.animationComponent.runAction(FrameChange.create(runFrames, 5))
    }
    _collect() {
        this.fsm.remove()
        this.fsm = null
        this.constructor.collect(this)
    }
    static create(host) {
        return (cache.length ? cache.pop() : new this).init(host)
    }
    static collect(item) {
        cache.push(item)
    }
}

export default HeroStateComponent