const aircraftData = require('./aircraft-data')
const udpClient = require('./udp-multicast-client')
const chalk = require('chalk')
const Control = require('./Control')
const BufferReader = require('./BufferReader')

let updatedControls = new Set()
// Data buffer that holds the raw values for all the controls. Not necessary for numeric updates, but because strings
// can be partial updates where only part of the string is updated, we need this buffer to reconstruct the entire
// string.
const dataBuffer = Buffer.alloc(65536)
// Aircraft whose controls need to always be updated.
const alwaysRelevantAircraft = ['MetadataStart', 'MetadataEnd', 'CommonData', 'NS430']

class DcsBiosApi {
  /**
   * Start listening for new messages from DCS BIOS.
   * @param onUpdatesCallback - callback to invoke on control updates
   */
  start(onUpdatesCallback) {
    udpClient.start(x => this.parseMessage(x, onUpdatesCallback))
  }

  /**
   * Send a message to DCS BIOS.
   * @param message - message to send
   */
  sendMessage(message) {
    return udpClient.sendMessage(message.trim() + '\n')
  }

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
      if (address == 0x5555 && count == 0x5555) {
        onUpdatesCallback(Array.from(updatedControls))
        updatedControls = new Set() // Clear the updated controls in preparation for the next frame.
        continue
      }

      // Process the update block.
      while (count) {
        let closestAddressWithControls = address
        // Find the closest address that has controls. This is needed for partial string updates where the address from
        // the message won't line up with an address in the address lookup, so we need to get the closest one to the
        // current address.
        while (!aircraftData.addressLookup[closestAddressWithControls]) {
          closestAddressWithControls = closestAddressWithControls - 2
        }

        const controls = aircraftData.addressLookup[closestAddressWithControls]
        const addressValue = reader.readWord()
        // Save the updated value into the data buffer.
        dataBuffer.writeUInt16LE(addressValue, address)

        // For each control in the address, process the updated value and add the control to the update queue if its
        // value has been changed. We need to check every control because an update to an address can update multiple
        // controls.
        controls.forEach(control => {
          let newValue

          // This is a string, get the string using the starting address and its maximum length.
          if (control.type == 'display') {
            let newString = dataBuffer.toString(
              'utf8',
              closestAddressWithControls,
              closestAddressWithControls + control.maxLength
            )
            // Remove any null characters from the string.
            newString = newString.replace(/\0/g, '').trim()
            newValue = newString
          }
          // This is a number, get the value using the mask and the bit shift amount.
          else {
            newValue = (addressValue & control.mask) >> control.shiftBy
          }

          const isRelevantControl = this.isRelevantControl(control)
          const valueHasChanged = control.value != newValue

          // Don't add to the updated controls if the value hasn't changed or if the control has already been added.
          // Sometimes the update is simply a 'sync' that sets the same value as the existing one.
          if (isRelevantControl && valueHasChanged) {
            // Save the value on the output object.
            control.value = newValue
            updatedControls.add(control)
          }
        })

        count = count - 2
        address = address + 2
      }
    }
  }

  isRelevantControl(control) {
    const currentAircraft = aircraftData.addressLookup[0][0].value

    return control.aircraft == currentAircraft || alwaysRelevantAircraft.includes(control.aircraft)
  }
}

module.exports = new DcsBiosApi()
