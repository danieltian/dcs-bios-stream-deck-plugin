const dcsBiosApi = require('./dcs-bios-api')

/**
 * An Output class that watches for updates to the output in DCS BIOS and invokes a callback if the value changes.
 */
class Output {
  constructor(settings, onIsActiveChangedCallback) {
    this.globalId = settings.globalId
    this.condition = settings.condition
    this.expected = settings.expected
    this.onIsActiveChangedCallback = onIsActiveChangedCallback
    // An output is active if the output's value matches the expected condition, i.e. 'gt 5' is true if the value from
    // DCS BIOS is 7.
    this.isActive = false
    // We need a reference to the update function so that we can remove it with .off() when this object is destroyed. We
    // also need to re-bind it or else `this` will be dcsBiosApi instead of this object.
    this.updateFn = this.updateActiveStatus.bind(this)

    dcsBiosApi.on(this.globalId, this.updateFn)
  }

  updateActiveStatus(newValue) {
    let newActive = false

    switch (this.condition) {
      case 'eq':
        if (newValue === this.expected) newActive = true
        break
      case 'gt':
        if (newValue > this.expected) newActive = true
        break
      case 'lt':
        if (newValue < this.expected) newActive = true
        break
      case 'gte':
        if (newValue >= this.expected) newActive = true
        break
      case 'lte':
        if (newValue <= this.expected) newActive = true
        break
      case 'neq':
        if (newValue !== this.expected) newActive = true
        break
      case 'contains':
        if (newValue.includes(this.expected)) newActive = true
        break
      case 'notcontains':
        if (!newValue.includes(this.expected)) newActive = true
        break
    }

    if (this.isActive !== newActive) {
      this.isActive = newActive
      this.onIsActiveChangedCallback()
    }
  }

  destroy() {
    dcsBiosApi.off(this.globalId, this.updateFn)
  }
}

module.exports = Output
