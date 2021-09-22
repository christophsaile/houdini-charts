import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';

// styles
import './line-chart.css';

// Interfaces
import { Config, Datavalue } from '../../data';
import { flattenDataset } from '../../utils/flatten-dataset';

class LineChart {
  constructor(private readonly container: HTMLElement, private readonly config: Config) {}

  private scaleSettings = this.config.data.scale;
  private datasets = this.config.data.datasets;
  private labels = this.config.data.labels;
  private options = this.config.options;

  private autoScale = this.scaleSettings.auto;
  private min = {
    x: 0,
    y: this.autoScale ? getMinValue(flattenDataset(this.datasets, 'y')) : this.scaleSettings.min!,
  };
  private max = {
    x: this.labels.length - 1,
    y: this.autoScale ? getMaxValue(flattenDataset(this.datasets, 'y')) : this.scaleSettings.max!,
  };
  private niceNumbers = niceScale(this.min.y, this.max.y);
  private range = {
    x: this.max.x - this.min.x,
    y: this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum,
  };
  private segments = {
    x: this.max.x,
    y: (this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum) / this.niceNumbers.tickSpacing,
  };

  private gridColor = this.options?.gridColor ? this.options.gridColor : '#ccc';

  public init = () => {
    this.render();
    this.addEvents();
  };

  private render = () => {
    // move renderDefaultTemplate function up in render function ???
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='lineChart__wrapper'>
        ${this.config.title && this.renderTitle()}
        ${this.config.options?.titleAxis?.y && this.renderTitleY()}
        ${this.config.options?.titleAxis?.x && this.renderTitelX()}
        ${this.renderChart()}
      </div>
    `;
    this.container.innerHTML = defaultTemplate;
  };

  private renderTitle = () => {
    return `<h2 class='lineChart__title loaded'>${this.config.title}</h2>`;
  };

  private renderTitleY = () => {
    return `<h3 class='lineChart__title-y'>${this.config.options?.titleAxis?.y}</h3>`;
  };

  private renderTitelX = () => {
    return `<h3 class='lineChart__title-x'>${this.config.options?.titleAxis?.x}</h3>`;
  };

  private renderChart = () => {
    return `
      <section class='lineChart__chart'>
      ${this.renderChartY()}
      ${this.renderChartX()}
      ${this.renderData()}
      </section>
    `;
  };

  private renderChartY = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    let template: string = '';
    let j = 0;

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      const percantage = (j / this.segments.y) * 100;
      template += `<span class='lineChart__label-y' style='bottom: calc(${percantage}% - 8px)'>${i}</span>`; // -8px because fontSize = 16px / 2
      j = j + 1;
    }

    return `
      <section class='lineChart__chart-y'>${template}</section>
    `;
  };

  private renderChartX = () => {
    let template: string = '';

    for (let i = this.min.x; i <= this.max.x; i++) {
      const segmentWidth = 100 / this.segments.x;
      const percantage = (i / this.segments.x) * 100 - segmentWidth / 2;
      template += `<span class='lineChart__label-x' style='left: ${percantage}%; width: ${segmentWidth}%'>${this.labels[i]}</span>`; // -8px because fontSize = 16px / 2
    }

    return `
      <section class='lineChart__chart-x'>
      ${template}
      </section>
    `;
  };

  private renderData = () => {
    return `
      <section class='lineChart__data' style='${this.setGridStyle()}'>
        ${this.datasets
          .map((set) => {
            return `<section id='${set.name}' class='lineChart__dataset' style='${this.setPathStyle(
              set.values,
              set.color
            )}'>${this.renderDataset(set.values, set.color)}</section>`;
          })
          .join('')}
      </section>
    `;
  };

  private setGridStyle = () => {
    return `background: paint(grid); --grid-segementsX:${this.segments.x}; --grid-segementsY:${this.segments.y}; --grid-color: ${this.gridColor}`;
  };

  private setPathStyle = (values: Datavalue[], color?: string) => {
    return `background: paint(linearPath); --path-points:${JSON.stringify(
      values
    )}; --path-range:${JSON.stringify(this.range)}; --path-color:${color};`;
  };

  private renderDataset = (values: Datavalue[], color?: string) => {
    return `
      ${values
        .map(
          (value) =>
            `<span class='lineChart__datapoint' style='${this.setDatapointStyle(
              value,
              color
            )}'></span>`
        )
        .join('')}
    `;
  };

  private setDatapointStyle = (value: Datavalue, color?: string) => {
    const percentageX = (value.x / this.range.x) * 100;
    const percentageY = (value.y / this.range.y) * 100;

    const xTwoDigits = Math.round(percentageX * 100) / 100;
    const yTwoDigits = Math.round(percentageY * 100) / 100;

    return `background-color: ${color}; left: calc(${xTwoDigits}% - 5px); bottom: calc(${yTwoDigits}% - 5px)`; // -5px because dotSize = 10 / 2
  };

  private addEvents = () => {
    this.datapointEvents();
  };

  private datapointEvents = () => {
    const getDatapoints = document.querySelectorAll('.lineChart__datapoint');
    getDatapoints.forEach((elem) => {
      elem.addEventListener('click', () => this.handleDatapointClick(elem));
    });
  };

  private handleDatapointClick = (elem: Element) => {
    const getGrid = this.container.querySelector('.lineChart__data');
    const position = {
      // @ts-ignore
      x: elem.attributeStyleMap.get('left').values[0].value,
      // @ts-ignore
      y: elem.attributeStyleMap.get('bottom').values[0].value,
    };

    // @ts-ignore
    getGrid.attributeStyleMap.set('--grid-highlight', JSON.stringify(position));
  };
}

export default LineChart;
