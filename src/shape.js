const Utils = require('./utils');

const defaults = {
  scale: [1, 1],
  rotate: 0,
  scaleCenter: [0, 0],
  colors: ['#399E5A', '#5ABCB9', '#46734B', '#63E2C6', '#6EF9F5']
}

class Shape {
  constructor(options) {
    this.ctx = options.ctx;
    this.vertices = options.vertices;
    this.scale = options.scale || defaults.scale;
    this.scaleCenter = options.scaleCenter || defaults.scaleCenter;
    this.rotate = options.rotate || defaults.rotate;
    this.colors = options.colors || defaults.colors;

    this.computeFixedPoint();
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

  draw(maxDepth, cycle) {
    const { ctx } = this;

    ctx.save();
    for (let depth = 0; depth < maxDepth; depth++) {
      this.tracePath(ctx);
      const colorOffset = (cycle + depth) % this.colors.length;
      ctx.fillStyle = this.colors[colorOffset];
      ctx.fill();
      this.transform();
    }
    ctx.restore();
  }

  computeFixedPoint() {
    const { ctx, scale, rotate, scaleCenter } = this;

    if (this.scale[0] === 1 || this.scale[1] === 1) {
      this.fixedPoint = scaleCenter;
      return;
    }

    ctx.save();
    Utils.applyTransform(ctx, { scale, rotate, scaleCenter });
    const matrix = ctx.getTransform();
    this.fixedPoint = Utils.fixedPoint(matrix);
    ctx.restore();
  }

  static SQUARE(ctx, width, height) {
    const options = {
      vertices: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
      scale: [0.5, 0.5],
      scaleCenter: [-1, -1],
      rotate: -Math.PI / 2,
      ctx
    }
    
    Shape.scaleOptions(options, width, height);
    return new Shape(options);
  }

  static TRIANGLE(ctx, width, height) {
    options = {
      vertices: [
        [-1, 1 * Math.sqrt(3) / 3],
        [1, 1 * Math.sqrt(3) / 3],
        [0, -2 * Math.sqrt(3) / 3]
      ],
      scale: [0.58, 0.58],
      scaleCenter: [0, 0],
      rotate: Math.PI / 2,
      ctx
    }

    Shape.scaleOptions(options, width, height);
    return new Shape(options);
  }

  static scaleOptions(options, width, height) {
    for (let i = 0; i < options.vertices.length; i++) {
      options.vertices[i][0] *= width / 2;
      options.vertices[i][1] *= height / 2;
    }

    options.scaleCenter[0] *= width / 2;
    options.scaleCenter[1] *= height / 2;
    return options;
  }
  
}

module.exports = Shape;