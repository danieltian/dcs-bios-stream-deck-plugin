const WebSocket = require('ws')

new WebSocket.Server({ port: 5555 })

new WebSocket('ws://localhost:5555')
