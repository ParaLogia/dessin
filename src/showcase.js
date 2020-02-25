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
    this.shape = Shape.polygon({
      ctx: this.ctx, 
      sides: 4, 
      radius: Math.min(this.width, this.height)/2
    }); 
    this.cycleLength = 240;

    this.debounceTimer = null;

    this.zoomFactor = 1;
    this.prevTime = null;
    this.cycles = 0;
    
    this.animate = this.animate.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.play = this.play.bind(this);
    this.highlightSliders = this.highlightSliders.bind(this);
    
    this.setupCanvas();
    this.attachListeners();

    requestAnimationFrame(this.animate);
    openModal({ onClose: this.play });
  }

  setupCanvas() {
    const { ctx, width, height } = this;
    ctx.translate(width / 2, height / 2);
    ctx.scale(1, -1);
  }

  highlightSliders() {
    Object.values(this.sliders).forEach(slider => {
      slider.parentElement.classList.add('active');
    })

    // Debounce the fade
    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = window.setTimeout(() => {
      this.debounceTimer = null;
      Object.values(this.sliders).forEach(slider => {
        slider.parentElement.classList.remove('active');
      })
    }, 800)
  }

  attachListeners() {
    const canvas = document.getElementById('canvas');
    const logoWrapper = document.getElementById('logo-wrapper');

    this.sliders = {};
    this.sliders.scale = document.getElementById('scale-slider');
    this.sliders.angle = document.getElementById('angle-slider');
    this.sliders.hue = document.getElementById('hue-slider');
    this.sliders.sides = document.getElementById('sides-slider');
    this.sliders.speed = document.getElementById('speed-slider');
    this.sliders.offset = document.getElementById('offset-slider');

    canvas.addEventListener('click', this.togglePlay);
    canvas.addEventListener('click', this.highlightSliders);
    canvas.addEventListener('mousemove', this.highlightSliders);
    logoWrapper.addEventListener('click', () => {
      const wasPlaying = this.playing;
      this.pause()
      const onClose = wasPlaying ? this.play : () => {};
      openModal({ animate: true, onClose })
    });

    this.sliders.scale.addEventListener('input', (e) => this.setScale(e.target.value));
    this.sliders.angle.addEventListener('input', (e) => this.setAngle(e.target.value));
    this.sliders.sides.addEventListener('input', (e) => this.setSides(e.target.value));
    this.sliders.speed.addEventListener('input', (e) => this.setSpeed(e.target.value));
    this.sliders.offset.addEventListener('input', (e) => this.setOffset(e.target.value));
    if (Features.HUE_SLIDER) {
      this.sliders.hue.addEventListener('input', (e) => this.setHue(e.target.value));
    } else {
      this.sliders.hue.parentElement.removeChild(this.sliders.hue);
      delete this.sliders.hue;
    }

    window.onresize = () => {
      this.width = this.ctx.canvas.width = window.innerWidth;
      this.height = this.ctx.canvas.height = window.innerHeight;
      this.shape = Shape.polygon({
        ctx: this.ctx,
        sides: this.sliders.sides.value,
        radius: Math.min(this.width, this.height) / 2,
        scale: this.shape.scale,
        rotate: this.shape.rotate,
        scaleCenter: this.shape.scaleCenter
      }); 
      this.postShapeUpdate();
    }

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 81) {
        this.setScale(parseFloat(this.sliders.scale.value) - 0.005);
      }
      if (e.keyCode === 87) {
        this.setScale(parseFloat(this.sliders.scale.value) + 0.005);
      }
      if (e.keyCode === 65) {
        this.setAngle(parseFloat(this.sliders.angle.value) - 0.0025);
      }
      if (e.keyCode === 83) {
        this.setAngle(parseFloat(this.sliders.angle.value) + 0.0025);
      }
      if (e.keyCode === 219) {
        this.setSides(parseFloat(this.sliders.sides.value) - 0.05);
      }
      if (e.keyCode === 221) {
        this.setSides(parseFloat(this.sliders.sides.value) + 0.05);
      }
    })
  }

  postShapeUpdate() {
    this.ctx.resetTransform();
    this.shape.computeFixedPoint();
    this.setupCanvas();
    this.shape.computeDepth();
    if (!this.playing) {
      requestAnimationFrame(this.animate);
    }
  }

  play() {
    this.playing = true;
    requestAnimationFrame(this.animate);
  }

  pause() {
    this.playing = false;
    this.prevTime = null
  }

  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  animate(time) {
    const { ctx, shape, width, height } = this;

    const timeDelta = time - (this.prevTime || time);
    const step = 1 / (10*(this.shape.rotate+1)*this.cycleLength);
    this.zoomFactor = (this.zoomFactor + timeDelta * step);

    if (this.playing && this.zoomFactor > 1) {
      this.zoomFactor = this.zoomFactor % 1;
      this.cycles++;
    }

    ctx.save();
    ctx.fillStyle = "#46724b"
    ctx.fillRect(-width / 2, -height / 2, width, height);

    shape.transform(-this.zoomFactor);
    
    shape.draw(this.cycles, this.zoomFactor);

    ctx.restore();

    if (this.playing) {
      requestAnimationFrame(this.animate);
      this.prevTime = time;
    }
  }

  setScale(scale) {
    this.sliders.scale.value = scale;
    scale = this.sliders.scale.value;
    this.shape.scale = [scale, scale];
    this.postShapeUpdate();
  }

  setAngle(angle) {
    this.sliders.angle.value = angle;
    angle = this.sliders.angle.value;
    this.shape.rotate = parseFloat(angle) * Math.PI;
    this.postShapeUpdate();
  }

  setHue(hue) {
    this.sliders.hue.value = hue;
    hue = this.sliders.hue.value;
    this.shape.hue = parseInt(hue);
    if (!this.playing) {
      requestAnimationFrame(this.animate);
    }
  }

  setSides(sides) {
    this.sliders.sides.value = sides;
    sides = this.sliders.sides.value;
    this.shape = Shape.polygon({
      ctx: this.ctx,
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
    this.sliders.speed.value = speed;
    speed = this.sliders.speed.value;
    this.cycleLength = Math.round(Utils.interpolateNumberLogarithmic(
      MAX_CYCLE_LENGTH,
      MIN_CYCLE_LENGTH,
      speed
    ));
    this.postShapeUpdate();
  }

  setOffset(offset) {
    this.sliders.offset.value = offset;
    offset = this.sliders.offset.value;
    const radius = Math.min(this.width, this.height)/2;
    this.shape.scaleCenter = [0, Utils.interpolateNumberLinear(0, radius, offset)];
    this.postShapeUpdate();
  }
}


module.exports = Showcase;