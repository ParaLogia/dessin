const Shape = require('./shape');

const CYCLE_LENGTH = 120;

class Showcase {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.playing = false;
    this.frameCt = 0;
    this.shape = Shape.polygon({
      ctx: this.ctx, 
      sides: 3, 
      radius: this.width/2
    });
    
    this.animate = this.animate.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    
    this.setupCanvas();
    this.attachListeners();
  }

  setupCanvas() {
    const { ctx, width, height } = this;
    ctx.translate(width / 2, height / 2);
    ctx.scale(1, -1);
    // ctx.beginPath();
    // ctx.arc(0, 0, Math.min(width, height)/2, 0, 2*Math.PI);
    // ctx.stroke();
    // ctx.clip();
  }

  attachListeners() {
    const playButton = document.getElementById('play-button');
    const scaleSlider = document.getElementById('scale-slider');
    const angleSlider = document.getElementById('angle-slider');
    const sidesSlider = document.getElementById('sides-slider');

    playButton.addEventListener('click', this.togglePlay);
    scaleSlider.addEventListener('input', (e) => {
      const scale = parseFloat(e.target.value);
      this.shape.scale = [scale, scale]; 
      this.postShapeUpdate();
    })
    angleSlider.addEventListener('input', (e) => {
      this.shape.rotate = parseFloat(e.target.value) * Math.PI;
      this.postShapeUpdate();
    })
    sidesSlider.addEventListener('input', (e) => {
      this.shape = Shape.polygon({
        ctx: this.ctx,
        sides: parseInt(e.target.value),
        radius: this.width / 2,
        rotate: this.shape.rotate,
        scale: this.shape.scale
      });
      this.postShapeUpdate();
    })
  }

  postShapeUpdate() {
    this.ctx.resetTransform();
    this.shape.computeFixedPoint();
    this.setupCanvas();
    this.shape.computeDepth();
    if (!this.playing) {
      this.animate();
    }
  }

  play() {
    this.playing = true;
    requestAnimationFrame(this.animate);
  }

  togglePlay(e) {
    e.preventDefault();
    if (this.playing) {
      this.playing = false;
    } else {
      this.play();
    }
  }

  animate() {
    const { ctx, shape, width, height, frameCt } = this;

    ctx.save();
    ctx.clearRect(-width / 2, -height / 2, width, height);
    const zoomFactor = (frameCt % CYCLE_LENGTH) / CYCLE_LENGTH;

    shape.transform(-zoomFactor)

    shape.draw(Math.floor(frameCt / CYCLE_LENGTH));

    ctx.restore();

    if (this.playing) {
      this.frameCt++;
      requestAnimationFrame(this.animate);
    }
  }
}


module.exports = Showcase;