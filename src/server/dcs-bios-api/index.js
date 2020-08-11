const { addressLookup } = require('./module-data')
const udpClient = require('./udp-multicast-client')
const chalk = require('chalk')
const BufferReader = require('./BufferReader')

/*
Global modules are modules that get updated regardless of which aircraft is currently in use. Because multiple aircraft
can share the same addresses with each other, we normally need to check if the controls we're updating at an address are
for the currently-flown aircraft, but we don't do this check for global modules and always update their controls.
 */
const globalModules = ['MetadataStart', 'MetadataEnd', 'CommonData', 'NS430']
const updatedOutputs = new Set()

function isOutputForCurrentModule(output) {
  return output.module === addressLookup[0][0].value || globalModules.includes(output.module)
}

module.exports = {
  /**
   * Start listening for new messages from DCS BIOS.
   * @param onUpdatesCallback - callback to invoke on control updates
   */
  start(onUpdatesCallback) {
    udpClient.start((x) => this.parseMessage(x, onUpdatesCallback))
  },

  /**
   * Send a message to DCS BIOS.
   * @param message - message to send
   */
  sendMessage(message) {
    return udpClient.sendMessage(message.trim() + '\n')
  },

  /** Parse the message from DCS BIOS.
   * @param message - DCS BIOS export message
   * @param onUpdatesCallback - callback to invoke on control updates
   */
  parseMessage(message, onUpdatesCallback) {
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
            const buffer = Buffer.alloc(output.max_length, ' ')
            buffer.write(output.value || '')
            buffer.writeUInt16LE(rawValue, address - controlAddress)
            newValue = buffer.toString().replace(/\0/g, '').trim()
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
  },
}
