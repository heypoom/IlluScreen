import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class DisplayCanvas extends Component {
  state = {
    lastX: 0,
    lastY: 0
  }

  componentDidMount() {
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    // this.canvas.width = this.canvas.offsetWidth
    // this.canvas.height = this.canvas.offsetHeight
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

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
        backgroundColor: '#00FFDC'
      },
      clear: false
    }
  }

  draw = (lX, lY, cX, cY) => {
    this.ctx.strokeStyle = this.props.brushColor
    this.ctx.lineWidth = this.props.lineWidth
    this.ctx.moveTo(lX, lY)
    this.ctx.lineTo(cX, cY)
    this.ctx.stroke()
  }

  resetCanvas() {
    const width = this.canvas.width
    const height = this.canvas.height
    this.ctx.clearRect(0, 0, width, height)
  }

  get canvasStyle() {
    const defaults = DisplayCanvas.getDefaultStyle()
    const custom = this.props.canvasStyle

    return {...defaults, ...custom}
  }

  render() {
    return (
      <canvas
        className={this.props.className}
        ref={ref => (this.canvas = ref)}
        style={this.canvasStyle}
      />
    )
  }
}

DisplayCanvas.propTypes = {
  brushColor: PropTypes.string,
  lineWidth: PropTypes.number,
  cursor: PropTypes.string,
  canvasStyle: PropTypes.shape({
    backgroundColor: PropTypes.string
  }),
  clear: PropTypes.bool
}

export default DisplayCanvas
