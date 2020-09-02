const EventEmitter = require('eventemitter3')
const short = require('short-uuid')

const websocket = new WebSocket('ws://localhost:12345')

const connected = new Promise((resolve) => {
  websocket.addEventListener('open', resolve)
})

class Plugin extends EventEmitter {
  constructor() {
    super()

    websocket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data)

      if (message.event === 'sendToPropertyInspector' && message.payload.responseFor) {
        this.emit(message.payload.responseFor, message.payload)
      } else if (message.event === 'didReceiveSettings') {
        this.emit('didReceiveSettings', message)
      } else if (message.payload.event === 'update') {
        this.emit(message.payload.globalId, message.payload.value)
      }
    })
  }

  getOutputsForModule(module) {
    return this.sendToPlugin('getOutputs', { module })
  }

  getInputsForModule(module) {
    return this.sendToPlugin('getInputs', { module })
  }

  getOutput(globalId) {
    return this.sendToPlugin('getOutput', { globalId })
  }

  getInput(globalId) {
    return this.sendToPlugin('getInput', { globalId })
  }

  getModules() {
    return this.sendToPlugin('getModules')
  }

  sendToPlugin(action, payload) {
    return new Promise((resolve) => {
      const requestId = short.generate()

      const message = {
        event: 'sendToPlugin',
        payload: { action, requestId, ...payload },
      }

      this.once(requestId, (payload) => resolve(payload.data))

      connected.then(() => {
        websocket.send(JSON.stringify(message))
      })
    })
  }

  saveSettings(settings, context) {
    const data = {
      event: 'setSettings',
      context,
      payload: settings,
    }
    websocket.send(JSON.stringify(data))
  }

  watch(globalId, callback) {
    const data = {
      event: 'sendToPlugin',
      payload: { action: 'watch', globalId },
    }
    websocket.send(JSON.stringify(data))
    this.on(globalId, callback)
  }

  unwatch(globalId, callback) {
    const data = {
      event: 'sendToPlugin',
      payload: { action: 'unwatch', globalId },
    }
    websocket.send(JSON.stringify(data))
    this.off(globalId, callback)
  }
}

export default new Plugin()
