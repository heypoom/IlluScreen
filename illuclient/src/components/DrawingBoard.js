import React, { Component } from 'react'
import Peer from 'peerjs'

import DrawableCanvas from './DrawableCanvas'

import './drawingboard.css'

function getUserMedia(constraint) {
  new Promise((resolve, reject) => {
    navigator.getUserMedia(constraint, resolve, reject)
  })
}

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

    peer.on('open', id => alert('RTC: Connection Open: ' + id))

    peer.on('close', () => alert('RTC: Connection Closed'))

    peer.on('connection', connection => {
      alert('RTC: Connection Established.')

      connection.on('open', () => {
        console.log('> WebRTC Connection Established!')

        this.conn = connection

        this.draw({ x: 5, y: 5, w: 5, h: 5, color: 'red' })
        this.draw({ x: 20, y: 20, w: 30, h: 30, color: 'teal' })
      })

      connection.on('data', data => {
        console.log('> Incoming Data Packet:', data)
      })
    })

    peer.on('disconnected', () => alert('RTC: Disconnected.'))

    peer.on('error', err => alert('RTC Error: ' + err.message))

    this.peer = peer

    peer.on('call', call => {
      console.log('> Incoming Call:', call)

      // Answer the call
      call.answer()

      alert('Incoming Call!')

      call.on('stream', mediaStream => {
        this.video.srcObject = mediaStream
        this.video.play()
      })
    })
  }

  send = data => {
    if (!this.conn) {
      alert('Connection is not established')
      return
    }

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
