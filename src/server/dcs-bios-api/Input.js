class Input {
  constructor(module, control) {
    this.category = control.category
    this.controlType = control.control_type // TODO: Needed?
    this.description = control.description
    this.physicalVariant = control.physical_variant
    this.id = control.identifier
    this.inputs = control.inputs

    this.module = module
    this.globalId = `${module}/${control.identifier}`
  }
}

module.exports = Input
