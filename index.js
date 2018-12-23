import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import Texture from './common/texture.js'
import ImageLoader from './util/image_loader.js'

const app = App.create()
const scene = Scene.create()

const node = Node.create()

node.addHookSupport()
scene.nodeTreeComponent.addChild(node)
ImageLoader.load('./resource/1136_768.jpg').then(function(img) {
    node.graphicsComponent.texture = Texture.create(img)
    node.spaceComponent.anchor.update(0, 0)
    node.hookComponent.onUpdate.push(function(session, camera) {
        const design = session.getDesignInfo()
        this.spaceComponent.width = design.resolution.x
        this.spaceComponent.height = design.resolution.y
    })
})

app.sessionComponent.setDesignSize(1136, 768, 1600, 900)

const node2 = Node.create()
node2.spaceComponent.relative.update(0, 0)
node2.spaceComponent.position.update(0, 0)
node2.spaceComponent.anchor.update(0, 0)
node2.spaceComponent.width = node2.spaceComponent.height = 50
node2.graphicsComponent.color = 'red'
scene.nodeTreeComponent.addChild(node2)

const node3 = Node.create()
node3.spaceComponent.relative.update(0, 1)
node3.spaceComponent.position.update(0, 0)
node3.spaceComponent.anchor.update(0, 1)
node3.spaceComponent.width = node3.spaceComponent.height = 50
node3.graphicsComponent.color = 'blue'
scene.nodeTreeComponent.addChild(node3)

const node4 = Node.create()
node4.spaceComponent.relative.update(1, 0)
node4.spaceComponent.position.update(0, 0)
node4.spaceComponent.anchor.update(1, 0)
node4.spaceComponent.width = node4.spaceComponent.height = 50
node4.graphicsComponent.color = 'green'
scene.nodeTreeComponent.addChild(node4)


const node5 = Node.create()
node5.spaceComponent.relative.update(1, 1)
node5.spaceComponent.position.update(0, 0)
node5.spaceComponent.anchor.update(1, 1)
node5.spaceComponent.width = node5.spaceComponent.height = 50
node5.graphicsComponent.color = 'yellow'
scene.nodeTreeComponent.addChild(node5)

app.presentScene(scene)

app.run()