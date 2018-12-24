import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import Texture from './common/texture.js'
import ImageLoader from './util/image_loader.js'

const app = App.create()
const scene = Scene.create()

const btn = Node.create()
btn.spaceComponent.relative.update(0.5, 0.5)
btn.spaceComponent.width =
    btn.graphicsComponent.width =
    btn.spaceComponent.height =
    btn.graphicsComponent.spaceComponent = 100
btn.graphicsComponent.color = 'blue'

btn.addHookSupport()
btn.hookComponent.onUpdate.push(function(session) {
    const inputId = session.getCommandInput(this.inputId)
    this.graphicsComponent.color = inputId ? 'red' : 'blue'
})

btn.setInteractive(true)
btn.inputId = 1
btn.keyCode = 'D'.charCodeAt(0)

scene.nodeTreeComponent.addChild(btn)

app.sessionComponent.domEventComponent.addTouchInputSupport()
app.sessionComponent.domEventComponent.addKeyboardInputSupport()
app.sessionComponent.domEventComponent.listenToKeyCodes([btn.keyCode])

app.sessionComponent.setDesignSize(1136, 768, 1600, 900)

app.presentScene(scene)

app.run()