import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'
import Texture from './common/texture.js'
import ImageLoader from './util/image_loader.js'
import Ajax from './util/ajax.js'
import PlistParser from './util/plist_parser.js'
import FrameChange from './action/frame_change.js'

const app = App.create()
const scene = Scene.create()

const node = Node.create()

node.spaceComponent.position.update(300, 300)
node.spaceComponent.width = node.spaceComponent.height = 50

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

app.presentScene(scene)
app.run()