const WebSocket = require('ws')
const events = require('events')
const settings = require('./mock-settings.json')
const dcsBiosApi = require('./src/server/dcs-bios-api')
const Button = require('./src/server/Button')
const { outputLookup } = require('./src/server/dcs-bios-api/module-data')

const eventEmitter = new events.EventEmitter()
const socket = new WebSocket('ws://localhost:5555')

socket.on('message', (message) => {
  const data = JSON.parse(message)
  console.log(message)
  eventEmitter.emit(data.event, data)
})

let flags
let buttons = {}
let currentButtonContext

// ---------------------------------------------------------------------------------------------------------------------
// Process messages from Stream Deck
// ---------------------------------------------------------------------------------------------------------------------

eventEmitter.on('register', (data) => {
  flags = data
})

eventEmitter.on('willAppear', (data) => {
  buttons[data.context] = new Button(data.payload.settings)
})

eventEmitter.on('willDisappear', (data) => {
  buttons[data.context].destroy()
  delete buttons[data.context]
})

eventEmitter.on('propertyInspectorDidAppear', (data) => {
  currentButtonContext = data.context
})

function sendCommand(event, context, payload) {
  const data = { event, context, payload }
  socket.send(JSON.stringify(data))
}

function drawImage(image) {
  sendCommand('setImage', '5B0948D5AEE897C2C64A43F15D477EC6', { image, target: 0 })
}

// ---------------------------------------------------------------------------------------------------------------------
// Image drawing
// ---------------------------------------------------------------------------------------------------------------------

const button = new Button(settings)

button.on('imageChanged', (image) => drawImage(image))

// ---------------------------------------------------------------------------------------------------------------------
// Stream Deck key up/down processing
// ---------------------------------------------------------------------------------------------------------------------

eventEmitter.on('keyDown', () => {
  const id = outputLookup[settings.inputs.pressed.globalId].control.identifier
  const action = `${id} ${settings.inputs.pressed.command}`
  dcsBiosApi.sendMessage(action)
})

eventEmitter.on('keyUp', () => {
  const id = outputLookup[settings.inputs.released.globalId].control.identifier
  const action = `${id} ${settings.inputs.released.command}`
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
      payload: { settings: buttons[currentButtonContext].settings },
    })
  )

  ws.on('message', (json) => {
    socket.send(json)

    const data = JSON.parse(json)

    if (data.event === 'setSettings') {
      buttons[currentButtonContext].destroy()
      buttons[currentButtonContext] = new Button(data.payload)
    }
  })
})
