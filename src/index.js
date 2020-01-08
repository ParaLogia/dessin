import "./styles/index.scss";
import Shape from './shape';

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const { width, height } = canvas;

  ctx.strokeStyle = 'black';
  ctx.fillStyle = `rgb(100, 180, 250)`;
  ctx.lineWidth = 2;

  let options;

  options = {
    vertices: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
    scale: [0.75, 0.75],
    scaleCenter: [-1, -1],
    rotate: -Math.PI/2,
    ctx
  }
  options = {
    vertices: [
      [-1, 1 * Math.sqrt(3) / 3], 
      [1, 1 * Math.sqrt(3) / 3], 
      [0, -2 * Math.sqrt(3) / 3]
    ],
    scale: [0.5, 0.5],
    scaleCenter: [0, 0],
    rotate: Math.PI/3,
    ctx
  }

  for (let i = 0; i < options.vertices.length; i++) {
    options.vertices[i][0] *= width/2;
    options.vertices[i][1] *= height/2;
  }
  options.scaleCenter[0] *= width/2;
  options.scaleCenter[1] *= height/2;

  const shape = new Shape(options);

  let step = 0;
  const cycleSteps = 60;
  const startingDepth = 2;
  const maxDepth = 5000;
  const [ xScale, yScale ] = shape.scale;
  let depth = startingDepth + 1 + Math.max(
    Math.ceil(Math.log(width) / Math.log(1/xScale)),
    Math.ceil(Math.log(height) / Math.log(1/yScale)),
  )
  depth = Math.min(depth, maxDepth);

  const doStep = () => {
    ctx.save();
    ctx.clearRect(-width/2, -height/2, width, height);
    const proportion = startingDepth + (step % cycleSteps) / cycleSteps;

    shape.transform(-proportion)
    
    shape.draw(depth, Math.floor(step/cycleSteps));
    step++;

    ctx.restore();

    requestAnimationFrame(doStep);
  }

  ctx.translate(width/2, height/2);

  // shape.tracePath();
  // ctx.clip();

  requestAnimationFrame(doStep);
});