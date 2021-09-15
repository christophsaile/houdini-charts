// styles
import './css/main.css';

// components
import LineChart from './components/line-chart/line-chart';

// data
import * as data from '../mock/data.json';

// worklets
const bubbleBorderWorklet = new URL('./worklets/bubble-border.js', import.meta.url);
const gridWorklet = new URL('./worklets/grid.js', import.meta.url);
const linearPathWorklet = new URL('./worklets/linear-path.js', import.meta.url);
// currently TypeScript does not support the paintWorklet property

// @ts-ignore
CSS.paintWorklet.addModule(bubbleBorderWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(gridWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(linearPathWorklet.href);

// eventListners
document.addEventListener('DOMContentLoaded', init);

// classes
const LINECHART = new LineChart(data);

function init(): void {
  LINECHART.init();
  contentLoaded();
}

function contentLoaded(): void {
  const getElem: HTMLElement | null = document.querySelector('.loaded');
  if (getElem) getElem.classList.add('loaded--true');
}
