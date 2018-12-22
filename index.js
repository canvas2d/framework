import App from './app.js'
import Scene from './scene.js'
import Node from './node.js'

import MoveTo from './action/move_to.js'
import RotateBy from './action/rotate_by.js'
import ScaleBy from './action/scale_by.js'
import Delay from './action/delay.js'

import Sequence from './action/sequence.js'
import Repeat from './action/repeat.js'
import Spawn from './action/spawn.js'

const app = App.create()
const scene = Scene.create();

{
    const node = Node.create()

    node.graphicsComponent.color = 'red'
    node.graphicsComponent.width = node.graphicsComponent.height = 100

    node.spaceComponent.width = node.spaceComponent.height = 100
    node.spaceComponent.anchor.update(0, 0)
    node.spaceComponent.position.update(500, 100)

    scene.nodeTreeComponent.addChild(node)

    node.addAnimationSupport()

    //向左移动，移动到(0, 100)的位置,用时3000ms
    const moveLeft = MoveTo.create(0, 100, 3000)

    //向右移动，移动到(500, 100)的位置，用时3000ms
    const moveRight = MoveTo.create(500, 100, 3000)

    //将向左向右移动打包成一个序列，这样我们就可以先左移，再右移
    const sequence = Sequence.create([moveLeft, moveRight])

    //将序列动作包裹成重复动作，重复次数为无限次
    const repeat = Repeat.create(sequence, Infinity)


    //在节点的动画组件上执行repeat动作
    node.animationComponent.runAction(repeat)
}

{
    const node2 = Node.create()

    node2.graphicsComponent.color = 'blue'
    node2.graphicsComponent.width = node2.graphicsComponent.height = 50

    node2.spaceComponent.position.update(200, 200)
    node2.spaceComponent.width = node2.spaceComponent.height = 50

    scene.nodeTreeComponent.addChild(node2)

    const rotate = RotateBy.create(Math.PI, 1000)
    const scaleUp = ScaleBy.create(0.5, 0.5, 1000)
    const scaleDown = ScaleBy.create(-0.5, -0.5, 1000)
    const delay = Delay.create(3000)
    const spawn = Spawn.create([rotate, delay, Sequence.create([scaleUp, scaleDown])])
    const repeat = Repeat.create(spawn, Infinity)
    node2.addAnimationSupport()
    node2.animationComponent.runAction(repeat)
}

app.presentScene(scene)
app.run()