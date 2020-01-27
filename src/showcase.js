const Shape = require('./shape');
const Utils = require('./utils');
const Features = require('./features');
const { openModal } = require('./modal');

const MIN_CYCLE_LENGTH = 30;
const MAX_CYCLE_LENGTH = 480;

class Showcase {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d', { alpha: Features.ALPHA });
    this.width = canvas.width;
    this.height = canvas.height;
    this.playing = false;
    this.frameCt = 0;
    this.cycleLength = 240;
    this.cycles = 0;
    
    this.animate = this.animate.bind(this);
    this.togglePlay = this.togglePlay.bind(this);

    const diagonal = Math.sqrt(this.width**2 + this.height**2);
    this.buffer = document.createElement('canvas');
    this.buffer.height = diagonal;
    this.buffer.width = diagonal;

    this.bufferCtx = this.buffer.getContext('2d', { alpha: Features.ALPHA })

    this.shape = Shape.polygon({
      ctx: this.bufferCtx,
      sides: 4,
      radius: Math.min(this.width, this.height) / 2
    }); 
    
    this.setupCanvas();
    this.attachListeners();

    requestAnimationFrame(() => this.animate(true));
    openModal(this.togglePlay);
  }

  setupCanvas() {
    const { width, height, bufferCtx, ctx } = this;

    bufferCtx.resetTransform();
    const diagonal = Math.sqrt(width ** 2 + height ** 2);
    bufferCtx.translate(diagonal / 2, diagonal / 2);
    bufferCtx.scale(1, -1);

    ctx.resetTransform();
    ctx.translate(width / 2, height / 2);
    ctx.scale(1, -1);
  }

  attachListeners() {
    const canvas = document.getElementById('canvas');
    this.scaleSlider = document.getElementById('scale-slider');
    this.angleSlider = document.getElementById('angle-slider');
    this.hueSlider = document.getElementById('hue-slider');
    this.sidesSlider = document.getElementById('sides-slider');
    this.speedSlider = document.getElementById('speed-slider');
    this.offsetSlider = document.getElementById('offset-slider');

    canvas.addEventListener('click', this.togglePlay);
    this.scaleSlider.addEventListener('input', (e) => this.setScale(e.target.value));
    this.angleSlider.addEventListener('input', (e) => this.setAngle(e.target.value));
    this.sidesSlider.addEventListener('input', (e) => this.setSides(e.target.value));
    this.speedSlider.addEventListener('input', (e) => this.setSpeed(e.target.value));
    this.offsetSlider.addEventListener('input', (e) => this.setOffset(e.target.value));
    if (Features.HUE_SLIDER) {
      this.hueSlider.addEventListener('input', (e) => this.setHue(e.target.value));
    } else {
      this.hueSlider.parentElement.removeChild(this.hueSlider);
    }

    window.onresize = () => {
      this.width = this.ctx.canvas.width = window.innerWidth;
      this.height = this.ctx.canvas.height = window.innerHeight;
      this.shape = Shape.polygon({
        ctx: this.ctx,
        sides: this.sidesSlider.value,
        radius: Math.min(this.width, this.height) / 2,
        scale: this.shape.scale,
        rotate: this.shape.rotate,
        scaleCenter: this.shape.scaleCenter
      }); 
      this.postShapeUpdate();
    }

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 81) {
        this.setScale(parseFloat(this.scaleSlider.value) - 0.005);
      }
      if (e.keyCode === 87) {
        this.setScale(parseFloat(this.scaleSlider.value) + 0.005);
      }
      if (e.keyCode === 65) {
        this.setAngle(parseFloat(this.angleSlider.value) - 0.0025);
      }
      if (e.keyCode === 83) {
        this.setAngle(parseFloat(this.angleSlider.value) + 0.0025);
      }
      if (e.keyCode === 219) {
        this.setSides(parseFloat(this.sidesSlider.value) - 0.05);
      }
      if (e.keyCode === 221) {
        this.setSides(parseFloat(this.sidesSlider.value) + 0.05);
      }
    })
  }

  postShapeUpdate() {
    this.bufferCtx.resetTransform();
    this.shape.computeFixedPoint();
    this.setupCanvas();
    this.shape.computeDepth();
    if (!this.playing) {
      requestAnimationFrame(() => this.animate(true));
    }
  }

  play() {
    this.playing = true;
    requestAnimationFrame(() => this.animate(false));
  }

  togglePlay() {
    if (this.playing) {
      this.playing = false;
    } else {
      this.play();
    }
  }

  animate(redraw) {
    const { ctx, buffer, cycleLength, shape, width, height, frameCt } = this;

    ctx.save();
    ctx.clearRect(-width / 2, -height / 2, width, height);
    const zoomFactor = (frameCt % cycleLength) / cycleLength;

    shape.transform(-zoomFactor, ctx);

    if (this.playing) {
      this.frameCt++;
      if (frameCt >= cycleLength) {
        this.frameCt = 0;
        this.cycles++;
        redraw = true;
      }
    }
    
    if (redraw) {
      shape.draw(this.cycles, zoomFactor);
    }
    const diagonal = Math.sqrt(width*width + height*height);
    ctx.drawImage(buffer, (-diagonal)/2, (-diagonal)/2);

    ctx.restore();

    if (this.playing) {
      requestAnimationFrame(() => this.animate(false));
    }
  }

  setScale(scale) {
    this.scaleSlider.value = scale;
    scale = this.scaleSlider.value;
    this.shape.scale = [scale, scale];
    this.postShapeUpdate();
  }

  setAngle(angle) {
    this.angleSlider.value = angle;
    angle = this.angleSlider.value;
    this.shape.rotate = parseFloat(angle) * Math.PI;
    this.postShapeUpdate();
  }

  setHue(hue) {
    this.hueSlider.value = hue;
    hue = this.hueSlider.value;
    this.shape.hue = parseInt(hue);
    if (!this.playing) {
      requestAnimationFrame(() => this.animate(true));
    }
  }

  setSides(sides) {
    this.sidesSlider.value = sides;
    sides = this.sidesSlider.value;
    this.shape = Shape.polygon({
      ctx: this.bufferCtx,
      sides: sides,
      radius: Math.min(this.width, this.height) / 2,
      rotate: this.shape.rotate,
      scale: this.shape.scale,
      scaleCenter: this.shape.scaleCenter,
      hue: this.shape.hue
    });
    this.postShapeUpdate();
  }

  setSpeed(speed) {
    this.speedSlider.value = speed;
    speed = this.speedSlider.value;
    const prevCycleLength = this.cycleLength;
    this.cycleLength = Math.round(Utils.interpolateNumberLogarithmic(
      MAX_CYCLE_LENGTH,
      MIN_CYCLE_LENGTH,
      speed
    ));
    this.frameCt = Math.round(this.frameCt * (this.cycleLength / prevCycleLength));
    this.postShapeUpdate();
  }

  setOffset(offset) {
    this.offsetSlider.value = offset;
    offset = this.offsetSlider.value;
    const radius = Math.min(this.width, this.height)/2;
    this.shape.scaleCenter = [0, Utils.interpolateNumberLinear(0, radius, offset)];
    this.postShapeUpdate();
  }
}


module.exports = Showcase;