import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';
import { setMinToZero } from '../../utils/set-min-to-zero';
import { roundTwoDigits } from '../../utils/round-two-digits';

// styles
import './line-chart.css';

// interfaces
import { Config } from '../../config';

// classes
import Header from '../../elements/header/header';

// worklets
const gridBasicWorklet = new URL('../../worklets/grid-basic.js', import.meta.url);
const pathLineWorklet = new URL('../../worklets/path-line.js', import.meta.url);
// @ts-ignore
CSS.paintWorklet.addModule(gridBasicWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(pathLineWorklet.href);

class LineChart {
  constructor(private readonly container: HTMLElement, private readonly config: Config) {
    this.init();
  }

  private scaleSettings = this.config.data.scale;
  private datasets = this.config.data.datasets;
  private xaxis = this.config.data.xaxis;
  private options = this.config.options;
  private autoScale = this.scaleSettings.auto;
  private min = {
    x: 0,
    y: this.autoScale ? getMinValue(flattenDataset(this.datasets)) : this.scaleSettings.min!,
  };
  private max = {
    x: this.xaxis.length - 1,
    y: this.autoScale ? getMaxValue(flattenDataset(this.datasets)) : this.scaleSettings.max!,
  };
  private niceNumbers = niceScale(this.min.y, this.max.y);
  private range = {
    x: this.max.x - this.min.x,
    y: this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum,
    zeroY: setMinToZero(this.niceNumbers.niceMinimum, this.niceNumbers.niceMaximum),
  };
  private segments = {
    x: this.max.x,
    y: (this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum) / this.niceNumbers.tickSpacing,
  };
  private gridColor = this.options?.gridColor ? this.options.gridColor : '#ccc';

  private init = () => {
    this.render();
    this.styles();
    this.events();
  };

  private render = () => {
    this.renderWrapper();
    this.renderHeader();
    this.renderAxisTitle();
    this.renderChart();
    this.renderYaxis();
    this.renderXAxis();
    this.renderDatasets();
  };

  private renderWrapper = () => {
    const template = `
      <div class='houdini houdini--line'></div>
    `;

    this.container.innerHTML = template;
  };

  private renderHeader = () => {
    this.container.querySelector('.houdini')!.innerHTML += Header(this.config);
  };

  private renderAxisTitle = () => {
    this.config.options?.titleAxis?.x && this.renderTitleX();
    this.config.options?.titleAxis?.y && this.renderTitleY();
  };

  private renderTitleY = () => {
    const template = `<h3 class='houdini__ytitle'>${this.config.options?.titleAxis?.y}</h3>`;
    this.container.querySelector('.houdini')!.innerHTML += template;
  };

  private renderTitleX = () => {
    const template = `<h3 class='houdini__xtitle'>${this.config.options?.titleAxis?.x}</h3>`;
    this.container.querySelector('.houdini')!.innerHTML += template;
  };

  private renderChart = () => {
    const template = `<section class='houdini__chart'></section>`;
    this.container.querySelector('.houdini')!.innerHTML += template;
  };

  private renderYaxis = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    let template: string = '';
    let j = 0;

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      const percentage = (j / this.segments.y) * 100;
      const perTwoDigits = Math.round(percentage * 100) / 100;
      // -8px because fontSize = 16px / 2
      template += `<span class='houdini__ylabel' style='bottom: calc(${perTwoDigits}% - 8px)'>${i}</span>`;
      j = j + 1;
    }

    this.container.querySelector(
      '.houdini__chart'
    )!.innerHTML += `<section class='houdini__yaxis'>${template}</section>`;
  };

  private renderXAxis = () => {
    let template: string = '';

    for (let i = this.min.x; i <= this.max.x; i++) {
      const segmentWidth = 100 / this.segments.x;
      const percantage = (i / this.segments.x) * 100 - segmentWidth / 2;
      template += `<span class='houdini__xlabel' style='left: ${percantage}%; width: ${segmentWidth}%'>${this.xaxis[i]}</span>`; // -8px because fontSize = 16px / 2
    }

    this.container.querySelector('.houdini__chart')!.innerHTML += `
      <section class='houdini__xaxis'>
      ${template}
      </section>
    `;
  };

  private renderDatasets = () => {
    const template = `
      <section class='houdini__datasets'>
        ${this.datasets
          .map((set) => {
            return `<div id='${set.name}' class='houdini__dataset'>${this.renderDataset(
              set.values
            )}</div>`;
          })
          .join('')}
      </section>
    `;
    this.container.querySelector('.houdini__chart')!.innerHTML += template;
  };

  private renderDataset = (values: number[]) => {
    return `
      ${values.map(() => `<span class='houdini__datapoint'></span>`).join('')}
    `;
  };

  private styles = () => {
    this.setGrid();
    this.setPath();
    this.setDatapoints();
  };

  private setGrid = () => {
    const elem = this.container.querySelector('.houdini__datasets')!;
    // @ts-ignore
    elem.attributeStyleMap.set('background', 'paint(grid-basic)');
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-segmentsX', this.segments.x);
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-segmentsY', this.segments.y);
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-color', this.gridColor);
  };

  private setPath = () => {
    const elems = this.container.querySelectorAll('.houdini__dataset');
    elems.forEach((elem, index) => {
      // @ts-ignore
      elem.attributeStyleMap.set('background', 'paint(path-line)');
      // @ts-ignore
      elem.attributeStyleMap.set('--path-points', JSON.stringify(this.datasets[index].values));
      // @ts-ignore
      elem.attributeStyleMap.set('--path-range', JSON.stringify(this.range));
      // @ts-ignore
      elem.attributeStyleMap.set('--path-color', this.datasets[index].color);
    });
  };

  private setDatapoints = () => {
    const elems = this.container.querySelectorAll('.houdini__dataset');
    elems.forEach((elem, index) => {
      const color = this.datasets[index].color;

      elem.querySelectorAll('.houdini__datapoint').forEach((datapoint, innerIndex) => {
        const x = innerIndex;
        const y = this.datasets[index].values[innerIndex];
        const percentageX = (x / this.range.x) * 100;
        const percentageY = (y / this.range.y - this.range.zeroY) * 100;

        // @ts-ignore
        datapoint.attributeStyleMap.set('background-color', color);
        // -5px because dotSize = 10 / 2
        (datapoint as HTMLElement).style.left = `calc(${percentageX}% - 5px)`;
        (datapoint as HTMLElement).style.bottom = `calc(${percentageY}% - 5px)`;
      });
    });
  };

  private events = () => {
    this.highlightDatapoint();
  };

  private highlightDatapoint = () => {
    const container: HTMLElement = this.container.querySelector('.houdini__datasets')!;
    const datapoints = document.querySelectorAll('.houdini__datapoint');

    container.addEventListener('click', () => this.handleGridClick(container));
    datapoints.forEach((elem) => {
      elem.addEventListener('click', (event) => this.handleDatapointClick(event, container));
    });
  };

  private handleGridClick = (container: HTMLElement) => {
    // @ts-ignore
    container.attributeStyleMap.set('--grid-highlight', '{"x": 0, "y": 0}');
  };

  private handleDatapointClick = (event: Event, container: HTMLElement) => {
    const position = {
      // @ts-ignore
      x: event.target.attributeStyleMap.get('left').values[0].value,
      // @ts-ignore
      y: event.target.attributeStyleMap.get('bottom').values[0].value,
    };
    // @ts-ignore
    container.attributeStyleMap.set('--grid-highlight', JSON.stringify(position));
    event.stopPropagation();
  };
}

export default LineChart;
