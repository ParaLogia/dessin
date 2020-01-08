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

    this.initializeShape();
    this.ctx.translate(this.width / 2, this.height / 2);
    this.animate = this.animate.bind(this);
  }

  initializeShape() {
    let options;
    options = {
      vertices: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
      scale: [0.5, 0.5],
      scaleCenter: [-1, -1],
      rotate: -Math.PI / 2,
      ctx: this.ctx
    }
    // options = {
    //   vertices: [
    //     [-1, 1 * Math.sqrt(3) / 3],
    //     [1, 1 * Math.sqrt(3) / 3],
    //     [0, -2 * Math.sqrt(3) / 3]
    //   ],
    //   scale: [0.66666, 0.66666],
    //   scaleCenter: [1, Math.sqrt(3) / 3],
    //   rotate: 2 * Math.PI / 3,
    //   ctx
    // }

    const { width, height } = this;

    for (let i = 0; i < options.vertices.length; i++) {
      options.vertices[i][0] *= width / 2;
      options.vertices[i][1] *= height / 2;
    }

    options.scaleCenter[0] *= width / 2;
    options.scaleCenter[1] *= height / 2;

    this.shape = new Shape(options);
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