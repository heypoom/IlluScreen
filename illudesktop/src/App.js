import React, {Component} from 'react'
import Peer from 'peerjs'
import io from 'socket.io-client'

import './App.css'

class App extends Component {
  async componentDidMount() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    const ctx = this.canvas.getContext('2d')

    const socket = io('http://localhost:3366', {
      transports: ['websocket']
    })

    socket.on('reconnect_attempt', () => {
      console.log('> Reconnecting...')
    })

    socket.on('draw', data => {
      const {x = 0, y = 0, w = 1, h = 1, color = 'white'} = data
      console.log('> Draw Event:', data)

      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    })

    window.socket = socket

    const peer = new Peer('desktop', {
      host: 'localhost',
      port: 9000,
      path: '/rtc'
    })

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      // video: true,
      video: {
        mandatory: {
          chromeMediaSource: 'screen',
          maxWidth: 1280,
          maxHeight: 720
        }
      }
    })

    peer.on('call', function(call) {
      // Answer the call, providing our mediaStream
      call.answer(mediaStream)
    })
  }

  render() {
    return (
      <div className="container">
        <h1>Hello</h1>
        <canvas className="drawing-canvas" ref={ref => (this.canvas = ref)} />
      </div>
    )
  }
}

export default App
