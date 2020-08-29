class Input {
  constructor(control, module) {
    this.category = control.category
    this.control_type = control.control_type // TODO: Needed?
    this.description = control.description
    this.physical_variant = control.physical_variant
    this.id = control.identifier

    this.module = module
    this.globalId = `${module}/${control.identifier}`

    this.inputs = control.inputs.map((input) => {
      delete input.description
      return input
    })
  }
}

module.exports = Input
