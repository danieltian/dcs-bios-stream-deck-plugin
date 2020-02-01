class BufferReader {
  constructor(buffer) {
    this.buffer = buffer
    this.offset = 0
  }

  readWord() {
    const value = this.buffer.readUInt16LE(this.offset)
    this.offset = this.offset + 2

    return value
  }

  bytesLeft() {
    return this.buffer.length - this.offset
  }
}

module.exports = BufferReader
