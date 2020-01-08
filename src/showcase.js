const Shape = require('./shape');

const CYCLE_LENGTH = 120;
const DEPTH_OFFSET = 5;
const MAX_DEPTH = 5000;

class Showcase {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.playing = false;
    this.step = 0;

    this.shape = Shape.TRIANGLE(this.ctx, this.width, this.height);
    this.ctx.translate(this.width / 2, this.height / 2);
    this.animate = this.animate.bind(this);
  }

  play() {
    const { width, height } = this;

    const [xScale, yScale] = this.shape.scale;
    this.depth = DEPTH_OFFSET + 1 + Math.max(
      Math.ceil(Math.log(width) / Math.log(1 / xScale)),
      Math.ceil(Math.log(height) / Math.log(1 / yScale)),
    )
    this.depth = Math.min(this.depth, MAX_DEPTH);

    this.playing = true;
    requestAnimationFrame(this.animate);
  }

  animate() {
    const { ctx, shape, width, height, depth, step } = this;

    ctx.save();
    ctx.clearRect(-width / 2, -height / 2, width, height);
    const proportion = DEPTH_OFFSET + (step % CYCLE_LENGTH) / CYCLE_LENGTH;

    shape.transform(-proportion)

    shape.draw(depth, Math.floor(step / CYCLE_LENGTH));
    this.step++;

    ctx.restore();

    if (this.playing) {
      requestAnimationFrame(this.animate);
    }
  }
}


module.exports = Showcase;