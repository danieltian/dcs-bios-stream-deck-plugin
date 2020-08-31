class Control {
  constructor(module, control, output = {}) {
    this.category = control.category
    this.controlType = control.control_type // TODO: Needed?
    this.description = control.description
    this.physicalVariant = control.physical_variant // TODO: Needed?
    this.module = module

    this.suffix = output.suffix
    this.type = output.type // TODO: needed?

    this.globalId = `${module}/${control.identifier}${this.suffix || ''}`
  }
}

module.exports = Control
