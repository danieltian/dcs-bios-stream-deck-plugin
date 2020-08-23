const glob = require('glob')
const path = require('path')
const chalk = require('chalk')

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

  modules.set(moduleName, { outputs: [], inputs: [] })

  // Process each control's inputs and outputs.
  controls.forEach((control) => {
    // TODO: Is this needed?
    if (control.inputs.length) {
      modules.get(moduleName).inputs.push(control)
    }

    control.outputs.forEach((output) => {
      // Add the module name to the output. We need this because some modules share the same address, so we need a way
      // to differentiate which module an update is for.
      output.module = moduleName
      output.control = control // TODO: Is this needed?

      modules.get(moduleName).outputs.push(output) // Add the output to the module.

      // Add the output to the address lookup. There can be multiple outputs per address.
      const address = output.address

      if (!addressLookup.has(address)) {
        addressLookup.set(address, [])
      }

      addressLookup.get(address).push(output)

      const globalId = `${moduleName}/${control.identifier}${output.suffix}`
      output.globalId = globalId

      if (outputLookup.has(globalId)) {
        console.log(chalk.redBright(`output with ID ${globalId} already exists:`, output))
      } else {
        outputLookup.set(globalId, output)
      }
    })
  })
})

module.exports = { modules, addressLookup, outputLookup }
