const WebSocket = require('ws')
const events = require('events')
const Konva = require('konva-node')
const settings = require('./mock-settings.json')
const dcsBiosApi = require('./src/server/dcs-bios-api')
const Layer = require('./src/server/Layer')
const { outputLookup } = require('./src/server/dcs-bios-api/module-data')

const eventEmitter = new events.EventEmitter()
const socket = new WebSocket('ws://localhost:5555')

socket.on('message', (message) => {
  const data = JSON.parse(message)
  console.log(message)
  eventEmitter.emit(data.event, data)
})

let flags
let buttons = []

eventEmitter.on('register', (data) => {
  flags = data
})

eventEmitter.on('willAppear', (data) => {
  buttons.push(data)
})

eventEmitter.on('willDisappear', (data) => {
  buttons = buttons.filter((x) => x.context !== data.context)
})

function sendCommand(event, context, payload) {
  const data = { event, context, payload }
  socket.send(JSON.stringify(data))
}

function getGlobalSettings() {
  eventEmitter.once('didReceiveGlobalSettings', ({ payload }) => {
    console.log('got global settings', payload.settings)
  })

  sendCommand('getGlobalSettings', flags.pluginUUID)
}

function drawImage(image) {
  sendCommand('setImage', '5B0948D5AEE897C2C64A43F15D477EC6', { image, target: 0 })
}

const stage = new Konva.Stage({
  width: 72,
  height: 72,
})

const konvaLayer = new Konva.Layer()
stage.add(konvaLayer)

const layers = settings.layers.map((layerData) => new Layer(layerData))

layers.forEach((layer) => {
  layer.imagePromise.then((imageNode) => {
    konvaLayer.add(imageNode)

    layer.on('isVisibleChanged', (isVisible) => {
      imageNode.visible(isVisible)
      imageNode.draw()
      drawImage(stage.toDataURL())
    })
  })
})

eventEmitter.on('keyDown', () => {
  const id = outputLookup[settings.actions.pressed.globalId].control.identifier
  const action = `${id} ${settings.actions.pressed.command}`
  dcsBiosApi.sendMessage(action)
})

eventEmitter.on('keyUp', () => {
  const id = outputLookup[settings.actions.pressed.globalId].control.identifier
  const action = `${id} ${settings.actions.released.command}`
  dcsBiosApi.sendMessage(action)
})

dcsBiosApi.start()
