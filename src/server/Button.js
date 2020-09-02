const EventEmitter = require('eventemitter3')
const Konva = require('konva-node')
const debounce = require('lodash.debounce')
const merge = require('lodash.merge')
const Layer = require('./Layer')

const defaultSettings = {
  layers: [],
  inputs: {
    press: [],
    release: [],
  },
}

class Button extends EventEmitter {
  constructor(settings) {
    super()
    this.settings = merge({}, defaultSettings, settings)
    this.drawFn = debounce(this.emitDraw.bind(this))

    // Create the Konva objects we need to draw the layer images.
    this.stage = new Konva.Stage({ width: 72, height: 72 })
    const konvaLayer = new Konva.Layer({ listening: false })
    this.stage.add(konvaLayer)

    this.layers = (settings.layers || []).map((layerSettings) => {
      const layer = new Layer(layerSettings)

      layer.nodePromise.then((imageNode) => {
        konvaLayer.add(imageNode)
        layer.on('isVisibleChanged', this.drawFn)
      })

      return layer
    })
  }

  emitDraw() {
    this.emit('imageChanged', this.stage.toDataURL())
  }

  buttonReady() {
    return Promise.all(this.layers.map((x) => x.nodePromise)).then(() => this.stage.toDataURL())
  }

  destroy() {
    this.layers.forEach((layer) => {
      layer.off('isVisibleChanged', this.drawFn)
      layer.destroy()
    })
  }
}

module.exports = Button
