const Utils = require('./utils');

const defaults = {
  scale: [1, 1],
  rotate: 0,
  scaleCenter: [0, 0],
  colors: ['#399E5A', '#5ABCB9', '#26532B', '#63E2C6', '#6EF9F5']
}

class Shape {
  constructor(options) {
    this.ctx = options.ctx;
    this.vertices = options.vertices;
    this.scale = options.scale || defaults.scale;
    this.rotate = options.rotate || defaults.rotate;
    this.scaleCenter = options.scaleCenter || defaults.scaleCenter;
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

  transform(proportion=1) {
    const { ctx, scale, rotate, fixedPoint } = this;
    const params = {
      scale: Utils.interpolateVectorLogarithmic(defaults.scale, scale, proportion),
      rotate: Utils.interpolateNumberLinear(defaults.rotate, rotate, proportion),
      scaleCenter: fixedPoint,
      rotateCenter: fixedPoint
    };

    Utils.applyTransform(ctx, params);
  }

  draw(depth, cycle) {
    if (depth <= 0) 
      return;

    const { ctx } = this;
    this.tracePath(ctx);

    const cycleLength = this.colors.length;
    const cycleDepth = ((depth + cycleLength - cycle % cycleLength) % cycleLength);
    ctx.fillStyle = this.colors[cycleDepth];
    ctx.fill();

    ctx.save();
    this.transform();
    this.draw(depth - 1, cycle);
    ctx.restore();
  }

  computeFixedPoint() {
    const { ctx, scale, rotate, scaleCenter } = this;

    ctx.save();
    Utils.applyTransform(ctx, { scale, rotate, scaleCenter });
    const matrix = ctx.getTransform();
    this.fixedPoint = Utils.fixedPoint(matrix);
    ctx.restore();
  }
}

module.exports = Shape;