import "./styles/range.scss";
import "./styles/index.scss";
import Showcase from './showcase';

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const showcase = new Showcase(canvas);

  window.onresize = () => {
    showcase.width = canvas.width = window.innerWidth;
    showcase.height = canvas.height = window.innerHeight;
    showcase.setupCanvas();
  }
  showcase.play();
});