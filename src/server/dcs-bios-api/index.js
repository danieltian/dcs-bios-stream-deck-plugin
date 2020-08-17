const { addressLookup } = require('./module-data')
const udpClient = require('./udp-multicast-client')
const chalk = require('chalk')
const BufferReader = require('./BufferReader')
const EventEmitter = require('events')

/*
Global modules are modules that get updated regardless of which aircraft is currently in use. Because multiple aircraft
can share the same addresses with each other, we normally need to check if the controls we're updating at an address are
for the currently-flown aircraft, but we don't do this check for global modules and always update their controls.
 */
const globalModules = ['MetadataStart', 'CommonData', 'NS430']
const updatedOutputs = new Set()

/**
 * Check if the passed-in output data is for the current module (the current aircraft being flown).
 * @param output output data to check
 * @returns {boolean} whether the output data is for the current module
 */
function isOutputForCurrentModule(output) {
  return output.module === addressLookup[0][0].value || globalModules.includes(output.module)
}

/**
 * Parse the update message from DCS BIOS and update the out values.
 * @param message message from DCS BIOS
 * @param onUpdatesCallback callback to invoke once a sync command is reached
 */
function parseMessage(message, onUpdatesCallback) {
  const reader = new BufferReader(message)

  if (reader.bytesLeft() < 4) {
    console.log(chalk.red('incomplete message received from UDP client: length is < 4'))
    return
  }

  // Go through each update block in the message. A message can contain multiple updates.
  while (reader.bytesLeft()) {
    let address = reader.readWord() // Address of data that we're updating.
    let count = reader.readWord() // Number of words that we're updating.

    // If this is a sync command (updates are complete for this frame), we are safe to invoke the callback.
    if (address === 0x5555 && count === 0x5555) {
      onUpdatesCallback(Array.from(updatedOutputs))
      updatedOutputs.clear() // Clear the updated outputs in preparation for the next message.
      continue
    }

    // Process the update block.
    while (count) {
      let controlAddress = address
      // Find the closest address that has controls. This is needed for partial string updates where the address from
      // the message won't match up with an address in the address lookup, so we need to get the closest one to the
      // current address.
      while (!addressLookup[controlAddress]) {
        controlAddress = controlAddress - 2
      }

      const outputs = addressLookup[controlAddress]
      const rawValue = reader.readWord()

      // For each output in the address, process the updated value and add the output to the update queue if its value
      // has been changed. Each address can contain multiple outputs.
      outputs.forEach((output) => {
        if (!isOutputForCurrentModule(output)) return

        let newValue
        // Output is a string, treat the new value as a partial string update.
        if (output.type === 'string') {
          // Create a buffer from the existing string, write the updated data to it, then convert it back to a string.
          // Buffer size needs to be the rounded to the next highest even number because of <fill out description here>.
          const bufferSize = Math.ceil(output.max_length / 2) * 2
          const buffer = Buffer.alloc(bufferSize, ' ')
          buffer.write(output.value || '')
          buffer.writeUInt16LE(rawValue, address - controlAddress)
          newValue = buffer.toString('utf8', 0, output.max_length).replace(/\0/g, '').trim()
        }
        // This is a number, get the value using the mask and the bit shift amount.
        else {
          newValue = (rawValue & output.mask) >> output.shift_by
        }

        // Only add the output to the updated outputs if the value changed. DCS BIOS will periodically re-send the
        // value for each output, even if it hasn't changed.
        if (output.value !== newValue) {
          output.value = newValue
          updatedOutputs.add(output)
        }
      })

      count = count - 2
      address = address + 2
    }
  }
}

class DcsBiosApi extends EventEmitter {
  /**
   * Start listening for new messages from DCS BIOS.
   * @param onUpdatesCallback - callback to invoke on control updates
   */
  start() {
    udpClient.start((x) =>
      parseMessage(x, (updatedOutputs) => {
        updatedOutputs.forEach((output) => {
          this.emit(output.globalId, output.value)
        })
      })
    )
  }

  /**
   * Send a message to DCS BIOS.
   * @param message - message to send
   */
  sendMessage(message) {
    console.log('sending message', message)
    return udpClient.sendMessage(message.trim() + '\n')
  }
}

module.exports = new DcsBiosApi()
