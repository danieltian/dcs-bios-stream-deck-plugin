const fs = require('fs')
const WebSocket = require('ws')

function processCliArguments() {
  const flags = {}
  let currentFlag

  process.argv.forEach((argument) => {
    // If argument starts with -, this is a flag.
    if (argument.startsWith('-')) {
      currentFlag = argument.slice(1, argument.length) // Get the flag name without the dash.
    }
    // If we have a flag, this is the value for the flag. Set it.
    else if (currentFlag) {
      flags[currentFlag] = argument
      currentFlag = undefined
    }
  })

  return flags
}

function connectToStreamDeck(flags) {
  const websocket = new WebSocket(`ws://localhost:${flags.port}`)

  websocket.on('open', () => {
    const data = {
      event: flags.registerEvent,
      uuid: flags.pluginUUID,
    }

    websocket.send(JSON.stringify(data))
  })

  return websocket
}

const flags = processCliArguments()
const streamDeck = connectToStreamDeck(flags)

streamDeck.on('message', (data) => {
  fs.appendFileSync('test.txt', JSON.stringify(data))
})
