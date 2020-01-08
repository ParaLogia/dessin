import "./styles/index.scss";
import Shape from './shape';

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'black';
  ctx.fillStyle = `rgb(100, 180, 250)`;
  ctx.lineWidth = 2;

  let options;

  options = {
    vertices: [[-200, -200], [200, -200], [200, 200], [-200, 200]],
    scale: [0.5, 0.5],
    scaleCenter: [-200, -200],
    rotate: -Math.PI/2,
    vanishingPt: [-120, -40],
    ctx
  }

  // options = {
  //   vertices: [
  //     [-200, 200 * Math.sqrt(3) / 3], 
  //     [200, 200 * Math.sqrt(3) / 3], 
  //     [0, -400 * Math.sqrt(3) / 3]
  //   ],
  //   scale: [0.5, 0.5],
  //   // scaleCenter: [0, 200 * Math.sqrt(3) / 3],
  //   rotate: Math.PI,
  //   ctx
  // }

  const shape = new Shape(options);

  let step = 0;
  const cycleSteps = 100;

  const doStep = () => {
    ctx.save();
    ctx.clearRect(-300, -300, 600, 600);
    const proportion = 2 + (step % cycleSteps) / cycleSteps;

    shape.zoomOut(proportion)
    
    shape.draw(15, Math.floor(step/cycleSteps));
    step++;

    ctx.restore();

    setTimeout(doStep, 20);
  }

  ctx.resetTransform();
  ctx.translate(300, 300);

  shape.tracePath();
  ctx.clip();

  doStep();
});