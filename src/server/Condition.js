const EventEmitter = require('eventemitter3')
const debounce = require('lodash.debounce')
const dcsBiosApi = require('./dcs-bios-api')

/**
 * A Condition class that watches for updates to the output in DCS BIOS and invokes a callback if the value changes.
 */
class Condition extends EventEmitter {
  constructor(settings) {
    super()
    this.globalId = settings.globalId
    this.condition = settings.condition
    this.value = settings.value
    // An output is active if the output's value matches the condition, i.e. 'gt 5' is true if the value from
    // DCS BIOS is 7.
    this.isActive = undefined
    // We need a reference to the update function so that we can remove it with .off() when this object is destroyed. We
    // also need to re-bind it or else `this` will be dcsBiosApi instead of this object.
    this.updateFn = debounce(this.updateActiveStatus.bind(this))

    console.log('adding listener for', this.globalId)
    dcsBiosApi.on(this.globalId, this.updateFn)
  }

  updateActiveStatus(newValue) {
    let newActive = false

    switch (this.condition) {
      case 'eq':
        if (newValue.toString() === this.value) newActive = true
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
        if (newValue.toString() !== this.value) newActive = true
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
      console.log('emit isActiveChanged')
      this.emit('isActiveChanged')
    }
  }

  destroy() {
    console.log('removing listener for', this.globalId)
    dcsBiosApi.off(this.globalId, this.updateFn)
  }
}

module.exports = Condition
