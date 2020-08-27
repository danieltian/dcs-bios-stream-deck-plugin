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
      }
    })
  }

  getOutputsForModule(module) {
    return new Promise((resolve) => {
      this.sendToPlugin('getOutputs', { module }, (payload) => {
        resolve(payload.outputs)
      })
    })
  }

  getOutput(globalId) {
    return new Promise((resolve) => {
      this.sendToPlugin('getOutput', { globalId }, (payload) => {
        resolve(payload.output)
      })
    })
  }

  async sendToPlugin(action, payload, callback) {
    const requestId = short.generate()

    const message = {
      event: 'sendToPlugin',
      payload: { action, requestId, ...payload },
    }

    this.once(requestId, callback)
    await connected
    websocket.send(JSON.stringify(message))
  }
}

export default new Plugin()
