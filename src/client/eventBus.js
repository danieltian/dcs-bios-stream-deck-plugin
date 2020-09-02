const EventEmitter = require('eventemitter3')

class EventBus extends EventEmitter {
  changeOutput(control) {
    return new Promise((resolve) => {
      this.emit('show', control, 'output')
      this.once('selected', (control) => resolve(control))
    })
  }

  changeInput(control) {
    return new Promise((resolve) => {
      this.emit('show', control, 'input')
      this.once('selected', (control) => resolve(control))
    })
  }

  changeImage() {
    return new Promise((resolve) => {
      this.emit('selectImage')
      this.once('imageSelected', (imageData) => resolve(imageData))
    })
  }
}

export default new EventBus()
