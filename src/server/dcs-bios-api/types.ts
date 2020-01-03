export interface RawOutput {
  address: number
  description: string
  mask: number
  max_value: number
  shift_by: number
  suffix: string
  type: string
  max_length: number
}

export interface RawInput {
  interface: string
  description: string
  max_value: number
}

/**
 * Raw control from the aircraft JSON file.
 */
export interface RawControl {
  category: string
  control_type: string
  description: string
  identifier: string
  physical_variant: string

  inputs: RawInput[]
  outputs: RawOutput[]
}
