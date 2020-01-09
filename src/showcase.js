const Shape = require('./shape');

const CYCLE_LENGTH = 120;
const DEPTH_OFFSET = 2;
const MAX_DEPTH = 5000;

class Showcase {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.playing = false;
    this.frameCt = 0;
    this.shape = Shape.TRIANGLE(this.ctx, this.width, this.height);
    
    this.animate = this.animate.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    
    this.setupCanvas();
    this.computeDepth();
    this.attachListeners();
  }

  setupCanvas() {
    const { ctx, width, height } = this;
    ctx.translate(width / 2, height / 2);
    // ctx.beginPath();
    // ctx.arc(0, 0, Math.min(width, height)/2, 0, 2*Math.PI);
    // ctx.stroke();
    // ctx.clip();
  }

  attachListeners() {
    const playButton = document.getElementById('play-button');
    const scaleSlider = document.getElementById('scale-slider');
    const angleSlider = document.getElementById('angle-slider');

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
  }

  postShapeUpdate() {
    this.ctx.resetTransform();
    this.shape.computeFixedPoint();
    this.setupCanvas();
    this.computeDepth();
    if (!this.playing) {
      this.animate();
    }
  }

  computeDepth() {
    const { width, height } = this;

    const [xScale, yScale] = this.shape.scale;
    this.depth = DEPTH_OFFSET + 1 + Math.max(
      Math.ceil(Math.log(width) / Math.log(1 / xScale)),
      Math.ceil(Math.log(height) / Math.log(1 / yScale)),
    )
    this.depth = Math.min(this.depth, MAX_DEPTH);
  }

  play() {
    this.playing = true;
    requestAnimationFrame(this.animate);
  }

  togglePlay(e) {
    if (this.playing) {
      this.playing = false;
    } else {
      this.play();
    }
  }

  animate() {
    const { ctx, shape, width, height, depth, frameCt } = this;

    ctx.save();
    ctx.clearRect(-width / 2, -height / 2, width, height);
    const zoomFactor = DEPTH_OFFSET + (frameCt % CYCLE_LENGTH) / CYCLE_LENGTH;

    shape.transform(-zoomFactor)

    shape.draw(depth, Math.floor(frameCt / CYCLE_LENGTH));

    ctx.restore();

    if (this.playing) {
      this.frameCt++;
      requestAnimationFrame(this.animate);
    }
  }
}


module.exports = Showcase;