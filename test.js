const WebSocket = require('ws')
const events = require('eventemitter3')
const dcsBiosApi = require('./src/server/dcs-bios-api')
const Button = require('./src/server/Button')
const { modules, outputLookup, inputLookup } = require('./src/server/dcs-bios-api/module-data')

const eventEmitter = new events.EventEmitter()
const socket = new WebSocket('ws://localhost:5656')

socket.on('message', (message) => {
  const data = JSON.parse(message)
  eventEmitter.emit(data.event, data)
})

let flags
let buttons = new Map()
let currentButtonContext

// ---------------------------------------------------------------------------------------------------------------------
// Process messages from Stream Deck
// ---------------------------------------------------------------------------------------------------------------------

eventEmitter.on('register', (data) => {
  flags = data
})

eventEmitter.on('willAppear', (data) => {
  const button = new Button(data.payload.settings)
  button.on('imageChanged', (image) => drawImage(image, data.context))
  console.log('willAppear', data.context)
  button.buttonReady().then((image) => drawImage(image, data.context))
  buttons.set(data.context, button)
})

eventEmitter.on('willDisappear', (data) => {
  const button = buttons.get(data.context)

  if (button) {
    button.destroy()
    buttons.delete(button)
  }
})

eventEmitter.on('propertyInspectorDidAppear', (data) => {
  currentButtonContext = data.context
})

eventEmitter.on('didReceiveSettings', (data) => {
  const button = new Button(data.payload.settings)
  button.on('imageChanged', (image) => drawImage(image, data.context))
  buttons.set(data.context, button)
})

function sendCommand(event, context, payload) {
  const data = { event, context, payload }
  socket.send(JSON.stringify(data))
}

function drawImage(image, context) {
  sendCommand('setImage', context, { image })
}

// ---------------------------------------------------------------------------------------------------------------------
// Stream Deck key up/down processing
// ---------------------------------------------------------------------------------------------------------------------

eventEmitter.on('keyDown', ({ context }) => {
  const configs = buttons.get(context).settings.inputs.press || []

  configs.forEach((config) => {
    const id = inputLookup.get(config.globalId).id
    const action = `${id} ${config.command}`
    dcsBiosApi.sendMessage(action)
  })
})

eventEmitter.on('keyUp', ({ context }) => {
  const configs = buttons.get(context).settings.inputs.release || []

  configs.forEach((config) => {
    const id = inputLookup.get(config.globalId).id
    const action = `${id} ${config.command}`
    dcsBiosApi.sendMessage(action)
  })
})

dcsBiosApi.start()

// ---------------------------------------------------------------------------------------------------------------------
// Server for frontend
// ---------------------------------------------------------------------------------------------------------------------

const watched = new Map()
const server = new WebSocket.Server({ port: 12345 }) // Create the server that proxies the Stream Deck WebSocket.

server.on('connection', (ws) => {
  ws.send(
    JSON.stringify({
      event: 'didReceiveSettings',
      context: currentButtonContext,
      payload: { settings: buttons.has(currentButtonContext) ? buttons.get(currentButtonContext).settings : undefined },
    })
  )

  eventEmitter.on('propertyInspectorDidAppear', (data) => {
    ws.send(
      JSON.stringify({
        event: 'didReceiveSettings',
        context: data.context,
        payload: { settings: buttons.get(currentButtonContext).settings },
      })
    )
  })

  ws.on('message', (json) => {
    socket.send(json)

    const data = JSON.parse(json)

    if (data.event === 'setSettings') {
      const button = buttons.get(currentButtonContext)
      button.destroy()
      buttons.delete(button)
      const newButton = new Button(data.payload)
      button.on('imageChanged', (image) => drawImage(image, data.context))
      buttons.set(currentButtonContext, newButton)
    } else if (data.event === 'sendToPlugin') {
      if (data.payload.action === 'getOutput') {
        const output = outputLookup.get(data.payload.globalId)
        ws.send(
          JSON.stringify({
            event: 'sendToPropertyInspector',
            payload: { responseFor: data.payload.requestId, data: output },
          })
        )
      } else if (data.payload.action === 'getInput') {
        const input = inputLookup.get(data.payload.globalId)
        ws.send(
          JSON.stringify({
            event: 'sendToPropertyInspector',
            payload: { responseFor: data.payload.requestId, data: input },
          })
        )
      } else if (data.payload.action === 'getOutputs') {
        const module = modules.get(data.payload.module)
        ws.send(
          JSON.stringify({
            event: 'sendToPropertyInspector',
            payload: { responseFor: data.payload.requestId, data: module.outputs },
          })
        )
      } else if (data.payload.action === 'getInputs') {
        const module = modules.get(data.payload.module)
        ws.send(
          JSON.stringify({
            event: 'sendToPropertyInspector',
            payload: { responseFor: data.payload.requestId, data: module.inputs },
          })
        )
      } else if (data.payload.action === 'getModules') {
        const moduleNames = [...modules.keys()]
        ws.send(
          JSON.stringify({
            event: 'sendToPropertyInspector',
            payload: { responseFor: data.payload.requestId, data: moduleNames },
          })
        )
      } else if (data.payload.action === 'watch') {
        const { globalId } = data.payload
        if (watched.has(globalId)) {
          watched.get(globalId).count += 1
        } else {
          const fn = (value) => {
            ws.send(
              JSON.stringify({
                event: 'sendToPropertyInspector',
                payload: { event: 'update', globalId, value },
              })
            )
          }

          watched.set(data.payload.globalId, { count: 1, callback: fn })
          dcsBiosApi.on(data.payload.globalId, fn)
        }
      } else if (data.payload.action === 'unwatch') {
        const { globalId } = data.payload
        const watcher = watched.get(globalId)
        watcher.count -= 1

        if (watcher.count <= 0) {
          dcsBiosApi.off(globalId, watcher.callback)
          watched.delete(globalId)
        }
      }
    }
  })
})
