const glob = require('glob')
const path = require('path')

const filePaths = glob.sync(path.join(process.env.APPDATA, 'DCS-BIOS', 'control-reference-json', '*.json'))

const modules = {}
const addressLookup = {}

filePaths.forEach((filePath) => {
  const moduleName = path.basename(filePath, '.json') // Get the module name from the file name.
  modules[moduleName] = []
  const data = require(filePath) // Get the JSON data.
  const controls = Object.values(data).flatMap((x) => Object.values(x)) // Flat map the controls into a flat array.

  // Process each control's inputs and outputs.
  controls.forEach((control) => {
    modules[moduleName].push(control) // Add the control to the module.

    control.outputs.forEach((output) => {
      // Add the module name to the output. We need this because some modules share the same address, so we need a way
      // to differentiate which module an update is for.
      output.module = moduleName
      const address = output.address
      addressLookup[address] = addressLookup[address] || []
      addressLookup[address].push(output)
    })
  })
})

module.exports = { modules, addressLookup }
