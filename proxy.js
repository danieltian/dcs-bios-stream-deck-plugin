const WebSocket = require('ws')
const chalk = require('chalk')

const flags = {}
let currentFlag

// Process all the flags passed in from the Stream Deck.
process.argv.forEach((argument) => {
  // If argument starts with -, this is a flag.
  if (argument.startsWith('-')) {
    currentFlag = argument.slice(1, argument.length) // Get the flag name without the dash.
  }
  // If we previously had a flag, this argument is the value for the flag.
  else if (currentFlag) {
    flags[currentFlag] = argument
    currentFlag = undefined
  }
})

console.log(chalk`{redBright [Flags]} ${JSON.stringify(flags)}`)

const messages = []
const server = new WebSocket.Server({ port: 5555 }) // Create the server that proxies the Stream Deck WebSocket.
const streamDeckSocket = new WebSocket(`ws://localhost:${flags.port}`) // Connect to the Stream Deck WebSocket.

server.on('connection', (ws) => {
  console.log(chalk.cyanBright('client connected'))
  messages.forEach((message) => ws.send(message)) // When the client connects, immediately send the saved messages.
  ws.on('message', (message) => {
    console.log(chalk`{greenBright [Client]} ${message}`)
    streamDeckSocket.send(message)
  }) // Send received messages to the Stream Deck socket.
})

// When the connection is open, send the registration command.
streamDeckSocket.on('open', () => {
  const data = { event: flags.registerEvent, uuid: flags.pluginUUID }
  streamDeckSocket.send(JSON.stringify(data))
})

streamDeckSocket.on('message', (message) => {
  console.log(chalk`{yellowBright [Stream Deck]} ${message}`)
  messages.push(message)
  server.clients.forEach((client) => {
    if (client !== server && client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
})
