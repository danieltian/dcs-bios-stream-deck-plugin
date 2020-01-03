import chalk from 'chalk'
import glob from 'glob'
import path from 'path'
import Control from './Control'
import { RawControl } from './types'

const aircraftControls: { [key: string]: Control[] } = {}
const addressLookup: { [key: number]: Control[] } = {}

let appData = process.env.APPDATA

if (!appData) {
  console.error(
    'process.env.APPDATA does not exist, this needed to get the DCS-BIOS json, no aircraft data will be returned'
  )
  appData = ''
}

// Process every aircraft's json file.
const filePaths = glob.sync(path.join(appData, 'DCS-BIOS', 'control-reference-json', '*.json'))

filePaths.forEach(filePath => {
  // Get the aircraft name from the filename.
  const aircraftName = path.basename(filePath, '.json')
  // Create a key in aircraft controls for the aircraft name.
  aircraftControls[aircraftName] = []

  // Get the JSON data.
  const data: object = require(filePath) // eslint-disable-line @typescript-eslint/no-var-requires

  // Flat map the controls into a flat array.
  const controls = Object.values(data).reduce((array, x) => array.concat(Object.values(x)), [])

  controls.forEach((control: RawControl) => {
    // Create a new control for each output.
    control.outputs.forEach(output => {
      // Convert the raw control data into a Control object.
      const parsedControl = new Control(control, output, aircraftName)

      // Add the control to the aircraft.
      aircraftControls[aircraftName].push(parsedControl)

      const address = output.address
      // If the output has no address, show a warning because we can't do a lookup without an address.
      if (address == undefined) {
        const message = chalk.yellow('[WARN] control output has no address, cannot add to address lookup:')
        const controlName = chalk.cyan(`${aircraftName}:${control.category}:${control.description}`)
        console.log(message, controlName)
      }
      // Otherwise, add it to the address lookup.
      else {
        addressLookup[address] = addressLookup[address] || []
        addressLookup[address].push(parsedControl)
      }
    })
  })
})

export default { aircraftControls, addressLookup }
