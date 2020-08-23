const EventEmitter = require('events')
const debounce = require('lodash.debounce')
const dcsBiosApi = require('./dcs-bios-api')

/**
 * An Output class that watches for updates to the output in DCS BIOS and invokes a callback if the value changes.
 */
class Output extends EventEmitter {
  constructor(settings) {
    super()
    this.globalId = settings.globalId
    this.condition = settings.condition
    this.value = settings.value
    // An output is active if the output's value matches the condition, i.e. 'gt 5' is true if the value from
    // DCS BIOS is 7.
    this.isActive = false
    // We need a reference to the update function so that we can remove it with .off() when this object is destroyed. We
    // also need to re-bind it or else `this` will be dcsBiosApi instead of this object.
    this.updateFn = debounce(this.updateActiveStatus.bind(this))

    dcsBiosApi.on(this.globalId, this.updateFn)
  }

  updateActiveStatus(newValue) {
    let newActive = false

    switch (this.condition) {
      case 'eq':
        if (newValue === this.value) newActive = true
        break
      case 'gt':
        if (newValue > this.value) newActive = true
        break
      case 'lt':
        if (newValue < this.value) newActive = true
        break
      case 'gte':
        if (newValue >= this.value) newActive = true
        break
      case 'lte':
        if (newValue <= this.value) newActive = true
        break
      case 'neq':
        if (newValue !== this.value) newActive = true
        break
      case 'contains':
        if (newValue.includes(this.value)) newActive = true
        break
      case 'notcontains':
        if (!newValue.includes(this.value)) newActive = true
        break
    }

    if (this.isActive !== newActive) {
      this.isActive = newActive
      this.emit('isActiveChanged')
    }
  }

  destroy() {
    dcsBiosApi.off(this.globalId, this.updateFn)
  }
}

module.exports = Output
