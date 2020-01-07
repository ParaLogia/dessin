import "./styles/index.scss";
import Shape from './shape';
const Utils = require('./utils');

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'black';
  ctx.fillStyle = `rgb(100, 180, 250)`;
  ctx.lineWidth = 2;

  const options = {
    vertices: [[-200, -200], [200, -200], [200, 200], [-200, 200]],
    scale: [0.5, 0.5],
    translate: [-200, -200],
    // rotate: Math.PI/2,
    ctx
  }

  const shape = new Shape(options);


  let step = 0;
  const cycleSteps = 100;

  const doStep = () => {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 600, 600);
    ctx.translate(300, 300);
    Utils.applyTransform(ctx, shape.interpolateInverseTransform(1.0));
    Utils.applyTransform(ctx, shape.interpolateInverseTransform((step % cycleSteps) / cycleSteps));
    const baseTransform = ctx.getTransform();
    
    shape.draw(baseTransform, 12, Math.floor(step/cycleSteps));
    step++;

    setTimeout(doStep, 50);
  }

  doStep();
});