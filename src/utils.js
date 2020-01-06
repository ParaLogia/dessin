module.exports = {
  interpolateNumber: (start, end, proportion) => {
    return start + (end - start) * proportion
  },

  interpolateVector: (start, end, proportion) => {
    const vector = Array.from(start);
    for (let i = 0; i < start.length; i++) {
      vector[i] += (end[i] - start[i]) * proportion;
    }
    return vector;
  },

  transform: (ctx, params) => {
    const { scale, rotate, translate } = params;
    ctx.scale(...scale);
    ctx.rotate(rotate);
    ctx.translate(...translate);
  }
}