const EventEmitter = require('events')
const debounce = require('lodash.debounce')
const Output = require('./Output')
const Konva = require('konva-node')

function isTrue(x) {
  return x === true
}

/**
 * A Layer class that watches its outputs for changes and emits an event if any/all of the outputs are active. An active
 * output is one that matches the output condition that it's configured with.
 */
class Layer extends EventEmitter {
  constructor(settings) {
    super()
    this.outputLogic = settings.outputLogic

    this.isVisible = false
    // We need a reference to the update function so that we can remove it with .off() when this object is destroyed. We
    // also need to re-bind it or else `this` will be dcsBiosApi instead of this object.
    this.updateFn = debounce(this.updateVisibility.bind(this))
    // Load the image as a Konva node that's initially hidden. Needs to be a promise because it's asynchronous.
    this.nodePromise = new Promise((resolve) => {
      Konva.Image.fromURL(settings.image, (imageNode) => {
        imageNode.setAttrs(settings.source)
        resolve(imageNode)
      })
    })

    // Create output objects for every output setting from the JSON.
    this.outputs = settings.outputs.map((outputSettings) => {
      const output = new Output(outputSettings)
      output.on('isActiveChanged', this.updateFn)

      return output
    })
  }

  async updateVisibility() {
    const isActiveStates = this.outputs.map((x) => x.isActive)
    let newVisible = this.outputLogic === 'AND' ? isActiveStates.every(isTrue) : isActiveStates.some(isTrue)

    if (this.isVisible !== newVisible) {
      this.isVisible = newVisible

      const node = await this.nodePromise
      node.visible(newVisible)
      this.emit('isVisibleChanged')
    }
  }

  destroy() {
    this.outputs.forEach((output) => {
      output.off('isActiveChanged', this.updateFn)
      output.destroy()
    })
  }
}

module.exports = Layer
