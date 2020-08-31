class Output {
  constructor(module, control, output) {
    // Output properties.
    this.description = output.description
    this.mask = output.mask
    this.max_value = output.max_value
    this.max_length = output.max_length
    this.shift_by = output.shift_by
    this.suffix = output.suffix
    this.type = output.type
    // Control properties.
    this.category = control.category
    this.control_type = control.control_type
    this.control_description = control.description
    this.physical_variant = control.physical_variant
    // Module name.
    this.module = module
    // Global ID, unique ID for this output.
    this.globalId = `${module}/${control.identifier}${output.suffix}`
  }
}

module.exports = Output
