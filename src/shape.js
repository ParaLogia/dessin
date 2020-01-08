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
    this.vanishingPt = options.vanishingPt || this.scaleCenter;
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
    const { ctx, scale, rotate, scaleCenter } = this;
    Utils.applyTransform(ctx, { scale, rotate, scaleCenter });
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
    this.transformStep();
    this.draw(depth - 1, cycle);
    ctx.restore();
  }

  zoomOut(proportion) {
    const { ctx, scale, rotate, vanishingPt } = this;
    const params = Utils.invertTransform({ scale, rotate });
    params.scale = Utils.interpolateVectorLogarithmic(defaults.scale, params.scale, proportion);
    params.rotate = Utils.interpolateNumberLinear(defaults.rotate, params.rotate, proportion);
    params.scaleCenter = vanishingPt;
    params.rotateCenter = vanishingPt;

    Utils.applyTransform(ctx, params);
  }
}

module.exports = Shape;