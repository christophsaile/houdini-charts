// styles
import './css/main.css';

// components
import LineChart from './components/line-chart/line-chart';
import RadarChart from './components/radar-chart/radar-chart';

// data
import * as mockData from '../mock/data.json';

// worklets
const bubbleBorderWorklet = new URL('./worklets/bubble-border.js', import.meta.url);
const gridBasicWorklet = new URL('./worklets/grid-basic.js', import.meta.url);
const gridRadarWorklet = new URL('./worklets/grid-radar.js', import.meta.url);
const linearPathWorklet = new URL('./worklets/linear-path.js', import.meta.url);

// currently TypeScript does not support the paintWorklet property
// @ts-ignore
CSS.paintWorklet.addModule(bubbleBorderWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(gridBasicWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(gridRadarWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(linearPathWorklet.href);

// eventListners
document.addEventListener('DOMContentLoaded', init);

// lineChart
const data = mockData;
const configLine = {
  title: 'Line Chart',
  chartType: 'Line',
  data: data,
  options: {
    titleAxis: {
      x: 'Wochentage',
      y: 'Anzahl',
    },
  },
};

const configRadar = {
  title: 'Radar Chart',
  chartType: 'Radar',
  data: data,
};

const LINECHART = new LineChart(document.getElementById('lineChart')!, configLine);
const RADARCHART = new RadarChart(document.getElementById('radarChart')!, configRadar);

function init(): void {
  LINECHART.init();
  // RADARCHART.init();
  contentLoaded();
}

function contentLoaded() {
  const getElem: HTMLElement | null = document.querySelector('.loaded');
  if (getElem) getElem.classList.add('loaded--true');
}
