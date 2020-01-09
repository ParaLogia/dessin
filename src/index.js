import "./styles/index.scss";
import Showcase from './showcase';

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.9;
  const showcase = new Showcase(canvas);
  showcase.play();
});