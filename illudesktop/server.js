const {PeerServer} = require('peer')
const http = require('http')

const RTC_PORT = 9000

function createServer() {
  return PeerServer({
    debug: true,
    port: RTC_PORT
  })
}

module.exports = createServer
