import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import Texture from './common/texture.js'
import ImageLoader from './util/image_loader.js'

const app = App.create()
const scene = Scene.create()

const node = Node.create()

node.addHookSupport()
ImageLoader.load('./resource/1136_768.jpg').then(function(img) {
    node.graphicsComponent.texture = Texture.create(img)
    node.spaceComponent.anchor.update(0, 0)
    node.hookComponent.onUpdate.push(function(session, camera) {
        const design = session.getDesignInfo()

        this.spaceComponent.width = design.resolution.x
        this.spaceComponent.height = design.resolution.y
    })

    scene.nodeTreeComponent.addChild(node)
})
app.sessionComponent.setDesignSize(1136, 768, 1600, 900)

app.presentScene(scene)
app.run()