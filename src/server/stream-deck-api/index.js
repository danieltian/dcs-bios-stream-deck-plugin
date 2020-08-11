const streamDeck = require('./stream-deck')

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
  const websocket = new WebSocket(`ws://localhost:${inPort}`)

  // Register with the Stream Deck.
  websocket.onopen = () => {
    const json = { event: inRegisterEvent, uuid: inPluginUUID }
    websocket.send(JSON.stringify(json))
  }

  websocket.onmessage = (event) => {
    console.log('message', event)
  }
}
