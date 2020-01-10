const Utils = require('./utils');

const defaults = {
  scale: [1, 1],
  rotate: 0,
  scaleCenter: [0, 0],
  depthOffset: 0,
  inradius: 1,
  colors: [
    [57, 158, 90], 
    [90, 188, 185], 
    [70, 115, 75], 
    [99, 226, 198], 
    [110, 249, 245]
  ]
}

const MAX_DEPTH_LIMIT = 5000;

class Shape {
  constructor(options) {
    options = Object.assign({}, defaults, options);

    this.ctx = options.ctx;
    this.vertices = options.vertices;
    this.scale = options.scale;
    this.scaleCenter = options.scaleCenter;
    this.rotate = options.rotate;
    this.colors = options.colors;
    this.depthOffset = options.depthOffset;
    this.inradius = options.inradius;

    this.computeFixedPoint();
    this.computeDepth();
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

  draw(cycle, zoomFactor) {
    const { ctx, colors, maxDepth, depthOffset } = this;

    ctx.save();
    this.transform(-depthOffset);

    for (let depth = 0; depth < maxDepth; depth++) {
      this.tracePath(ctx);
      let colorOffset = (cycle + depth - depthOffset) % colors.length;
      // Ensure positive index;
      colorOffset = (colorOffset + colors.length) % colors.length; 
      const [r, g, b] = colors[colorOffset];
      const trueDepth = Utils.interpolateNumberLinear(depth+1, depth, zoomFactor);
      let alpha = Utils.interpolateNumberLinear(1, 0, (trueDepth/maxDepth)**(7/3));
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
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

  computeDepth() {
    const { width, height } = this.ctx.canvas;
    const diagonalDist = Math.sqrt((width/2)**2 + (height/2)**2);
    const [xScale, yScale] = this.scale;

    this.depthOffset = Math.ceil(Utils.logBase(
      diagonalDist/this.inradius, 
      Math.min(1/xScale, 1/yScale)
    ));

    this.maxDepth = this.depthOffset + 1 + Math.max(
      Math.ceil(-Utils.logBase(width, xScale)),
      Math.ceil(-Utils.logBase(height, yScale)),
    )
    this.maxDepth = Math.min(this.maxDepth, MAX_DEPTH_LIMIT);
  }

  static polygon({ ctx, sides, radius, rotate, scale }) {
    const vertices = [];
    const angleStep = 2 * Math.PI / sides;

    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep;
      // Note: angle starts along the positive y-axis, then goes CW
      const y = radius * Math.cos(angle);
      const x = radius * Math.sin(angle);
      vertices.push([x, y]);
    }

    if (rotate === undefined) {
      rotate = rotate || angleStep / 2;
    }
    const inradiusScale = Math.abs(Math.cos(angleStep / 2));
    scale = scale || [inradiusScale, inradiusScale];

    const inradius = inradiusScale * radius;

    const options = {
      ctx,
      vertices,
      rotate,
      scale,
      inradius
    }

    return new Shape(options);
  }
}

module.exports = Shape;