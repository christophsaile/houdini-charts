import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';
import { setMinToZero } from '../../utils/set-min-to-zero';
import { debounce } from '../../utils/debounce';

// styles
import './radar-chart.css';

// interfaces
import { Config } from '../../config';
import { coordinates } from '../../utils/utils';

// classes
import Header from '../../elements/header/header';
import { getRadarPoints } from '../../utils/get-radar-points-';

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
  // todo: check why + 1 is needed to show top lane
  private segments =
    (this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum) / this.niceNumbers.tickSpacing +
    1;
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
  private pathFill = this.options?.fill ? true : false;
  private gridColor = this.options?.gridColor ? this.options.gridColor : '#ccc';
  private chartSize: coordinates = {
    x: 0,
    y: 0,
  };
  private datapointCoordinates: coordinates[][] = [];
  private getDatapointCoordinates = () => {
    const datapoints = this.datasets.map((set) => {
      return getRadarPoints(set.values, this.chartSize, this.range);
    });
    return datapoints;
  };

  private init = () => {
    this.render();
    this.styles();
    this.listeners();
  };

  private render = () => {
    this.renderWrapper();
    this.renderHeader();
    this.renderChart();
    this.renderYaxis();
    this.renderXaxis();
    this.renderDatasets();
    this.renderDatapoints();
  };

  private renderWrapper = () => {
    const template = `<div class='houdini houdini--radar'></div>`;
    this.container.innerHTML = template;
  };

  private renderHeader = () => {
    this.container.querySelector('.houdini')!.innerHTML += Header(this.config);
  };

  private renderChart = () => {
    const template = `<section class='houdini__chart'></section>`;
    this.container.querySelector('.houdini')!.innerHTML += template;
    this.chartSize.x = this.container.querySelector('.houdini__chart')!.clientHeight;
    this.chartSize.y = this.container.querySelector('.houdini__chart')!.clientWidth;
  };

  // todo: add xaxis
  private renderXaxis = () => {
    const template = `
      <div class='houdini__xaxis'>
        ${this.xaxis}
      </div>
    `;

    this.container.querySelector('.houdini__chart')!.innerHTML += template;
  };

  private renderYaxis = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;

    let template = '';
    let j = 0;
    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      const percentage = (j / (this.segments - 1)) * 100;
      template += `<span class='houdini__ylabel' style='bottom:${percentage}%'>${i}</span>`;
      j = j + 1;
    }

    this.container.querySelector(
      '.houdini__chart'
    )!.innerHTML += `<section class='houdini__yaxis'>${template}</section>`;
  };

  private renderDatasets = () => {
    const template = this.datasets
      .map((set) => {
        return `<div id='${set.name}' class='houdini__dataset'></div>`;
      })
      .join('');

    this.container.querySelector('.houdini__chart')!.innerHTML += template;
  };

  private renderDatapoints = () => {
    const elems = this.container.querySelectorAll('.houdini__dataset');

    elems.forEach((elem, index) => {
      this.datasets[index].values.map(
        () => (elem.innerHTML += `<span class='houdini__datapoint'></span>`)
      );
    });
  };

  private styles = () => {
    this.datapointCoordinates = this.getDatapointCoordinates();
    this.setGrid();
    this.setPath();
    this.setDatapoints();
  };

  private setGrid = () => {
    const elem = this.container.querySelector('.houdini__chart');
    // @ts-ignore
    elem.attributeStyleMap.set('background', 'paint(grid-radar)');
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-segments', this.segments);
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-xaxis', this.numberOfAxis());
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-color', this.gridColor);
  };

  private setPath = () => {
    const elems = this.container.querySelectorAll('.houdini__dataset');
    elems.forEach((elem, index) => {
      // @ts-ignore
      elem.attributeStyleMap.set('background', 'paint(path-radar)');
      // @ts-ignore
      elem.attributeStyleMap.set('--path-points', JSON.stringify(this.datapointCoordinates[index]));
      // @ts-ignore
      elem.attributeStyleMap.set('--path-fill', this.pathFill);
      // @ts-ignore
      elem.attributeStyleMap.set('--path-color', this.datasets[index].color);
    });
  };

  private setDatapoints = () => {
    const elems = this.container.querySelectorAll('.houdini__dataset');
    elems.forEach((elem, index) => {
      const color = this.datasets[index].color;

      elem.querySelectorAll('.houdini__datapoint').forEach((datapoint, innerIndex) => {
        //-5px because dotSize = 10 / 2
        const x = this.datapointCoordinates[index][innerIndex].x + this.chartSize.x / 2 - 5;
        const y = this.datapointCoordinates[index][innerIndex].y + this.chartSize.y / 2 - 5;
        // @ts-ignore
        datapoint.attributeStyleMap.set('background-color', color);
        // @ts-ignore
        datapoint.attributeStyleMap.set('left', CSS.px(x));
        // @ts-ignore
        datapoint.attributeStyleMap.set('bottom', CSS.px(y));
      });
    });
  };

  // todo: add listeners
  private listeners = () => {
    this.resize();
  };

  private resize = () => {
    window.addEventListener(
      'resize',
      debounce(() => {
        this.chartSize.x = this.container.querySelector('.houdini__chart')!.clientHeight;
        this.chartSize.y = this.container.querySelector('.houdini__chart')!.clientWidth;
        this.datapointCoordinates = this.getDatapointCoordinates();
        this.setPath();
        this.setDatapoints();
      }, 250)
    );
  };
}

export default RadarChart;
