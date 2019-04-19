import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import HeroState from './biz/common/hero_state.js'
import INPUT_ENUM from './biz/common/input_enum.js'

//App.create的第二个参数 0:canvas 1:dom 2: webgl
const app = App.create(undefined, 1)
const scene = Scene.create()

const btnLeft = Node.create()
btnLeft.spaceComponent.notUseCamera = true
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
btnLeft.interactComponent.inputId = INPUT_ENUM.LEFT.inputId
btnLeft.interactComponent.keyCode = INPUT_ENUM.LEFT.keyCode

scene.nodeTreeComponent.addChild(btnLeft)

const btnRight = Node.create()
btnRight.spaceComponent.notUseCamera = true
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
btnRight.interactComponent.inputId = INPUT_ENUM.RIGHT.inputId
btnRight.interactComponent.keyCode = INPUT_ENUM.RIGHT.keyCode

scene.nodeTreeComponent.addChild(btnRight)

scene.addTileSupport()

scene.tileComponent.load('./resource/tiled.json')
scene.tileComponent.nodeTreeComponent.setZIndex(-1)
scene.nodeTreeComponent.sortChildren()
scene.addCameraSupport()

scene.cameraComponent.position.update(100, 1500)

{
    const node = Node.create()
    node.addStateSupport(HeroState.create(node))
    node.spaceComponent.position.update(300, 1500)
    node.spaceComponent.width = 50
    node.spaceComponent.height = 80
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