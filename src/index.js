import "./styles/index.scss";
import Shape from './shape';
const { transform } = require('./utils');

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

  let step = 10;
  const doStep = () => {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 600, 600);
    ctx.translate(300, 300);
    transform(ctx, shape.interpolateTransform(step / 10));
    const baseTransform = ctx.getTransform();
    
    shape.draw(baseTransform, 7);
    step--;

    if (step >= 0) {
      setTimeout(doStep, 500);
    }
  }

  doStep();
});