const express = require('express')
const SocketServer = require('socket.io')
const {PeerServer, ExpressPeerServer} = require('peer')
const http = require('http')

const PORT = 9000
const RTC_PORT = 9009

function createServer() {
  const app = express()
  const server = http.createServer(app)

  app.get('/', function(req, res, next) {
    res.send('Hello world!')
  })

  const io = SocketServer(server)

  io.on('connect', socket => {
    console.log('> New connection:', socket.id)

    socket.on('draw', data => {
      console.log('> Draw:', data)

      io.emit('draw', data)
    })

    socket.emit('welcome', {message: 'Hello, There!'})
  })

  const peer = PeerServer({
    debug: true,
    port: RTC_PORT
  })

  server.listen(PORT, () => {
    console.log('Server is listening on port', PORT)
  })

  return app
}

module.exports = createServer
