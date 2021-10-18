import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';
import { setMinToZero } from '../../utils/set-min-to-zero';
import { debounce } from '../../utils/debounce';
import { getRadarPoints } from '../../utils/get-radar-points-';

// styles
import './radar-chart.css';

// interfaces
import { Config } from '../../config';
import { Coordinates, Range } from '../charts';

// classes
import { Header, headerEvents } from '../../elements/header/header';
import { hideTooltip, Tooltip, updateTooltip } from '../../elements/tooltip/tooltip';

// worklets
const gridRadarWorklet = new URL('../../worklets/grid-radar.js', import.meta.url);
const pathRadarWorklet = new URL('../../worklets/path-radar.js', import.meta.url);

class RadarChart {
  constructor(private readonly root: HTMLElement, private readonly config: Config) {
    this.init();
  }

  private scaleSettings = this.config.data.scale;
  private datasets = this.config.data.datasets;
  private xaxis = this.config.data.xaxis;
  private options = this.config.options;
  private autoScale = this.scaleSettings.auto;
  private accessible = this.options?.accessibility;

  private min = this.autoScale
    ? getMinValue(flattenDataset(this.datasets))
    : this.scaleSettings.min!;
  private max = this.autoScale
    ? getMaxValue(flattenDataset(this.datasets))
    : this.scaleSettings.max!;
  private niceNumbers = niceScale(this.min, this.max);
  private range: Range = {
    y: this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum,
    zeroY: setMinToZero(this.niceNumbers.niceMinimum, this.niceNumbers.niceMaximum),
  };
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

  private elemChart!: HTMLElement;
  private elemDatsets!: HTMLElement;

  private chartSize: Coordinates = {
    x: 0,
    y: 0,
  };
  private setChartSize = () => {
    this.chartSize.x = this.elemDatsets.clientWidth;
    this.chartSize.y = this.elemDatsets.clientHeight;
  };

  private datapointCoordinates: Coordinates[][] = [];
  private getDatapointCoordinates = () => {
    const datapoints = this.datasets.map((set) => {
      return getRadarPoints(set.values, this.chartSize, this.range);
    });
    return datapoints;
  };
  private labelCoordinates: Coordinates[] = [];
  private getLabelsCoordinates = () => {
    const maxDataset = new Array(this.numberOfAxis()).fill(
      this.niceNumbers.niceMaximum + this.niceNumbers.tickSpacing / 2
    );
    return getRadarPoints(maxDataset, this.chartSize, this.range);
  };

  private init = () => {
    this.worklets();
    this.render();
    this.styles();
    this.events();
    if (this.accessible) this.accessibility();
  };

  private worklets = () => {
    // @ts-ignore
    CSS.paintWorklet.addModule(gridRadarWorklet.href);
    // @ts-ignore
    CSS.paintWorklet.addModule(pathRadarWorklet.href);
  };

  private render = () => {
    this.renderWrapper();
    this.renderHeader();
    this.renderChart();
    this.renderYaxis();
    this.renderXaxis();
    this.renderDatasets();
    this.renderDatapoints();
    this.renderTooltip();
  };

  private renderWrapper = () => {
    const template = `<div class='houdini houdini--radar'></div>`;
    this.root.innerHTML = template;
  };

  private renderHeader = () => {
    this.root.querySelector('.houdini')!.innerHTML += Header(this.config);
  };

  private renderChart = () => {
    const template = `<section class='houdini__chart'></section>`;
    this.root.querySelector('.houdini')!.innerHTML += template;
    this.elemChart = this.root.querySelector('.houdini__chart')!;
  };

  private renderXaxis = () => {
    const template = this.xaxis
      .map((label) => {
        return `<span class='houdini__xlabel'>${label}</span>`;
      })
      .join('');

    this.elemChart.innerHTML += `<div class='houdini__xaxis'>${template}</div>`;
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

    this.elemChart.innerHTML += `<div class='houdini__yaxis'>${template}</div>`;
  };

  private renderDatasets = () => {
    const template = this.datasets
      .map((set) => {
        return `<div id='${set.name}' class='houdini__dataset'></div>`;
      })
      .join('');

    this.elemChart.innerHTML += `<div class='houdini__datasets'>${template}</div>`;
    this.elemDatsets = this.root.querySelector('.houdini__datasets')!;
    this.setChartSize();
  };

