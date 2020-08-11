// var json = {
//   "event": "setImage",
//   "context": opaqueValue,
//   "payload": {
//     "image": <base64 encoded image>,
//       "target": software, hardware or both,
//       "state": 0-based integer
//       }
//       };

module.exports = class StreamDeckApi {
  constructor(websocket, pluginUUID) {
    this.pluginUUID = pluginUUID
    this.websocket = websocket

    websocket.on
  }

  const websocket = new WebSocket(`ws://localhost:${inPort}`)

  // Register with the Stream Deck.
  websocket.onopen = () => {
    const json = { event: inRegisterEvent, uuid: inPluginUUID }
    websocket.send(JSON.stringify(json))
  }

  sendMessage(event, context, payload) {
    const data = { event, context, payload }
    this.websocket.send(JSON.stringify(data))
  }
}
