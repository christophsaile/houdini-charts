import { calculateNiceScale } from '../../utils/nice-num';
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
import { Coordinates, NiceNumbers, Range } from '../charts';

// classes
import Header from '../../elements/header/header';
import Tooltip from '../../elements/tooltip/tooltip';
import Accessibility from '../../elements/accessibility/accessibility';

// worklets
const gridRadarWorklet = new URL('../../worklets/grid-radar.js', import.meta.url);
const pathRadarWorklet = new URL('../../worklets/path-radar.js', import.meta.url);

class RadarChart {
  constructor(private readonly root: HTMLElement, private readonly config: Config) {
    this.loadWorklets();
    this.init();
  }

  private configScale = this.config.data.scale;
  private configDatasets = this.config.data.datasets;
  private configXaxis = this.config.data.xaxis;
  private configOptions = this.config.options;
  private configAutoScale = this.configScale.auto;
  private configAccessibility = this.configOptions?.accessibility;
  private configPathFill = this.configOptions?.fill ? true : false;
  private configGridColor = this.configOptions?.gridColor ? this.configOptions.gridColor : '#ccc';
  private min = this.configAutoScale
    ? getMinValue(flattenDataset(this.configDatasets))
    : this.configScale.min!;
  private max = this.configAutoScale
    ? getMaxValue(flattenDataset(this.configDatasets))
    : this.configScale.max!;
  private niceNumbers: NiceNumbers = calculateNiceScale(this.min, this.max);
  private range: Range = {
    y: this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum,
    zeroY: setMinToZero(this.niceNumbers.niceMinimum, this.niceNumbers.niceMaximum),
  };
  private segments =
    (this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum) / this.niceNumbers.tickSpacing +
    1;
  private elemChart!: HTMLElement;
  private elemDatsets!: HTMLElement;
  private chartSize: Coordinates = {
    x: 0,
    y: 0,
  };
  private datapointCoordinates: Coordinates[][] = [];
  private labelCoordinates: Coordinates[] = [];

  private numberOfAxis = () => {
    let length;
    if (this.configXaxis.length < 3) {
      length = 3;
    } else if (this.configXaxis.length > 10) {
      length = 10;
    } else {
      length = this.configXaxis.length;
    }
    return length;
  };

  private setChartSize = () => {
    this.chartSize.x = this.elemDatsets.clientWidth;
    this.chartSize.y = this.elemDatsets.clientHeight;
  };

  private getDatapointCoordinates = () => {
    const datapoints = this.configDatasets.map((set) => {
      return getRadarPoints(set.values, this.chartSize, this.range);
    });
    return datapoints;
  };

  private getLabelsCoordinates = () => {
    const maxDataset = new Array(this.numberOfAxis()).fill(
      this.niceNumbers.niceMaximum + this.niceNumbers.tickSpacing / 1.5
    );
    return getRadarPoints(maxDataset, this.chartSize, this.range);
  };

  private loadWorklets = () => {
    // @ts-ignore
    CSS.paintWorklet.addModule(gridRadarWorklet.href);
    // @ts-ignore
    CSS.paintWorklet.addModule(pathRadarWorklet.href);
  };

  private init = () => {
    this.initRender();
    this.initStyles();
    this.initEvents();
    this.initAccessibility();
  };

  private initRender = () => {
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
    this.root.querySelector('.houdini')!.innerHTML += Header.renderHeader(this.config);
  };

  private renderChart = () => {
    const template = `<section class='houdini__chart'></section>`;
    this.root.querySelector('.houdini')!.innerHTML += template;
    this.elemChart = this.root.querySelector('.houdini__chart')!;
  };

  private renderXaxis = () => {
    const template = this.configXaxis
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
    const template = this.configDatasets
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
      this.configDatasets[index].values.forEach(
        (value, innerIndex) =>
          (datasetElem.innerHTML += `<button data-y='${value}' data-x='${this.configXaxis[innerIndex]}' />`)
      );
    });
  };

  private renderTooltip = () => {
    const template = Tooltip.renderTooltip();
    this.root.querySelector('.houdini__datasets')!.innerHTML += template;
  };

  private initStyles = () => {
    this.datapointCoordinates = this.getDatapointCoordinates();
    this.labelCoordinates = this.getLabelsCoordinates();
    this.stylesGrid();
    this.stylesPath();
    this.stylesAxisLabels();
    this.stylesDatapoints();
  };

  private stylesGrid = () => {
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('background', 'paint(grid-radar)');
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('--grid-segments', this.segments);
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('--grid-xaxis', this.numberOfAxis());
    // @ts-ignore
    this.elemDatsets.attributeStyleMap.set('--grid-color', this.configGridColor);
  };

  private stylesPath = () => {
    const datasets = this.root.querySelectorAll('.houdini__dataset');
    datasets.forEach((elem, index) => {
      // @ts-ignore
      elem.attributeStyleMap.set('background', 'paint(path-radar)');
      // @ts-ignore
      elem.attributeStyleMap.set('--path-points', JSON.stringify(this.datapointCoordinates[index]));
      // @ts-ignore
      elem.attributeStyleMap.set('--path-fill', this.configPathFill);
      // @ts-ignore
      elem.attributeStyleMap.set('--path-color', this.configDatasets[index].color);
    });
  };

  private stylesAxisLabels() {
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

  private stylesDatapoints = () => {
    const datasets = this.root.querySelectorAll('.houdini__dataset');
    const centerX = this.chartSize.x / 2;
    const centerY = this.chartSize.y / 2;

    datasets.forEach((elem, index) => {
      const color = this.configDatasets[index].color;

      elem.querySelectorAll('button').forEach((datapoint, innerIndex) => {
        // -4px because dotSize = 8 / 2
        const x = this.datapointCoordinates[index][innerIndex].x + centerX - 4;
        const y = this.datapointCoordinates[index][innerIndex].y + centerY - 4;
        // @ts-ignore
        datapoint.attributeStyleMap.set('background-color', color);
        // @ts-ignore
        datapoint.attributeStyleMap.set('left', CSS.px(x));
        // @ts-ignore
        datapoint.attributeStyleMap.set('bottom', CSS.px(y));
      });
    });
  };

  private initEvents = () => {
    this.eventsDatapoint();
    this.eventsResize();
    Header.eventsHeader(this.root);
  };

  private eventsDatapoint = () => {
    const datapoints: HTMLElement[] = [].slice.call(
      document.querySelectorAll('.houdini__dataset button')
    );

    datapoints.forEach((elem: HTMLElement) => {
      elem.addEventListener('click', (event: MouseEvent) =>
        Tooltip.updateTooltip(event, this.root)
      );
      elem.addEventListener('mouseover', (event: MouseEvent) =>
        Tooltip.updateTooltip(event, this.root)
      );
      elem.addEventListener('mouseout', () => Tooltip.hideTooltip(this.root));
    });
    // this.elemDatasets.addEventListener('click', () => this.hideHighlight());
  };

  private eventsResize = () => {
    window.addEventListener(
      'resize',
      debounce(() => {
        Tooltip.hideTooltip(this.root);
        this.setChartSize();
        this.datapointCoordinates = this.getDatapointCoordinates();
        this.labelCoordinates = this.getLabelsCoordinates();
        this.stylesAxisLabels();
        this.stylesPath();
        this.stylesDatapoints();
      }, 250)
    );
  };

  private initAccessibility = () => {
    if (this.configAccessibility)
      Accessibility.init(this.root, this.configAccessibility, this.config.chartType);
  };
}

export default RadarChart;
