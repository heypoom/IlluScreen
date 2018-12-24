import React, {Component} from 'react'
import Peer from 'peerjs'

import DisplayCanvas from './DisplayCanvas'

import './App.css'

class App extends Component {
  componentDidMount() {
    window.app = this

    // this.setupStreaming()
  }

  setupStreaming = async () => {
    const peer = new Peer('desktop', {
      host: 'localhost',
      port: 9000
    })

    this.peer = peer

    peer.on('open', id => console.log('RTC: Connection Open:', id))
    peer.on('close', () => console.log('RTC: Connection Closed'))
    peer.on('connection', conn => console.log('RTC: Connection Established.'))
    peer.on('disconnected', () => console.log('RTC: Disconnected.'))
    peer.on('error', err => console.warn('RTC Error:', err.message))

    const constraint = {
      video: {
        mandatory: {
          chromeMediaSource: 'screen',
          maxWidth: 1280,
          maxHeight: 720
        }
      }
    }

    const connection = peer.connect('drawing-client')
    this.dataConnection = connection

    connection.on('data', data => {
      console.log('> Incoming Data Packet:', data)

      this.handlePacket(data)
    })

    const desktopStream = await navigator.mediaDevices.getUserMedia(constraint)
    this.stream = desktopStream

    const call = peer.call('drawing-client', desktopStream)
    this.mediaConnection = call

    if (!call) {
      alert('Unable to call')
      return
    }
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
          brushColor="#FFFF00"
          lineWidth={16}
        />
      </div>
    )
  }
}

export default App
