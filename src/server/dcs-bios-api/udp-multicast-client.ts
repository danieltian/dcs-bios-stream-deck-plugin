import dgram from 'dgram'
import { AddressInfo } from 'net'
import chalk from 'chalk'

const receivePort = 5010
const multicastAddress = '239.255.50.10'
const sendPort = 7778
const client = dgram.createSocket('udp4')

class UdpMulticastClient {
  /**
   * Start the client and listen to messages from DCS BIOS.
   * @param onMessageCallback callback function that's invoked when a message is received
   */
  start(onMessageCallback: (b: Buffer) => void): void {
    // When a message is received, invoke the callback function.
    client.on('message', onMessageCallback)

    // When the client is listening to the receive port, start receiving messages from the multicast address.
    client.on('listening', () => {
      const address = client.address() as AddressInfo
      client.setBroadcast(true)
      client.addMembership(multicastAddress)

      const message = chalk.green('UDP client listening on')
      const addressInfo = chalk.yellow(address.address + ':' + address.port)
      console.log(message, addressInfo)
    })

    client.bind(receivePort)
  }

  /**
   * Send a message to DCS BIOS.
   * @param message message to send to DCS BIOS
   */
  sendMessage(message: string): void {
    client.send(message, sendPort, 'localhost')
  }
}

export default new UdpMulticastClient()
