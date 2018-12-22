import App from './app.js'
import Scene from './scene.js'

const app = App.create()
const scene = Scene.create()
app.presentScene(scene)
app.run()