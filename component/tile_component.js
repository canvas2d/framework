import ImageLoader from '../util/image_loader.js'
import Ajax from '../util/ajax.js'
import NodeTreeComponent from './node_tree_component.js'

const cache = []
class TileComponent {
    constructor() {}
    init(scene) {
        this.host = scene
        this.imageLoaded = false
        this.nodeTreeComponent = NodeTreeComponent.create(this)
        return this
    }
    async load(url) {
        const json = JSON.parse(await Ajax.get(url))
        this.json = json
        this.layers = this.initLayers(json)
        this.image = null
        this.imageUrl = json.tilesets && json.tilesets[0] && json.tilesets[0].image

        this.tilewidthI = 1 / json.tilewidth
        this.tileheightI = 1 / json.tileheight
        this.width = json.tilewidth * json.width
        this.height = json.tileheight * json.height
    }
    initLayers(tiledMap) {
        const mapLayers = tiledMap.layers
        const tileheight = tiledMap.tileheight
        const tilewidth = tiledMap.tilewidth
        const layers = []
        const tileset = tiledMap.tilesets[0]
        const countX = (tileset.imagewidth / tileset.tilewidth) | 0
        const countY = (tileset.imageheight / tileset.tileheight) | 0
        const countXI = 1 / countX
        const countYI = 1 / countY
        const image = tileset.image
        const firstgid = tileset.firstgid
        const tileoffset = tileset.tileoffset
        for (let a = 0, b = mapLayers.length; a < b; a++) {
            const layer = mapLayers[a]
            const layerwidth = layer.width
            const layerheight = layer.height
            if (!layer.visible) {
                continue
            }
            switch (layer.type) {
                case 'tilelayer':
                    const items = []
                    const layerData = {
                        tilewidth: tilewidth,
                        tileheight: tileheight,

                        name: layer.name,

                        width: layer.width,
                        height: layer.height,

                        opacity: layer.opacity,
                        type: layer.type,
                        visible: layer.visible,

                        x: layer.x,
                        y: layer.y,

                        items: items
                    }

                    layers.push(layerData)
                    const data = layer.data
                    let x = 0,
                        y = 0
                    for (let i = 0, j = data.length; i < j; i++) {
                        let gid = data[i]
                        if (gid > 0) {
                            gid -= firstgid
                            items.push([
                                gid, //x, y,
                                (gid % countX) * tileset.tilewidth - tileoffset.x, ((gid * countXI) | 0) * tileset.tileheight + tileoffset.y,
                                tilewidth, tileheight,
                                x * tilewidth, y * tileheight
                            ])
                        } else {
                            items.push(null)
                        }

                        if (++x == layerwidth) {
                            x = 0
                            y++
                        }
                    }
                    break
                case 'objectgroup':
                    for (let i = 0, j = layer.objects.length; i < j; i++) {
                        const object = layer.objects[i]
                        const gid = object.gid
                        if (gid > 0) {
                            continue
                        }
                    }
                    console.log('objectgroup not support')
                    break
            }
        }
        return layers
    }
    update() {
        // console.log('TileComponent update')
    }
    handleInteractive() {}
    render(session, camera, alpha) {
        if (!this.imageUrl) {
            return
        }
        if (!this.image) {
            if (!this.imageLoaded) {
                this.imageLoaded = true
                ImageLoader.load(this.imageUrl).then((image) => {
                    this.image = image
                })
            }
            return
        }
        const layers = this.layers
        const x1 = camera.frame.x1,
            y1 = camera.frame.y1,
            x2 = camera.frame.x2,
            y2 = camera.frame.y2
        session.setAlpha(alpha)
        session.setTransformMatrix(camera._matrixI)
        for (let i = 0, j = layers.length; i < j; i++) {
            this.renderLayer(
                session,
                layers[i],
                this.image,
                (x1 * this.tilewidthI) | 0,
                Math.ceil(x2 * this.tilewidthI),
                (y1 * this.tilewidthI) | 0,
                Math.ceil(y2 * this.tilewidthI)
            )
        }
    }
    renderLayer(session, layer, texture, xMin, xMax, yMin, yMax) {
        const items = layer.items
        for (var i = yMin; i < yMax; i++) {
            const startIndex = i * layer.width
            for (var j = xMin; j < xMax; j++) {
                const cell = items[startIndex + j]
                if (cell) {
                    session.drawImage(texture,
                        cell[1], cell[2], cell[3], cell[4],
                        cell[5] - 1, cell[6] - 1, cell[3] + 2, cell[4] + 2
                    )
                }
            }
        }
    }
    remove() {
        this.host = null
        this._collect()
    }
    _collect() {
        TileComponent.collect(this)
    }
    static create(scene) {
        return (cache.length ? cache.pop() : new TileComponent).init(scene)
    }
    static collect(item) {
        cache.push(item)
    }
}
export default TileComponent