const EventEmitter = require('eventemitter3')

class ControlPickerEventBus extends EventEmitter {
  changeOutput(control, callback) {
    this.emit('show', control, 'output')
    this.once('selected', callback)
  }

  changeInput(control, callback) {
    this.emit('show', control, 'input')
    this.once('selected', callback)
  }
}

export default new ControlPickerEventBus()
