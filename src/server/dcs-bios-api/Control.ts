import chalk from 'chalk'
import { RawControl, RawOutput } from './types'

class Control {
  id: string
  aircraft: string
  category: string
  description: string
  inputs: string[]
  output?: string
  suffix?: string
  type: string
  maxLength: number
  mask: number
  shiftBy: number
  value?: string | number

  constructor(control: RawControl, output: RawOutput, aircraftName: string) {
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

  private validate(control: RawControl, output: RawOutput, aircraftName: string): void {
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

export default Control
