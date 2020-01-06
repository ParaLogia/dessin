import "./styles/index.scss";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;

  const vertices = [[50, 50], [450, 50], [450, 450], [50, 450]];

  const transformCB = () => {
    ctx.transform(0.5, 0, 0, 0.5, 25, 25);
  }

  drawFractal(ctx, vertices, transformCB, 10);
});

function tracePolygon(ctx, vertices) {
  ctx.beginPath();
  ctx.moveTo(...vertices[0]);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(...vertices[i]);
  }
  ctx.closePath();
}

function drawFractal(ctx, vertices, transformCB, depth=1) {
  if (depth <= 0) {
    return; 
  }
  tracePolygon(ctx, vertices);
  ctx.save();
  transformCB(); 
  ctx.save();
  ctx.fillStyle = `rgb(100, 180, 250)`;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
  drawFractal(ctx,vertices, transformCB, depth-1);
  ctx.restore();
}