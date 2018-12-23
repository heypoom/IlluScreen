import React, { Component } from 'react'
import Peer from 'peerjs'
import io from 'socket.io-client'

import DrawableCanvas from './DrawableCanvas'

import './drawingboard.css'

export default class Screen extends Component {
  async componentDidMount() {
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.setupSocket()

    this.draw({ x: 5, y: 5, w: 5, h: 5, color: 'red' })
    this.draw({ x: 20, y: 20, w: 30, h: 30, color: 'teal' })

    this.setupStream()

    window.DrawingBoard = this
  }

  setupSocket = () => {
    const socket = io.connect(
      '192.168.1.36:3366',
      {
        transports: ['websocket'],
      }
    )

    socket.on('reconnect_attempt', () => {
      console.log('> Reconnecting...')
    })

    socket.on('welcome', console.log)
    socket.connect()

    this.socket = socket
    window.socket = socket
  }

  setupStream = async () => {
    const peer = new Peer('drawing-client', {
      host: '192.168.1.36',
      port: 9000,
      path: '/rtc',
    })

    console.log('Peer:', peer)

    const connection = peer.connect('desktop')
    console.log('Connection:', connection)

    // Create fake media stream
    const mediaStream = new MediaStream()

    const call = peer.call('desktop', mediaStream)

    if (!call) {
      alert('Unable to call')
      return
    }

    call.on('stream', async mediaStream => {
      this.video.srcObject = mediaStream
      await this.video.play()
    })
  }

  send = data => {
    this.socket.emit('draw', data)

    console.log('> Draw Command Sent:', data)
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
        />

        <video ref={ref => (this.video = ref)} />
      </div>
    )
  }
}
