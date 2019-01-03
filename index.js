import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import Texture from './common/texture.js'
import ImageLoader from './util/image_loader.js'
import Ajax from './util/ajax.js'
import PlistParser from './util/plist_parser.js'
import FrameChange from './action/frame_change.js'
//App.create的第二个参数 0:canvas 1:dom 2: webgl
const app = App.create(undefined, 2)
const scene = Scene.create()

const btnLeft = Node.create()
btnLeft.graphicsComponent.notUseCamera = true
btnLeft.graphicsComponent.color = 'red'
btnLeft.graphicsComponent.width =
    btnLeft.spaceComponent.width = 200
btnLeft.graphicsComponent.height =
    btnLeft.spaceComponent.height = 100
btnLeft.spaceComponent.relative.update(0, 1)
btnLeft.spaceComponent.anchor.update(0, 1)
btnLeft.addHookSupport()

btnLeft.hookComponent.onUpdate.push(function(session) {
    const inputId = session.getCommandInput(this.interactComponent.inputId)
    this.graphicsComponent.color = inputId ? 'red' : 'blue'
})

btnLeft.addInteractSupport()
btnLeft.interactComponent.inputId = 1
btnLeft.interactComponent.keyCode = 'A'.charCodeAt(0)

scene.nodeTreeComponent.addChild(btnLeft)

const btnRight = Node.create()
btnRight.graphicsComponent.notUseCamera = true
btnRight.graphicsComponent.color = 'red'
btnRight.graphicsComponent.width =
    btnRight.spaceComponent.width = 200
btnRight.graphicsComponent.height =
    btnRight.spaceComponent.height = 100
btnRight.spaceComponent.relative.update(1, 1)
btnRight.spaceComponent.anchor.update(1, 1)
btnRight.addHookSupport()

btnRight.hookComponent.onUpdate.push(function(session) {
    const inputId = session.getCommandInput(this.interactComponent.inputId)
    this.graphicsComponent.color = inputId ? 'red' : 'blue'
})

btnRight.addInteractSupport()
btnRight.interactComponent.inputId = 2
btnRight.interactComponent.keyCode = 'D'.charCodeAt(0)

scene.nodeTreeComponent.addChild(btnRight)

scene.addTileSupport()

scene.tileComponent.load('./resource/tiled.json')
scene.tileComponent.nodeTreeComponent.setZIndex(-1)
scene.nodeTreeComponent.sortChildren()
scene.addCameraSupport()

scene.cameraComponent.position.update(100, 1500)
scene.cameraComponent.addHookSupport()
scene.cameraComponent.hookComponent.onUpdate.push(function(session) {
    if (session.getCommandInput(btnLeft.interactComponent.inputId)) {
        this.position.x -= 5
    }
    if (session.getCommandInput(btnRight.interactComponent.inputId)) {
        this.position.x += 5
    }
    this.position.x = Math.max(session.getDesignInfo().resolution.x >> 1, this.position.x)
})


{

    const node = Node.create()

    node.spaceComponent.position.update(300, 300)
    node.spaceComponent.width = 50
    node.spaceComponent.height = 80

    node.graphicsComponent.notUseCamera = true
    Promise.all([
        Ajax.get('./resource/PlayerSkeleton.plist'),
        ImageLoader.load('./resource/PlayerSkeleton.png')
    ]).then(function(items) {
        const plistText = items[0]
        const img = items[1]
        const runFrame = /^Player_Skeleton_run_\d+.png$/

        const frames = PlistParser.parse(items[0]).frames

        const runFrames = Object.keys(frames).filter(function(key) {
            return key.match(runFrame)
        }).map(function(key) {
            return frames[key].frame
        })

        node.graphicsComponent.texture = Texture.create(img)
        node.addAnimationSupport()
        node.animationComponent.runAction(FrameChange.create(runFrames, 5))
    })

    scene.nodeTreeComponent.addChild(node)
}
app.sessionComponent.domEventComponent.addTouchInputSupport()
app.sessionComponent.domEventComponent.addKeyboardInputSupport()
app.sessionComponent.domEventComponent.addMouseInputSupport()
app.sessionComponent.domEventComponent.listenToKeyCodes([
    btnLeft.interactComponent.keyCode,
    btnRight.interactComponent.keyCode
])

app.sessionComponent.setDesignSize(1136, 768, 1600, 900)

app.presentScene(scene)

app.run()