const glob = require('glob')
const path = require('path')

// Get all the .json files from %APPDATA%\DCS-BIOS\control-reference-json.
const filePaths = glob.sync(path.join(process.env.APPDATA, 'DCS-BIOS', 'control-reference-json', '*.json'))

const modules = {} // Used by the frontend to get a list of controls for a module.
const addressLookup = {} // Used by DCS BIOS API to update the outputs at a particular address.
const outputLookup = {} // Used by the frontend and the server to get the output from the ID saved in the JSON.

filePaths.forEach((filePath) => {
  const moduleName = path.basename(filePath, '.json') // Get the module name from the file name.
  const data = require(filePath)
  const controls = Object.values(data).flatMap((x) => Object.values(x)) // Map the nested controls into a flat array.

  modules[moduleName] = { outputs: [], inputs: [] }

  // Process each control's inputs and outputs.
  controls.forEach((control) => {
    if (control.inputs.length) {
      modules[moduleName].inputs.push(control)
    }

    control.outputs.forEach((output) => {
      // Add the module name to the output. We need this because some modules share the same address, so we need a way
      // to differentiate which module an update is for.
      output.module = moduleName
      output.control = control

      modules[moduleName].outputs.push(output) // Add the output to the module.

      // Add the output to the address lookup. There can be multiple outputs per address.
      const address = output.address
      addressLookup[address] = addressLookup[address] || []
      addressLookup[address].push(output)

      const outputName = `${moduleName}/${control.category}/${control.identifier}/${output.suffix}`
      const existingControl = outputLookup[outputName]

      if (existingControl) {
        console.log('already exists', existingControl, output)
      } else {
        outputLookup[outputName] = output
      }
    })
  })
})

module.exports = { modules, addressLookup }
