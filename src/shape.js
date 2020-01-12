const Utils = require('./utils');

const MAX_DEPTH_LIMIT = 5000;

const defaults = {
  scale: [1, 1],
  rotate: 0,
  scaleCenter: [0, 0],
  hue: 127,
  colors: [
    [13, '47%', '42%'],
    [51, '42%', '55%'],
    [0, '24%', '36%'],
    [40, '69%', '64%'],
    [51, '92%', '70%'],
  ],
  // colors: [
  //   [45, '100%', '68%'],
  //   [90, '100%', '85%'],
  //   [135, '68%', '60%'],
  //   [0, '46%', '32%'],
  // ]
}

class Shape {
  constructor(options) {
    options = Object.assign({}, defaults, options);

    this.ctx = options.ctx;
    this.vertices = options.vertices;
    this.scale = options.scale;
    this.scaleCenter = options.scaleCenter;
    this.rotate = options.rotate;
    this.colors = options.colors;
    this.hue = options.hue;

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
    const { ctx, hue, colors, maxDepth, depthOffset } = this;

    ctx.save();
    this.transform(-depthOffset);

    for (let depth = -depthOffset; depth < maxDepth; depth++) {
      this.tracePath(ctx);
      let colorOffset = (cycle + depth) % colors.length;
      // Ensure positive index;
      colorOffset = (colorOffset + colors.length) % colors.length; 

      const [hOffset, s, l] = colors[colorOffset];
      const fadingDepth = Math.max(Math.ceil(maxDepth/2), Math.min(maxDepth, 5));
      const fadeLevel = Utils.interpolateNumberLinear(depth+1, depth, zoomFactor) - fadingDepth;
      let alpha = Utils.interpolateNumberLinear(1, 0, (fadeLevel/(1+maxDepth-fadingDepth)));
      ctx.fillStyle = `hsla(${(hue+hOffset)%360},${s},${l},${alpha})`;
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
      3*diagonalDist, 
      Math.min(1/xScale, 1/yScale)
    ));

    this.maxDepth = 1 + Math.max(
      Math.ceil(-Utils.logBase(width, xScale)),
      Math.ceil(-Utils.logBase(height, yScale)),
    )
    this.maxDepth = Math.min(this.maxDepth, MAX_DEPTH_LIMIT);
  }

  static polygon({ ctx, sides, radius, rotate, scale, scaleCenter }) {
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
      rotate = angleStep / 2;
    }
    const inradiusScale = Math.abs(Math.cos(angleStep / 2));
    scale = scale || [inradiusScale, inradiusScale];
    scaleCenter = scaleCenter || defaults.scaleCenter;

    const options = {
      ctx,
      vertices,
      rotate,
      scale,
      scaleCenter
    }

    return new Shape(options);
  }
}

module.exports = Shape;