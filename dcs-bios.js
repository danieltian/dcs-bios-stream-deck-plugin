const WebSocket = require('ws')

const websocket = new WebSocket('ws://localhost:5010/api/websocket', { origin: 'http://localhost:5010' })

websocket.on('open', () => {
  websocket.send(JSON.stringify({ datatype: 'live_data', data: {} }))
})

websocket.on('message', (message) => {
  console.log('message', message)
})
