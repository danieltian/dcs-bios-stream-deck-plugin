const EventEmitter = require('eventemitter3')

class ControlPicker extends EventEmitter {
  changeControl(control, callback) {
    this.emit('show', control)
    this.once('selected', callback)
  }
}

export default new ControlPicker()
