const chalk = require('chalk')

class Control {
  constructor(control, output, aircraftName) {
    this.validate(control, output, aircraftName)

    this.id = control.identifier + output.suffix
    this.aircraft = aircraftName
    this.category = control.category
    this.description = control.description || control.category
    this.inputs = control.inputs.map(x => x.interface + (x.max_value ? ':' + x.max_value : ''))
    this.output = output.description || control.description
    this.maxLength = output.max_length
    this.mask = output.mask
    this.shiftBy = output.shift_by
    this.type = control.control_type == 'selector' ? control.physical_variant || 'selector' : control.control_type
    this.suffix = output.suffix
  }

  validate(control, output, aircraftName) {
    let controlName = chalk.cyanBright(`${aircraftName}:${control.category}`)
    if (control.description) {
      controlName = controlName + chalk.cyanBright(':' + control.description)
    }

    // Display a warning if the control is a selector, but has no physical variant.
    if (control.control_type == 'selector' && !control.physical_variant) {
      console.log(
        chalk.yellow('[WARN] control physical variant is undefined, defaulting to "selector" for type:', controlName)
      )
    }

    // Display a warning if the output has no description.
    if (!output.description) {
      console.log(
        chalk.yellow('[WARN] output description is undefined, using the control description instead:', controlName)
      )
    }

    // Display a warning if the control has no description.
    if (!control.description) {
      console.log(
        chalk.yellow('[WARN] control description is undefined, using the category name instead:', controlName)
      )
    }
  }
}

module.exports = Control
