class Output {
  constructor(module, control, output) {
    // Output properties.
    this.description = output.description
    this.mask = output.mask
    this.maxValue = output.max_value
    this.maxLength = output.max_length
    this.shiftBy = output.shift_by
    this.suffix = output.suffix
    this.type = output.type
    // Control properties.
    this.category = control.category
    this.controlType = control.control_type
    this.controlDescription = control.description
    this.physicalVariant = control.physical_variant
    // Module name.
    this.module = module
    // Global ID, unique ID for this output.
    this.globalId = `${module}/${control.identifier}${output.suffix}`
  }
}

module.exports = Output
