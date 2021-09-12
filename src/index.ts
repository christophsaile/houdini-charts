// styles
import './css/main.css';

// components
import LineChart from './components/line-chart/line-chart';

// data
import * as data from '../mock/data.json';

// worklets
const worklet = new URL('./worklets/worklet.js', import.meta.url);
// currently TypeScript does not support the paintWorklet property
// @ts-ignore
//CSS.paintWorklet.addModule(worklet.href);

// eventListners
document.addEventListener('DOMContentLoaded', init);

// classes
const LINECHART = new LineChart(data);

function init(): void {
  contentLoaded();
  LINECHART.init();
}

function contentLoaded(): void {
  const getElem: HTMLElement | null = document.querySelector('.loaded');
  if (getElem) getElem.classList.add('true');
}
