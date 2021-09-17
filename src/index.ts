// styles
import './css/main.css';

// components
import LineChart from './components/line-chart/line-chart';

// data
import * as mockData from '../mock/data.json';

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

// lineChart
const data = mockData;
const config = {
  title: 'Houdini Charts',
  chartType: 'Line',
  data: data,
  options: {
    titleAxis: {
      x: 'Wochentage',
      y: 'Anzahl',
    },
  },
};
const LINECHART = new LineChart(document.getElementById('lineChart')!, config);

function init(): void {
  LINECHART.init();
  contentLoaded();
}

function contentLoaded() {
  const getElem: HTMLElement | null = document.querySelector('.loaded');
  if (getElem) getElem.classList.add('loaded--true');
}
