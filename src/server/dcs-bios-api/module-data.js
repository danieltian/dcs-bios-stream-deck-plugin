const glob = require('glob')
const path = require('path')
const chalk = require('chalk')
const Output = require('./Output')
const Input = require('./Input')

// Get all the .json files from %APPDATA%\DCS-BIOS\control-reference-json.
const filePaths = glob.sync(path.join(process.env.APPDATA, 'DCS-BIOS', 'control-reference-json', '*.json'))

const modules = new Map() // Used by the frontend to get a list of controls for a module.
const addressLookup = new Map() // Used by DCS BIOS API to update the outputs at a particular address.
const outputLookup = new Map() // Used by the frontend and the server to get the output from the ID saved in the JSON.

filePaths.forEach((filePath) => {
  // Skip MetadataEnd, it contains counters that endlessly update, but this creates a lot of noise when debugging
  // updates, and nobody will actually use it.
  if (filePath.endsWith('MetadataEnd.json')) return

  const moduleName = path.basename(filePath, '.json') // Get the module name from the file name.
  const data = require(filePath)
  const controls = Object.values(data).flatMap((x) => Object.values(x)) // Map the nested controls into a flat array.

  modules.set(moduleName, { inputs: [], outputs: [] })

  // Process each control's inputs and outputs.
  controls.forEach((control) => {
    // If the control has inputs or outputs, add them to the module's inputs and outputs arrays.
    if (control.inputs.length) {
      const input = new Input(control, moduleName)
      modules.get(moduleName).inputs.push(input)
    }

    control.outputs.forEach((outputConfig) => {
      const output = new Output(outputConfig, control, moduleName)

      modules.get(moduleName).outputs.push(output)
      // Add the output to the address lookup. There can be multiple outputs per address.
      const address = output.address
      // Create the array for the address lookup if it doesn't exist.
      addressLookup.set(address, addressLookup.get(address) || [])
      // Add this control to the address lookup.
      addressLookup.get(address).push(output)

      if (outputLookup.has(output.globalId)) {
        console.log(
          chalk`{red [WARNING]} {yellowBright output with global ID {cyan ${output.globalId}} already exists, existing one will be used}`
        )
      } else {
        outputLookup.set(output.globalId, output)
      }
    })
  })
})

module.exports = { modules, addressLookup, outputLookup }
