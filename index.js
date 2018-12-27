import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import Texture from './common/texture.js'
import ImageLoader from './util/image_loader.js'
import RotateBy from './action/rotate_by.js'
import Repeat from './action/repeat.js'
const app = App.create()
const scene = Scene.create()

const btn = Node.create()
btn.spaceComponent.relative.update(0.5, 0.5)
btn.spaceComponent.anchor.update(0.3, 0.3)
    // btn.spaceComponent.scale.update(1.3, 2)
btn.spaceComponent.rotation.update(Math.PI * 0.1)
btn.spaceComponent.width =
    btn.graphicsComponent.width =
    btn.spaceComponent.height = 200
btn.graphicsComponent.color = 'blue'

btn.addHookSupport()
btn.hookComponent.onUpdate.push(function(session) {
    const inputId = session.getCommandInput(this.interactComponent.inputId)
    this.graphicsComponent.color = inputId ? 'red' : 'blue'
})

btn.addInteractSupport()
btn.interactComponent.inputId = 1
btn.interactComponent.keyCode = 'D'.charCodeAt(0)

scene.nodeTreeComponent.addChild(btn)

const child = Node.create()
child.spaceComponent.rotation.update(Math.PI * 0.1)
child.spaceComponent.width =
    child.graphicsComponent.width =
    child.spaceComponent.height =
    child.graphicsComponent.spaceComponent = 100
child.graphicsComponent.color = 'yellow'
child.spaceComponent.position.update(200, 200)

child.addInteractSupport()
child.interactComponent.inputId = 2
child.interactComponent.keyCode = 'E'.charCodeAt(0)

child.addHookSupport()
child.hookComponent.onUpdate.push(function(session) {
    const inputId = session.getCommandInput(this.interactComponent.inputId)
    this.graphicsComponent.color = inputId ? 'red' : 'yellow'
})

btn.nodeTreeComponent.addChild(child)

btn.addAnimationSupport()
btn.animationComponent.actionManager.runAction(Repeat.create(RotateBy.create(Math.PI * 2, 2000), Infinity))

app.sessionComponent.domEventComponent.addTouchInputSupport()
app.sessionComponent.domEventComponent.addKeyboardInputSupport()
app.sessionComponent.domEventComponent.addMouseInputSupport()

app.sessionComponent.domEventComponent.listenToKeyCodes([
    btn.interactComponent.keyCode,
    child.interactComponent.keyCode
])

app.sessionComponent.setDesignSize(1136, 768, 1600, 900)

app.presentScene(scene)

app.run()