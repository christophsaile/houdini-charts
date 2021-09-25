import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';

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
  private labels = this.config.data.labels;
  private options = this.config.options;

  private autoScale = this.scaleSettings.auto;
  private min = this.autoScale
    ? getMinValue(flattenDataset(this.datasets))
    : this.scaleSettings.min!;
  private max = this.autoScale
    ? getMaxValue(flattenDataset(this.datasets))
    : this.scaleSettings.max!;
  private niceNumbers = niceScale(this.min, this.max);
  private range = this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum;
  private segments =
    (this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum) / this.niceNumbers.tickSpacing;

  private numberOfLabels = () => {
    let length;
    if (this.labels.length < 3) {
      length = 3;
    } else if (this.labels.length > 10) {
      length = 10;
    } else {
      length = this.labels.length;
    }
    return length;
  };

  private gridColor = this.options?.gridColor ? this.options.gridColor : '#ccc';

  private init = () => {
    // console.log('min, max', this.min, this.max);
    // console.log('range', this.range);
    // console.log('segments', this.segments);

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
        ${this.renderLabels()}
        ${this.renderDatasets()}
      </section>
    `;
  };

  private setGridStyle = () => {
    return `background: paint(grid-radar); --grid-labels:${this.numberOfLabels()}; --grid-segments:${
      this.segments
    }; --grid-color: ${this.gridColor}`;
  };

  private renderLabels = () => {
    return `
      <div class='houdini__labels'>
        ${this.labels}
      </div>
    `;
  };

  private renderDatasets = () => {
    return this.datasets
      .map(
        (set) =>
          `<div class='houdini__dataset' style='${this.setPathStyles()}'>${this.renderDatapoints(
            set.values,
            set.color
          )}</div>`
      )
      .join('');
  };

  private setPathStyles = () => {
    return `background: paint(radar-path);`;
  };

  private renderDatapoints = (values: number[], color?: string) => {
    return values.map((value) => `<span class='houdini__datapoint'>${value}</span>`).join('');
  };
}

export default RadarChart;
