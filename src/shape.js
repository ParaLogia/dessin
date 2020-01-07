const { 
  applyTransform, 
  interpolateNumberLinear, 
  interpolateVectorLogarithmic, 
  invertTransform 
} = require('./utils');

const defaults = {
  scale: [1, 1],
  rotate: 0,
  translate: [0, 0],
  colors: ['red', 'orange', 'yellow']
}

class Shape {
  constructor(options) {
    this.ctx = options.ctx;
    this.vertices = options.vertices;
    this.baseTransform = options.baseTransform;
    this.scale = options.scale || defaults.scale;
    this.rotate = options.rotate || defaults.rotate;
    this.translate = options.translate || defaults.translate;
    this.colors = options.colors || defaults.colors;
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
    applyTransform(ctx, { scale, rotate, translate });
  }

  draw(baseTransform, depth, cycle) {
    if (depth <= 0) 
      return;

    const { ctx } = this;
    this.tracePath(ctx);

    // ctx.save();
    // ctx.setTransform(baseTransform);
    const cycleLength = this.colors.length;
    const cycleDepth = ((depth + cycleLength - cycle % cycleLength) % cycleLength);
    ctx.fillStyle = this.colors[cycleDepth];
    ctx.fill();
    // ctx.stroke();
    // ctx.restore();

    ctx.save();
    this.transformStep();
    this.draw(baseTransform, depth - 1, cycle);
    ctx.restore();
  }

  interpolateTransform(proportion) {
    const params = {};
    params.scale = interpolateVectorLogarithmic(defaults.scale, this.scale, proportion);
    params.rotate = interpolateNumberLinear(defaults.rotate, this.rotate, proportion);
    params.translate = this.translate;
    return params;
  }

  interpolateInverseTransform(proportion) {
    const { scale, rotate, translate } = this;
    const invertParams = invertTransform({ scale, rotate, translate });
    const params = {};
    params.scale = interpolateVectorLogarithmic(defaults.scale, invertParams.scale, proportion);
    params.rotate = interpolateNumberLinear(defaults.rotate, invertParams.rotate, proportion);
    params.translate = translate;
    return params;
  }
}

module.exports = Shape;