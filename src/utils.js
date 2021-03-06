
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
  const { scale, rotate, center} = params;
  const [centerX, centerY] = center;
  ctx.translate(centerX, centerY);
  ctx.scale(...scale);
  ctx.rotate(rotate);
  ctx.translate(-centerX, -centerY);
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


// Finds the fixed point of an affine transformation represented by a 3x3 matrix
// Note: Input matrix should be formatted like a DOMMatrix from the Canvas API
function fixedPoint(matrix) {
  const { a, b, c, d, e: dx, f: dy } = matrix;

  const subMatrix = [
    [ 1-a,  0-c ],
    [ 0-b,  1-d ]
  ]
  const invSubMatrix = invertMatrix(subMatrix);
  const translationVec = [dx, dy];
  return matVecMultiply(invSubMatrix, translationVec);
}

// Inverts a matrix representing an affine or linear transformation
function invertMatrix(matrix) {
  const [[a, c, dx], [b, d, dy], ..._] = matrix;
  
  const det = a*d - b*c; 

  if (dx || dy) {
    // Affine
    return [
      [  d/det,   -c/det,   (c*dy-d*dx)/det ],
      [ -b/det,    a/det,   (b*dx-a*dy)/det ],
      [ 0,         0,       1               ]
    ]
  } else {
    // Linear
    return [
      [  d/det,   -c/det ],
      [ -b/det,    a/det ]  
    ]
  }
}

function matVecMultiply(mat, vec) {
  const res = vec.map(() => 0);
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < vec.length; j++) {
      res[i] += vec[j]*mat[i][j];
    }
  }
  return res;
}

function logBase(num, base=Math.e) {
  return Math.log(num) / Math.log(base);
}

module.exports = {
  interpolateNumberLinear, 
  interpolateNumberLogarithmic, 
  interpolateVectorLinear,
  interpolateVectorLogarithmic,
  scaleFrom,
  rotateAround,
  applyTransform,
  invertTransform,
  fixedPoint,
  invertMatrix,
  matVecMultiply,
  logBase
}