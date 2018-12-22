import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'

const app = App.create()
const scene = Scene.create()
const node = Node.create()

node.graphicsComponent.color = 'red'
node.graphicsComponent.width = node.graphicsComponent.height = 100

node.spaceComponent.width = node.spaceComponent.height = 100
node.spaceComponent.anchor.update(0, 0)

node.spaceComponent.position.update(200, 300)
node.spaceComponent.rotation.update(Math.PI / 6)
node.spaceComponent.scale.update(1.1, 1.2)

scene.nodeTreeComponent.addChild(node)

app.presentScene(scene)
app.run()