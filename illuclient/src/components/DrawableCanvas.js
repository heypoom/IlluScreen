import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class DrawableCanvas extends Component {
  state = {
    drawing: false,
    lastX: 0,
    lastY: 0,
  }

  componentDidMount() {
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight

    this.ctx = this.canvas.getContext('2d')

    this.props.onCanvas(this.canvas, this.ctx)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clear) {
      this.resetCanvas()
    }
  }

  static getDefaultStyle() {
    return {
      brushColor: '#FFFF00',
      lineWidth: 4,
      cursor: 'pointer',
      canvasStyle: {
        backgroundColor: '#00FFDC',
      },
      clear: false,
    }
  }

  handleOnTouchStart = e => {
    const rect = this.canvas.getBoundingClientRect()
    this.ctx.beginPath()
    this.setState({
      lastX: e.targetTouches[0].pageX - rect.left,
      lastY: e.targetTouches[0].pageY - rect.top,
      drawing: true,
    })
  }

  handleOnMouseDown = e => {
    const rect = this.canvas.getBoundingClientRect()
    this.ctx.beginPath()

    this.setState({
      lastX: e.clientX - rect.left,
      lastY: e.clientY - rect.top,
      drawing: true,
    })
  }

  handleOnTouchMove = e => {
    if (this.state.drawing) {
      const rect = this.canvas.getBoundingClientRect()
      const lastX = this.state.lastX
      const lastY = this.state.lastY
      let currentX = e.targetTouches[0].pageX - rect.left
      let currentY = e.targetTouches[0].pageY - rect.top
      this.draw(lastX, lastY, currentX, currentY)
      this.setState({
        lastX: currentX,
        lastY: currentY,
      })
    }
  }

  handleOnMouseMove = e => {
    if (this.state.drawing) {
      const rect = this.canvas.getBoundingClientRect()
      const lastX = this.state.lastX
      const lastY = this.state.lastY
      let currentX = e.clientX - rect.left
      let currentY = e.clientY - rect.top

      this.draw(lastX, lastY, currentX, currentY)
      this.setState({
        lastX: currentX,
        lastY: currentY,
      })
    }
  }

  handleonMouseUp = () => {
    this.setState({
      drawing: false,
    })
  }

  draw = (lX, lY, cX, cY) => {
    this.ctx.strokeStyle = this.props.brushColor
    this.ctx.lineWidth = this.props.lineWidth
    this.ctx.moveTo(lX, lY)
    this.ctx.lineTo(cX, cY)
    this.ctx.stroke()

    this.props.onDraw({ draw: true, lX, lY, cX, cY })
  }

  resetCanvas() {
    const width = this.canvas.width
    const height = this.canvas.height
    this.ctx.clearRect(0, 0, width, height)

    this.props.onDraw({ clear: true })
  }

  get canvasStyle() {
    const defaults = DrawableCanvas.getDefaultStyle()
    const custom = this.props.canvasStyle

    return { ...defaults, ...custom }
  }

  render() {
    return (
      <canvas
        className={this.props.className}
        ref={ref => (this.canvas = ref)}
        style={this.canvasStyle}
        onMouseDown={this.handleOnMouseDown}
        onTouchStart={this.handleOnTouchStart}
        onMouseMove={this.handleOnMouseMove}
        onTouchMove={this.handleOnTouchMove}
        onMouseUp={this.handleonMouseUp}
        onTouchEnd={this.handleonMouseUp}
      />
    )
  }
}

DrawableCanvas.propTypes = {
  brushColor: PropTypes.string,
  lineWidth: PropTypes.number,
  cursor: PropTypes.string,
  canvasStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  clear: PropTypes.bool,
}

export default DrawableCanvas
