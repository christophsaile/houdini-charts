import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';
import { setMinToZero } from '../../utils/set-min-to-zero';

// styles
import './radar-chart.css';

// interfaces
import { Config } from '../../config';

// classes
import Header from '../../elements/header/header';

class RadarChart {
  constructor(private readonly container: HTMLElement, private readonly config: Config) {
    this.init();
  }

  private scaleSettings = this.config.data.scale;
  private datasets = this.config.data.datasets;
  private xaxis = this.config.data.xaxis;
  private options = this.config.options;

  private autoScale = this.scaleSettings.auto;
  private min = this.autoScale
    ? getMinValue(flattenDataset(this.datasets))
    : this.scaleSettings.min!;
  private max = this.autoScale
    ? getMaxValue(flattenDataset(this.datasets))
    : this.scaleSettings.max!;
  private niceNumbers = niceScale(this.min, this.max);
  private range = {
    y: this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum,
    zeroY: setMinToZero(this.niceNumbers.niceMinimum, this.niceNumbers.niceMaximum),
  };
  private segments =
    (this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum) / this.niceNumbers.tickSpacing +
    1; // todo: check why + 1 is needed to show top lane

  private numberOfAxis = () => {
    let length;
    if (this.xaxis.length < 3) {
      length = 3;
    } else if (this.xaxis.length > 10) {
      length = 10;
    } else {
      length = this.xaxis.length;
    }
    return length;
  };

  private gridColor = this.options?.gridColor ? this.options.gridColor : '#ccc';

  private init = () => {
    this.render();
  };

  private render = () => {
    // move renderDefaultTemplate function up in render function ???
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='houdini houdini--radar'>
        ${Header(this.config)}
        ${this.renderChart()}
      </div>
    `;
    this.container.innerHTML = defaultTemplate;
  };

  private renderChart = () => {
    return `
      <section class='houdini__chart' style='${this.setGridStyle()}'>
        ${this.renderXaxis()}
        ${this.renderYaxis()}
        ${this.renderDatasets()}
      </section>
    `;
  };

  private setGridStyle = () => {
    return `background:paint(grid-radar); --grid-xaxis:${this.numberOfAxis()}; --grid-segments:${
      this.segments
    }; --grid-color:${this.gridColor}`;
  };

  private renderXaxis = () => {
    return `
      <div class='houdini__xaxis'>
        ${this.xaxis}
      </div>
    `;
  };

  private renderYaxis = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    let template: string = '';
    let j = 0;

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      const percentage = (j / (this.segments - 1)) * 100;
      const perTwoDigits = Math.round(percentage * 100) / 100;
      template += `<span class='houdini__ylabel' style='bottom:${perTwoDigits}%'>${i}</span>`; // -8px because fontSize = 16px / 2
      j = j + 1;
    }

    return `
    <section class='houdini__yaxis'>${template}</section>
    `;
  };

  private renderDatasets = () => {
    return this.datasets
      .map(
        (set) =>
          `<div id='${set.name}' class='houdini__dataset' style='${this.setPathStyles(
            set.values,
            set.color
          )}'>${this.renderDatapoints(set.values, set.color)}</div>`
      )
      .join('');
  };

  private setPathStyles = (values: number[], color?: string) => {
    return `background:paint(path-radar); --path-points:${JSON.stringify(
      values
    )}; --path-xaxis:${this.numberOfAxis()}; --path-range:${JSON.stringify(
      this.range
    )}; --path-color:${color};`;
  };

  private renderDatapoints = (values: number[], color?: string) => {
    return values.map((value) => `<span class='houdini__datapoint'>${value}</span>`).join('');
  };
}

export default RadarChart;
