const WebSocket = require('ws')
const events = require('events')
const dcsBiosApi = require('./src/server/dcs-bios-api')
const Button = require('./src/server/Button')
const { outputLookup } = require('./src/server/dcs-bios-api/module-data')

const eventEmitter = new events.EventEmitter()
const socket = new WebSocket('ws://localhost:5555')

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

function sendCommand(event, context, payload) {
  const data = { event, context, payload }
  socket.send(JSON.stringify(data))
}

function drawImage(image, context) {
  sendCommand('setImage', context, { image, target: 0 })
}

// ---------------------------------------------------------------------------------------------------------------------
// Stream Deck key up/down processing
// ---------------------------------------------------------------------------------------------------------------------

eventEmitter.on('keyDown', ({ context }) => {
  const config = buttons.get(context).settings.inputs.press
  const id = outputLookup.get(config.globalId).control.identifier
  const action = `${id} ${config.command}`
  dcsBiosApi.sendMessage(action)
})

eventEmitter.on('keyUp', ({ context }) => {
  const config = buttons.get(context).settings.inputs.release
  const id = outputLookup.get(config.globalId).control.identifier
  const action = `${id} ${config.command}`
  dcsBiosApi.sendMessage(action)
})

dcsBiosApi.start()

// ---------------------------------------------------------------------------------------------------------------------
// Server for frontend
// ---------------------------------------------------------------------------------------------------------------------

// const server = require('http').createServer()
//
// const io = require('socket.io')(server, { serveClient: false })
//
// io.on('connection', (socket) => {})
//
// server.listen(3000)

const server = new WebSocket.Server({ port: 12345 }) // Create the server that proxies the Stream Deck WebSocket.

server.on('connection', (ws) => {
  ws.send(
    JSON.stringify({
      event: 'didReceiveSettings',
      context: currentButtonContext,
      payload: { settings: buttons.get(currentButtonContext).settings },
    })
  )

  ws.on('message', (json) => {
    socket.send(json)

    const data = JSON.parse(json)

    if (data.event === 'setSettings') {
      const button = buttons.get(currentButtonContext)

      button.destroy()
      const newButton = new Button(data.payload)
      button.on('imageChanged', (image) => {
        drawImage(image, data.context)
      })
      buttons.set(currentButtonContext, newButton)
    }
  })
})