  private renderDatapoints = () => {
    const datasets = this.root.querySelectorAll('.houdini__dataset');

    datasets.forEach((datasetElem, index) => {
      this.datasets[index].values.forEach(
        (value, innerIndex) =>
          (datasetElem.innerHTML += `<button data-y='${value}' data-x='${this.xaxis[innerIndex]}' />`)
      );
    });
  };

  private renderTooltip = () => {
    const template = Tooltip();
    this.root.querySelector('.houdini__datasets')!.innerHTML += template;
  };

  private styles = () => {
    this.datapointCoordinates = this.getDatapointCoordinates();
    this.labelCoordinates = this.getLabelsCoordinates();
    this.setAxisLabels();
    this.setGrid();
    this.setPath();
    this.setDatapoints();
  };

  private setAxisLabels() {
    const elems = this.root.querySelectorAll('.houdini__xlabel');
    const centerX = this.chartSize.x / 2;
    const centerY = this.chartSize.y / 2;

    elems.forEach((label, index) => {
      const x = this.labelCoordinates[index].x + centerX - label.clientWidth / 2;
      const y = this.labelCoordinates[index].y + centerY - label.clientHeight / 2;
      // @ts-ignore
      label.attributeStyleMap.set('left', CSS.px(x));
      // @ts-ignore
      label.attributeStyleMap.set('bottom', CSS.px(y));
    });
  }

  private setGrid = () => {
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('background', 'paint(grid-radar)');
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('--grid-segments', this.segments);
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('--grid-xaxis', this.numberOfAxis());
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('--grid-color', this.gridColor);
  };

  private setPath = () => {
    const datasets = this.root.querySelectorAll('.houdini__dataset');
    datasets.forEach((elem, index) => {
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
    const datasets = this.root.querySelectorAll('.houdini__dataset');
    datasets.forEach((elem, index) => {
      const color = this.datasets[index].color;

      elem.querySelectorAll('button').forEach((datapoint, innerIndex) => {
        // -4px because dotSize = 8 / 2
        const x = this.datapointCoordinates[index][innerIndex].x + this.chartSize.x / 2 - 4;
        const y = this.datapointCoordinates[index][innerIndex].y + this.chartSize.y / 2 - 4;
        // @ts-ignore
        datapoint.attributeStyleMap.set('background-color', color);
        // @ts-ignore
        datapoint.attributeStyleMap.set('left', CSS.px(x));
        // @ts-ignore
        datapoint.attributeStyleMap.set('bottom', CSS.px(y));
      });
    });
  };

  private events = () => {
    this.highlightDatapoint();
    this.resize();
    headerEvents(this.root);
  };

  private highlightDatapoint = () => {
    const datapoints: HTMLElement[] = [].slice.call(
      document.querySelectorAll('.houdini__dataset button')
    );

    datapoints.forEach((elem: HTMLElement) => {
      elem.addEventListener('click', (event: MouseEvent) => updateTooltip(event, this.root));
      elem.addEventListener('mouseover', (event: MouseEvent) => updateTooltip(event, this.root));
      elem.addEventListener('mouseout', () => hideTooltip(this.root));
    });
    // this.elemDatasets.addEventListener('click', () => this.hideHighlight());
  };

  private resize = () => {
    window.addEventListener(
      'resize',
      debounce(() => {
        hideTooltip(this.root);
        this.setChartSize();
        this.datapointCoordinates = this.getDatapointCoordinates();
        this.labelCoordinates = this.getLabelsCoordinates();
        this.setAxisLabels();
        this.setPath();
        this.setDatapoints();
      }, 250)
    );
  };

  private accessibility = () => {
    if (this.accessible?.description)
      this.root.querySelector('.houdini')?.setAttribute('aria-label', this.accessible.description);

    const yAxis = this.root.querySelector('.houdini__yaxis');
    const xAxis = this.root.querySelector('.houdini__xaxis');

    xAxis?.setAttribute('aria-hidden', 'true');
    yAxis?.setAttribute('aria-hidden', 'true');

    const datasets = this.root.querySelectorAll('.houdini__dataset');

    datasets.forEach((set, index) => {
      const datapoints = set.querySelectorAll('button');

      set.setAttribute(
        'aria-label',
        `${set.id}, Category ${index + 1} of ${datasets.length} with ${
          datapoints.length
        } data points.`
      );

      datapoints.forEach((item) => {
        const xLabel = item.getAttribute('data-x');
        const yLabel = item.getAttribute('data-y');
        const dataset = item.parentElement?.id;

        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Category: ${xLabel}, Value: ${yLabel}, ${dataset}`);
      });
    });
  };
}

export default RadarChart;
