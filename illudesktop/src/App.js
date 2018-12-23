import React, {Component} from 'react'
import Peer from 'peerjs'

import DisplayCanvas from './DisplayCanvas'

import './App.css'

class App extends Component {
  componentDidMount() {
    this.setupStreaming()
  }

  setupStreaming = async () => {
    const peer = new Peer('desktop', {
      host: 'localhost',
      port: 9000
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

    peer.on('connection', connection => {
      connection.on('data', data => {
        console.log('> Incoming Data Packet:', data)

        this.handlePacket(data)
      })
    })

    peer.on('call', call => {
      console.log('> Incoming Call:', call)

      // Answer the call, providing our mediaStream
      call.answer(mediaStream)
    })
  }

  onCanvas = (canvas, ctx) => {
    this.canvas = canvas
    this.ctx = ctx
  }

  handlePacket = data => {
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
