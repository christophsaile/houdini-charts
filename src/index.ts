// styles
import './css/main.css';

// worklets
const worklet = new URL('./worklets/worklet.js', import.meta.url);

// currently TypeScript does not support the paintWorklet property
// @ts-ignore
CSS.paintWorklet.addModule(worklet.href);

// eventListners
document.addEventListener('DOMContentLoaded', init);

function init(): void {
  isLoaded();
}

function isLoaded(): void {
  const getElem: HTMLElement | null = document.querySelector('.loaded');
  if (getElem) getElem.classList.add('true');
}
