const { transform, interpolateNumber, interpolateVector } = require('./utils');

const defaults = {
  scale: [1, 1],
  rotate: 0,
  translate: [0, 0]
}

class Shape {
  constructor(options) {
    this.ctx = options.ctx;
    this.vertices = options.vertices;
    this.scale = options.scale || defaults.scale;
    this.rotate = options.rotate || defaults.rotate;
    this.translate = options.translate || defaults.translate;
  }

  tracePath() {
    const { ctx, vertices } = this;
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(...vertices[i]);
    }
    ctx.closePath();
  }

  transformStep() {
    const { ctx, scale, rotate, translate } = this;
    transform(ctx, { scale, rotate, translate });
  }

  draw(baseTransform, depth=6) {
    if (depth <= 0) 
      return;

    const { ctx } = this;
    this.tracePath(ctx);

    ctx.save();
    ctx.setTransform(baseTransform);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    this.transformStep();
    this.draw(baseTransform, depth - 1);
    ctx.restore();
  }

  interpolateTransform(proportion) {
    const params = {};
    params.scale = interpolateVector(defaults.scale, this.scale, proportion);
    params.rotate = interpolateNumber(defaults.rotate, this.rotate, proportion);
    params.translate = interpolateVector(defaults.translate, this.translate, proportion);
    return params;
  }
}

module.exports = Shape;