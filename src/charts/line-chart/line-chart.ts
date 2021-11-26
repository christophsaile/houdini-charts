import { calculateNiceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';
import { setMinToZero } from '../../utils/set-min-to-zero';
import { debounce } from '../../utils/debounce';
import { getLinePoints, getLinePointsDate } from '../../utils/get-line-points';
import { getDateScaleLabels } from '../../utils/get-date-scale-labels';
import { checkXAxisType } from '../../utils/check-x-axis-type';

// styles
import './line-chart.css';

// interfaces
import { Config } from '../../config';
import { Coordinates, NiceNumbers, Range } from '../charts';

// classes
import Header from '../../elements/header/header';
import Tooltip from '../../elements/tooltip/tooltip';
import Accessibility from '../../elements/accessibility/accessibility';

// worklets
const gridLineWorklet = new URL('../../worklets/grid-line.js', import.meta.url);
const pathLineWorklet = new URL('../../worklets/path-line.js', import.meta.url);
// @ts-ignore
CSS.paintWorklet.addModule(gridLineWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(pathLineWorklet.href);

class LineChart {
  constructor(private readonly root: HTMLElement, private readonly config: Config) {
    // this.loadWorklets();
    this.init();
  }

  private configScale = this.config.options?.scales;
  private configDatasets = this.config.data.datasets;
  private configXaxis = this.config.data.xaxis;
  private configOptions = this.config.options;
  private configAutoScale =
    this.configScale?.yAxis?.min || this.configScale?.yAxis?.max ? false : true;
  private configAccessibility = this.configOptions?.accessibility;
  private configGridColor = this.configOptions?.gridColor ? this.configOptions.gridColor : '#ccc';
  private min!: Coordinates;
  private max!: Coordinates;
  private niceNumbers!: NiceNumbers;
  private range!: Range;
  private segments!: Coordinates;
  private elemDatasets!: HTMLElement;
  private chartSize: Coordinates = {
    x: 0,
    y: 0,
  };
  private datapointCoordinates: Coordinates[][] = [];
  private dateScaleLabels: string[] = [];

  private setChartSize = () => {
    this.chartSize.x = this.elemDatasets.clientWidth;
    this.chartSize.y = this.elemDatasets.clientHeight;
  };

  private getDatapointCoordinates = () => {
    const datapoints = this.configDatasets.map((set) => {
      if (checkXAxisType(this.configXaxis[0]) === 'date') {
        return getLinePointsDate(set.values, this.configXaxis, this.chartSize, this.range);
      } else {
        return getLinePoints(set.values, this.chartSize, this.range);
      }
    });
    return datapoints;
  };

  private loadWorklets = () => {
    // @ts-ignore
    CSS.paintWorklet.addModule(gridLineWorklet.href);
    // @ts-ignore
    CSS.paintWorklet.addModule(pathLineWorklet.href);
  };

  private init = () => {
    this.initScale();
    this.initRender();
    this.initStyles();
    this.initEvents();
    this.initAccessibility();
  };

  private initScale = () => {
    this.min = {
      x: 0,
      y: this.configAutoScale
        ? getMinValue(flattenDataset(this.configDatasets))
        : this.configScale?.yAxis?.min!,
    };
    this.max = {
      x: this.configXaxis.length - 1,
      y: this.configAutoScale
        ? getMaxValue(flattenDataset(this.configDatasets))
        : this.configScale?.yAxis?.max!,
    };

    this.niceNumbers = calculateNiceScale(this.min.y, this.max.y);
    this.range = {
      y: this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum,
      zeroY: setMinToZero(this.niceNumbers.niceMinimum, this.niceNumbers.niceMaximum),
    };
    this.segments = {
      x: this.max.x,
      y: this.range.y! / this.niceNumbers.tickSpacing,
    };

    if (this.configScale?.xAxis?.type === 'date') {
      const scale = getDateScaleLabels(this.configXaxis);
      this.max.x = scale.maxValue;
      this.range.tickInterval = scale.tickInterval;
      this.segments.x = scale.labels.length - 1;
      this.dateScaleLabels = scale.labels;
    }

    this.range.x = this.max.x - this.min.x;
  };

  private initRender = () => {
    this.renderWrapper();
    this.renderHeader();
    this.renderAxisTitle();
    this.renderChart();
    this.renderYaxis();
    this.renderXAxis();
    this.renderDatasets();
    this.renderDatapoints();
    this.renderTooltip();
  };

  private renderWrapper = () => {
    const template = `
      <div class='houdini houdini--line'></div>
    `;

    this.root.insertAdjacentHTML('afterbegin', template);
  };

  private renderHeader = () => {
    this.root
      .querySelector('.houdini')!
      .insertAdjacentHTML('afterbegin', Header.renderHeader(this.config));
  };

  private renderAxisTitle = () => {
    this.config.options?.titleAxis?.x && this.renderTitleX();
    this.config.options?.titleAxis?.y && this.renderTitleY();
  };

  private renderTitleY = () => {
    const template = `<h3 class='houdini__ytitle'>${this.config.options?.titleAxis?.y}</h3>`;
    this.root.querySelector('.houdini')!.insertAdjacentHTML('beforeend', template);
  };

  private renderTitleX = () => {
    const template = `<h3 class='houdini__xtitle'>${this.config.options?.titleAxis?.x}</h3>`;
    this.root.querySelector('.houdini')!.insertAdjacentHTML('beforeend', template);
  };

  private renderChart = () => {
    const template = `<section class='houdini__chart'></section>`;
    this.root.querySelector('.houdini')!.insertAdjacentHTML('beforeend', template);
  };

  private renderYaxis = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    let template: string = '';
    let j = 0;

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      const percentage = (j / this.segments.y) * 100;
      const perTwoDigits = Math.round(percentage * 100) / 100;
      // -6px because fontSize = 12px / 2
      template += `<span class='houdini__ylabel' style='bottom: calc(${perTwoDigits}% - 6px)'>${i}</span>`;
      j = j + 1;
    }

    this.root
      .querySelector('.houdini__chart')!
      .insertAdjacentHTML('beforeend', `<section class='houdini__yaxis'>${template}</section>`);
  };

  private renderXAxis = () => {
    let template: string = '';

    for (let i = this.min.x, n = this.segments.x; i <= n; i++) {
      const segmentWidth = 100 / this.segments.x;
      const percantage = (i / this.segments.x) * 100 - segmentWidth / 2;
      template += `<span class='houdini__xlabel' style='left: ${percantage}%; width: ${segmentWidth}%'>${
        this.configScale?.xAxis?.type === 'date' ? this.dateScaleLabels[i] : this.configXaxis[i]
      }</span>`;
    }

    this.root.querySelector('.houdini__chart')!.insertAdjacentHTML(
      'beforeend',
      `
      <section class='houdini__xaxis'>
        ${template}
      </section>
    `
    );
  };

  private renderDatasets = () => {
    const template = this.configDatasets
      .map((set) => {
        return `<div id='${set.name}' class='houdini__dataset'></div>`;
      })
      .join('');

    this.root
      .querySelector('.houdini__chart')!
      .insertAdjacentHTML('beforeend', `<section class='houdini__datasets'>${template}</section>`);
    this.elemDatasets = this.root.querySelector('.houdini__datasets')!;
    this.setChartSize();
  };

  private renderDatapoints = () => {
    const datasets = this.root.querySelectorAll('.houdini__dataset');

    datasets.forEach((datasetElem, index) => {
      this.configDatasets[index].values.forEach((value, innerIndex) =>
        datasetElem.insertAdjacentHTML(
          'beforeend',
          `<button data-y='${value}' data-x='${this.configXaxis[innerIndex]}' />`
        )
      );
    });
  };

  private renderTooltip = () => {
    const template = Tooltip.renderTooltip();
    this.root.querySelector('.houdini__datasets')!.insertAdjacentHTML('beforeend', template);
  };

  private initStyles = () => {
    this.datapointCoordinates = this.getDatapointCoordinates();
    this.stylesGrid();
    this.stylesPath();
    this.stylesDatapoints();
  };

  private stylesGrid = () => {
    const elem = this.root.querySelector('.houdini__datasets')!;
    // @ts-ignore
    elem.attributeStyleMap.set('background', 'paint(grid-line)');
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-segmentsX', this.segments.x);
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-segmentsY', this.segments.y);
    // @ts-ignore
    elem.attributeStyleMap.set('--grid-color', this.configGridColor);
  };

  private stylesPath = () => {
    const datasets = this.root.querySelectorAll('.houdini__dataset');
    datasets.forEach((elem, index) => {
      // @ts-ignore
      elem.attributeStyleMap.set('background', 'paint(path-line)');
      // @ts-ignore
      elem.attributeStyleMap.set('--path-points', JSON.stringify(this.datapointCoordinates[index]));
      // @ts-ignore
      elem.attributeStyleMap.set('--path-color', this.configDatasets[index].color);
    });
  };

  private stylesDatapoints = () => {
    const datasets = this.root.querySelectorAll('.houdini__dataset');
    datasets.forEach((elem, index) => {
      const color = this.configDatasets[index].color;

      elem.querySelectorAll('button').forEach((datapoint, innerIndex) => {
        // -4px because dotSize = 8 / 2
        const x = this.datapointCoordinates[index][innerIndex].x - 4;
        const y = this.datapointCoordinates[index][innerIndex].y - 4;

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
      elem.addEventListener('click', (event: MouseEvent) => this.handleDatapointClick(event));
      elem.addEventListener('mouseover', (event: MouseEvent) =>
        Tooltip.updateTooltip(event, this.root)
      );
      elem.addEventListener('mouseout', () => Tooltip.hideTooltip(this.root));
    });
    this.elemDatasets.addEventListener('click', () => this.hideHighlight());
  };

  private handleDatapointClick = (event: MouseEvent) => {
    // @ts-ignore
    const leftValue = event.target.attributeStyleMap.get('left').value;
    // @ts-ignore
    this.elemDatasets.attributeStyleMap.set('--grid-highlight', leftValue);
    Tooltip.updateTooltip(event, this.root);

    event.stopPropagation();
  };

  private hideHighlight = () => {
    // @ts-ignore
    this.elemDatasets.attributeStyleMap.set('--grid-highlight', 0);
    Tooltip.hideTooltip(this.root);
  };

  private eventsResize = () => {
    window.addEventListener(
      'resize',
      debounce(() => {
        this.hideHighlight();
        this.setChartSize();
        this.datapointCoordinates = this.getDatapointCoordinates();
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

export default LineChart;
