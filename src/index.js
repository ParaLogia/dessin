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
    vertices: [[-200, -200], [200, -200], [200, 200], [-200, 200]],
    scale: [0.5, 0.5],
    scaleCenter: [-200, -200],
    rotate: -Math.PI/2,
    ctx
  }

  // options = {
  //   vertices: [
  //     [-200, 200 * Math.sqrt(3) / 3], 
  //     [200, 200 * Math.sqrt(3) / 3], 
  //     [0, -400 * Math.sqrt(3) / 3]
  //   ],
  //   scale: [0.5, 0.5],
  //   scaleCenter: [0, -200 * Math.sqrt(3) / 3],
  //   rotate: Math.PI/3,
  //   ctx
  // }

  const shape = new Shape(options);

  let step = 0;
  const cycleSteps = 100;
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
    ctx.clearRect(-300, -300, 600, 600);
    const proportion = startingDepth + (step % cycleSteps) / cycleSteps;

    shape.transform(-proportion)
    
    shape.draw(depth, Math.floor(step/cycleSteps));
    step++;

    ctx.restore();

    setTimeout(doStep, 20);
  }

  ctx.resetTransform();

  shape.computeFixedPoint(5);
  ctx.translate(300, 300);

  shape.tracePath();
  ctx.clip();

  doStep();
});