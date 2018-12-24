import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import Texture from './common/texture.js'
import ImageLoader from './util/image_loader.js'

const app = App.create()
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
    const inputId = session.getCommandInput(this.inputId)
    this.graphicsComponent.color = inputId ? 'red' : 'blue'
})

btnLeft.setInteractive(true)
btnLeft.inputId = 1
btnLeft.keyCode = 'A'.charCodeAt(0)

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
    const inputId = session.getCommandInput(this.inputId)
    this.graphicsComponent.color = inputId ? 'red' : 'blue'
})

btnRight.setInteractive(true)
btnRight.inputId = 2
btnRight.keyCode = 'D'.charCodeAt(0)

scene.nodeTreeComponent.addChild(btnRight)

scene.addTileSupport()

scene.tileComponent.load('./resource/tiled.json')
scene.tileComponent.nodeTreeComponent.setZIndex(-1)
scene.nodeTreeComponent.sortChildren()
scene.addCameraSupport()

scene.cameraComponent.position.update(100, 1500)
scene.cameraComponent.addHookSupport()
scene.cameraComponent.hookComponent.onUpdate.push(function(session) {
    if (session.getCommandInput(btnLeft.inputId)) {
        this.position.x -= 5
    }
    if (session.getCommandInput(btnRight.inputId)) {
        this.position.x += 5
    }
    this.position.x = Math.max(session.getDesignInfo().resolution.x >> 1, this.position.x)
})

app.sessionComponent.domEventComponent.addTouchInputSupport()
app.sessionComponent.domEventComponent.addKeyboardInputSupport()
app.sessionComponent.domEventComponent.listenToKeyCodes([btnLeft.keyCode, btnRight.keyCode])

app.sessionComponent.setDesignSize(1136, 768, 1600, 900)

app.presentScene(scene)

app.run()