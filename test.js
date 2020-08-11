const WebSocket = require('ws')

const proxy = new WebSocket('ws://localhost:5555')
proxy.onmessage = (e) => connectToStreamDeck(e)

function connectToStreamDeck({ data }) {
  const flags = JSON.parse(data)
  console.log(flags)
  const websocket = new WebSocket(`ws://localhost:${flags.port}`)

  websocket.onopen = () => {
    const data = {
      event: flags.registerEvent,
      uuid: flags.pluginUUID,
    }

    console.log('sending data')
    websocket.send(JSON.stringify(data))
  }

  websocket.onmessage = ({ data }) => {
    console.log(data)
  }
}
