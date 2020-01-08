import "./styles/index.scss";
import Showcase from './showcase';

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas');
  const showcase = new Showcase(canvas);
  showcase.play();
});