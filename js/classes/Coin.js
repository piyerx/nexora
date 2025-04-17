class Coin {
  constructor(x, y) {
    this.position = {
      x: x,
      y: y
    }
    this.width = 15
    this.height = 15
    this.collected = false
  }

  draw(context) {
    if (!this.collected) {
      context.beginPath()
      context.arc(
        this.position.x,
        this.position.y,
        8,
        0,
        Math.PI * 2
      )
      context.strokeStyle = 'gold'
      context.lineWidth = 2
      context.stroke()
    }
  }
}