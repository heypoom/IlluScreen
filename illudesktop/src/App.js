import React, {Component} from 'react'
import Peer from 'peerjs'
import io from 'socket.io-client'

import DisplayCanvas from './DisplayCanvas'

import './App.css'

class App extends Component {
  async componentDidMount() {
    this.setupSocket()

    await this.setupStreaming()
  }

  setupSocket = () => {
    const socket = io('http://localhost:9000', {
      transports: ['websocket']
    })

    socket.on('reconnect_attempt', () => {
      console.log('> Reconnecting...')
    })

    socket.on('draw', this.handleDraw)

    window.socket = socket
  }

  setupStreaming = async () => {
    const peer = new Peer('desktop', {
      host: 'localhost',
      port: 9009
    })

    const constraint = {
      video: {
        mandatory: {
          chromeMediaSource: 'screen',
          maxWidth: 1280,
          maxHeight: 720
        }
      }
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia(constraint)

    peer.on('call', function(call) {
      // Answer the call, providing our mediaStream
      call.answer(mediaStream)
    })
  }

  onCanvas = (canvas, ctx) => {
    this.canvas = canvas
    this.ctx = ctx
  }

  handleDraw = data => {
    if (data.clear) {
      this.display.resetCanvas()
    }

    if (data.draw) {
      this.display.draw(data.lX, data.lY, data.cX, data.cY)
    }
  }

  render() {
    return (
      <div className="container">
        <DisplayCanvas
          className="drawing-canvas"
          ref={ref => (this.display = ref)}
          onCanvas={this.onCanvas}
        />
      </div>
    )
  }
}

export default App
