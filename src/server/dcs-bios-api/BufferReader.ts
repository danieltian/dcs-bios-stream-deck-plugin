class BufferReader {
  buffer: Buffer
  offset: number

  constructor(buffer: Buffer) {
    this.buffer = buffer
    this.offset = 0
  }

  readWord(): number {
    const value = this.buffer.readUInt16LE(this.offset)
    this.offset = this.offset + 2

    return value
  }

  bytesLeft(): number {
    return this.buffer.length - this.offset
  }
}

export default BufferReader
