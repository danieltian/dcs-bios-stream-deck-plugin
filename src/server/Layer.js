const EventEmitter = require('eventemitter3')
const debounce = require('lodash.debounce')
const Condition = require('./Condition')
const Konva = require('konva-node')

function isTrue(x) {
  return x === true
}

/**
 * A Layer class that watches its conditions for changes and emits an event if any/all of the conditions are active. An
 * active condition is one that matches the configuration of the condition.
 */
class Layer extends EventEmitter {
  constructor(settings) {
    super()
    this.name = settings.name
    this.conditionLogic = settings.conditionLogic

    this.isVisible = undefined
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

    // Create condition objects for every output setting from the JSON.
    this.conditions = settings.conditions.map((config) => {
      const condition = new Condition(config)
      condition.on('isActiveChanged', this.updateFn)

      return condition
    })
  }

  async updateVisibility() {
    const isActiveStates = this.conditions.map((x) => x.isActive)
    let newVisible = this.conditionLogic === 'AND' ? isActiveStates.every(isTrue) : isActiveStates.some(isTrue)

    if (this.isVisible !== newVisible) {
      this.isVisible = newVisible

      const node = await this.nodePromise
      console.log(`setting ${this.name} visibility to ${newVisible}`)
      node.visible(newVisible)
      this.emit('isVisibleChanged')
    }
  }

  destroy() {
    this.conditions.forEach((condition) => {
      condition.off('isActiveChanged', this.updateFn)
      condition.destroy()
    })
  }
}

module.exports = Layer
