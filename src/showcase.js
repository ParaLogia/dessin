const Shape = require('./shape');
const Utils = require('./utils');

const MIN_CYCLE_LENGTH = 30;
const MAX_CYCLE_LENGTH = 480;

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
    this.cycleLength = 240;
    this.cycles = 0;
    
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
    const speedSlider = document.getElementById('speed-slider');

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
    speedSlider.addEventListener('input', (e) => {
      const prevCycleLength = this.cycleLength;
      this.cycleLength = Math.round(Utils.interpolateNumberLogarithmic(
        MAX_CYCLE_LENGTH, 
        MIN_CYCLE_LENGTH, 
        parseFloat(e.target.value)
      ));
      this.frameCt = Math.round(this.frameCt * (this.cycleLength / prevCycleLength));
    })
  }

  postShapeUpdate() {
    this.ctx.resetTransform();
    this.shape.computeFixedPoint();
    this.shape.computeDepth();
    this.setupCanvas();
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
    const zoomFactor = (frameCt % this.cycleLength) / this.cycleLength;

    shape.transform(-zoomFactor)

    if (this.playing) {
      this.frameCt++;
      if (frameCt >= this.cycleLength) {
        this.frameCt = 0;
        this.cycles++;
      }
    }
    
    shape.draw(this.cycles);

    ctx.restore();

    if (this.playing) {
      requestAnimationFrame(this.animate);
    }
  }
}


module.exports = Showcase;