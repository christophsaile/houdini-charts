import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';
import { setMinToZero } from '../../utils/set-min-to-zero';

// styles
import './line-chart.css';

// Interfaces
import { Config } from '../../config';
import { roundTwoDigits } from '../../utils/round-two-digits';

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
    this.addEvents();
  };

  private render = () => {
    // move renderDefaultTemplate function up in render function ???
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='houdini houdini--line lineChart__wrapper'>
        ${this.config.title && this.renderTitle()}
        ${this.config.options?.titleAxis?.y && this.renderTitleY()}
        ${this.config.options?.titleAxis?.x && this.renderTitleX()}
        ${this.renderChart()}
      </div>
    `;

    this.container.innerHTML = defaultTemplate;
  };

  private renderTitle = () => {
    return `<h2 class='lineChart__title loaded'>${this.config.title}</h2>`;
  };

  private renderTitleY = () => {
    return `<h3 class='lineChart__ytitle'>${this.config.options?.titleAxis?.y}</h3>`;
  };

  private renderTitleX = () => {
    return `<h3 class='lineChart__xtitle'>${this.config.options?.titleAxis?.x}</h3>`;
  };

  private renderChart = () => {
    return `
      <section class='lineChart__chart'>
      ${this.renderYaxis()}
      ${this.renderXAxis()}
      ${this.renderData()}
      </section>
    `;
  };

  private renderYaxis = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    let template: string = '';
    let j = 0;

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      const percentage = (j / this.segments.y) * 100;
      const perTwoDigits = Math.round(percentage * 100) / 100;
      template += `<span class='lineChart__ylabel' style='bottom: calc(${perTwoDigits}% - 8px)'>${i}</span>`; // -8px because fontSize = 16px / 2
      j = j + 1;
    }

    return `
      <section class='lineChart__yaxis'>${template}</section>
    `;
  };

  private renderXAxis = () => {
    let template: string = '';

    for (let i = this.min.x; i <= this.max.x; i++) {
      const segmentWidth = 100 / this.segments.x;
      const percantage = (i / this.segments.x) * 100 - segmentWidth / 2;
      template += `<span class='lineChart__xlabel' style='left: ${percantage}%; width: ${segmentWidth}%'>${this.xaxis[i]}</span>`; // -8px because fontSize = 16px / 2
    }

    return `
      <section class='lineChart__xaxis'>
      ${template}
      </section>
    `;
  };

  private renderData = () => {
    return `
      <section class='lineChart__datasets' style='${this.setGridStyle()}'>
        ${this.datasets
          .map((set) => {
            return `<div id='${set.name}' class='lineChart__dataset' style='${this.setPathStyle(
              set.values,
              set.color
            )}'>${this.renderDataset(set.values, set.color)}</div>`;
          })
          .join('')}
      </section>
    `;
  };

  private setGridStyle = () => {
    return `background:paint(grid-basic); --grid-segementsX:${this.segments.x}; --grid-segementsY:${this.segments.y}; --grid-color:${this.gridColor}`;
  };

  private setPathStyle = (values: number[], color?: string) => {
    return `background:paint(path-line); --path-points:${JSON.stringify(
      values
    )}; --path-range:${JSON.stringify(this.range)}; --path-color:${color};`;
  };

  private renderDataset = (values: number[], color?: string) => {
    return `
      ${values
        .map(
          (y, x) =>
            `<span class='lineChart__datapoint' style='${this.setDatapointStyle(
              y,
              x,
              color
            )}'></span>`
        )
        .join('')}
    `;
  };

  private setDatapointStyle = (y: number, x: number, color?: string) => {
    const percentageX = (x / this.range.x) * 100;
    const percentageY = (y / this.range.y - this.range.zeroY) * 100;

    // -5px because dotSize = 10 / 2
    return `background-color:${color}; left:calc(${roundTwoDigits(
      percentageX
    )}% - 5px); bottom:calc(${roundTwoDigits(percentageY)}% - 5px)`;
  };

  private addEvents = () => {
    this.highlightDatapoint();
  };

  private highlightDatapoint = () => {
    const container: HTMLElement = this.container.querySelector('.lineChart__datasets')!;
    const datapoints = document.querySelectorAll('.lineChart__datapoint');

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
