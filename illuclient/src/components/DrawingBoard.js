import React, { Component } from 'react'
import Peer from 'peerjs'

import DrawableCanvas from './DrawableCanvas'

import './drawingboard.css'

export default class Screen extends Component {
  async componentDidMount() {
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    await this.setupStream()

    window.DrawingBoard = this
  }

  setupStream = async () => {
    const peer = new Peer('drawing-client', {
      host: '192.168.1.36',
      port: 9000,
    })

    this.peer = peer

    const connection = peer.connect('desktop')
    this.conn = connection

    connection.on('open', () => {
      console.log('> WebRTC Connection Established!')

      this.draw({ x: 5, y: 5, w: 5, h: 5, color: 'red' })
      this.draw({ x: 20, y: 20, w: 30, h: 30, color: 'teal' })
    })

    // Create fake media stream
    const fakeStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    })

    const call = peer.call('desktop', fakeStream)

    if (!call) {
      alert('Unable to call')
      return
    }

    call.on('stream', mediaStream => {
      this.video.srcObject = mediaStream
      this.video.play()
    })
  }

  send = data => {
    this.conn.send(data)

    console.log('> Draw Command Sent via WebRTC:', data)
  }

  draw = data => {
    this.send(data)

    const { x = 0, y = 0, w = 1, h = 1, color = 'white' } = data
    console.log('> Draw Event:', data)

    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, w, h)
  }

  clear = () => {
    this.board.resetCanvas()
  }

  onCanvas = (canvas, ctx) => {
    this.canvas = canvas
    this.ctx = ctx
  }

  render() {
    return (
      <div className="container">
        <DrawableCanvas
          className="canvas-display"
          onCanvas={this.onCanvas}
          onDraw={this.send}
          ref={ref => (this.board = ref)}
          brushColor="#FFFF00"
          lineWidth={16}
        />

        <video ref={ref => (this.video = ref)} />
      </div>
    )
  }
}
