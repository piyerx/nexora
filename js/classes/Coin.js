class Coin {
  constructor(x, y, scale = 1.2) {
    this.position = {
      x: x,
      y: y
    }
    this.scale = scale
    this.width = 15 * scale
    this.height = 15 * scale
    this.collected = false

    // Load coin image
    this.image = new Image()
    this.image.src = '/img/nexCoin.png'
  }

  draw(context) {
    if (!this.collected && this.image.complete) {
      context.drawImage(
        this.image,
        this.position.x - (this.width / 2),
        this.position.y - (this.height / 2),
        this.width,
        this.height
      )
    }
  }
}