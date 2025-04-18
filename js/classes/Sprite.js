class Sprite {
  constructor({
    position,
    imageSrc,
    frameRate = 1,
    frameBuffer = 0.1,
    scale = 1,
  }) {
    this.position = position
    this.scale = scale
    this.loaded = false
    this.image = new Image()
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale
      this.height = this.image.height * this.scale
      this.loaded = true
    }
    this.image.src = imageSrc
    this.frameRate = frameRate
    this.currentFrame = 0
    this.frameBuffer = frameBuffer
    this.elapsedFrames = 0
  }

  draw(context) {
    if (!this.image || !this.loaded) return;

    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    context.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(context) {
    this.draw(context)
    this.updateFrames()
  }

  updateFrames() {
    this.elapsedFrames++

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++
      else this.currentFrame = 0
    }
  }
}
