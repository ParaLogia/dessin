import "./styles/range.scss";
import "./styles/index.scss"; 
import "./styles/modal.scss"
import Showcase from './showcase';

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const showcase = new Showcase(canvas);
});