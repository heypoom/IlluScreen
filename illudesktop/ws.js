const SocketServer = require('socket.io')
const http = require('http')

function createSocketServer(port = 3366) {
  const httpServer = http.createServer()
  const io = SocketServer(httpServer)

  io.on('connect', socket => {
    console.log('> New connection:', socket.id)

    socket.on('draw', data => {
      io.emit('draw', data)
    })

    socket.emit('welcome', {message: 'Hello, There!'})
  })

  httpServer.listen(port, () => {
    console.log('> Socket.io Server active at port', port)
  })
}

module.exports = createSocketServer
