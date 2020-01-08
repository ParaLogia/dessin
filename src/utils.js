
function interpolateNumberLinear(start, end, proportion) {
  return start + (end - start) * proportion;
}

function interpolateNumberLogarithmic(start, end, proportion) {
  return Math.pow(end, proportion) * Math.pow(start, 1-proportion);
}

function interpolateVectorLinear(start, end, proportion) {
  const vector = Array.from(start);
  for (let i = 0; i < start.length; i++) {
    vector[i] += (end[i] - start[i]) * proportion;
  }
  return vector;
}

function interpolateVectorLogarithmic(start, end, proportion) {
  const vector = Array.from(start);
  for (let i = 0; i < start.length; i++) {
    vector[i] = interpolateNumberLogarithmic(start[i], end[i], proportion)
  }
  return vector;
}

function scaleFrom(ctx, scaleX, scaleY, centerX, centerY) {
  ctx.translate(centerX, centerY);
  ctx.scale(scaleX, scaleY);
  ctx.translate(-centerX, -centerY);
}

function rotateAround(ctx, angle, centerX, centerY) {
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.translate(-centerX, -centerY);
}

function applyTransform(ctx, params) {
  const { scale, rotate, scaleCenter=[0,0], rotateCenter=[0, 0] } = params;
  scaleFrom(ctx, ...scale, ...scaleCenter);
  rotateAround(ctx, rotate, ...rotateCenter);
}

function invertTransform(params) {
  const { 
    scale: [scaleX, scaleY], 
    rotate
  } = params;
  return {
    scale: [1/scaleX, 1/scaleY],
    rotate: -rotate
  }
}

module.exports = {
  interpolateNumberLinear, 
  interpolateNumberLogarithmic, 
  interpolateVectorLinear,
  interpolateVectorLogarithmic,
  scaleFrom,
  rotateAround,
  applyTransform,
  invertTransform
}