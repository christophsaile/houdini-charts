import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';

// styles
import './line-chart.css';

// Interfaces
import { Data, Datavalue } from '../../data';
import { flattenDataset } from '../../utils/flatten-dataset';

class LineChart {
  constructor(private readonly data: Data) {}

  private getScaleSettings = this.data.data.scale;
  private getDatasets = this.data.data.datasets;
  private getLabels = this.data.data.labels;
  private getOptions = this.data.options;

  private autoScale = this.getScaleSettings.auto;
  private minY = this.autoScale
    ? getMinValue(flattenDataset(this.getDatasets, 'y'))
    : this.getScaleSettings.min!;
  private maxY = this.autoScale
    ? getMaxValue(flattenDataset(this.getDatasets, 'y'))
    : this.getScaleSettings.max!;
  private minX = 0;
  private maxX = this.getLabels.length;
  private niceNumbers = niceScale(this.minY, this.maxY);
  private numberOfSegmentsY = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    return (niceMaximum - niceMinimum) / tickSpacing;
  };
  private numberOfSegmentsX = this.maxX;

  private gridColor = this.getOptions?.gridColor ? this.getOptions.gridColor : '#ccc';

  private getRenderLocation = (): HTMLElement => {
    return document.querySelector('#lineChart')!;
  };

  public init = () => {
    this.render();
  };

  private render = () => {
    // move renderDefaultTemplate function up in render function ???
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='lineChart__wrapper'>
        ${this.data.title && this.renderTitle()}
        ${this.data.options?.titleAxis?.y && this.renderTitleY()}
        ${this.data.options?.titleAxis?.x && this.renderTitelX()}
        ${this.renderChart()}
      </div>
    `;
    this.getRenderLocation().innerHTML = defaultTemplate;
  };

  private renderTitle = () => {
    return `<h2 class='lineChart__title loaded'>${this.data.title}</h2>`;
  };

  private renderTitleY = () => {
    return `<h3 class='lineChart__title-y'>${this.data.options?.titleAxis?.y}</h3>`;
  };

  private renderTitelX = () => {
    return `<h3 class='lineChart__title-x'>${this.data.options?.titleAxis?.x}</h3>`;
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
    // let j = 0;

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      // const percantage = (j / this.numberOfSegmentsY()) * 100;
      // style='bottom: ${percantage}%
      template += `<span class='lineChart__label-y'>${i}</span>`;
      // j = j + 1;
    }

    return `
      <section class='lineChart__chart-y'>${template}</section>
    `;
  };

  private renderChartX = () => {
    return `
      <section class='lineChart__chart-x'>
        ${this.getLabels.map((text) => `<span class='lineChart__label-x'>${text}</span>`).join('')}
      </section>
    `;
  };

  private renderData = () => {
    return `
      <section class='lineChart__data' style='${this.setDataStyle()}'>
        ${this.getDatasets
          .map((set) => {
            return `<section id='${
              set.name
            }' class='lineChart__dataset' style='${this.setDatasetStyle(
              set.values,
              set.color
            )}'>${this.renderDataset(set.values, set.color)}</section>`;
          })
          .join('')}
      </section>
    `;
  };

  private setDataStyle = () => {
    return `background: paint(grid); --grid-segementsX:${
      this.numberOfSegmentsX
    }; --grid-segementsY:${this.numberOfSegmentsY()}; --grid-color: ${this.gridColor}`;
  };

  private setDatasetStyle = (values: Datavalue[], color?: string) => {
    return `--path-data:${JSON.stringify(
      values
    )}; --path-color:${color}; background: paint(linearPath)`;
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
    const { niceMinimum, niceMaximum } = this.niceNumbers;
    const rangeX = this.maxX - this.minX;
    const rangeY = niceMaximum - niceMinimum;

    // const centerDotsX = 100 / this.numberOfSegmentsX / 2; // Add value to perctangeX
    const percentageX = (value.x / rangeX) * 100;
    const percentageY = (value.y / rangeY) * 100;

    const xTwoDigits = Math.round(percentageX * 100) / 100;
    const yTwoDigits = Math.round(percentageY * 100) / 100;

    return `background-color: ${color}; left: calc(${xTwoDigits}% - 5px); bottom: calc(${yTwoDigits}% - 5px)`;
  };
}

export default LineChart;
