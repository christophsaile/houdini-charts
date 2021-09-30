import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';
import { flattenDataset } from '../../utils/flatten-dataset';
import { setMinToZero } from '../../utils/set-min-to-zero';
import { debounce } from '../../utils/debounce';
import { getLinePoints } from '../../utils/get-line-points';

// styles
import './line-chart.css';

// interfaces
import { Config } from '../../config';
import { coordinates } from '../../utils/utils';

// classes
import Header from '../../elements/header/header';
import { hideTooltip, Tooltip, updateTooltip } from '../../elements/tooltip/tooltip';

// worklets
const gridBasicWorklet = new URL('../../worklets/grid-basic.js', import.meta.url);
const pathLineWorklet = new URL('../../worklets/path-line.js', import.meta.url);
// @ts-ignore
CSS.paintWorklet.addModule(gridBasicWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(pathLineWorklet.href);

class LineChart {
  constructor(private readonly root: HTMLElement, private readonly config: Config) {
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

  private elemDatasets!: HTMLElement;
  private chartSize: coordinates = {
    x: 0,
    y: 0,
  };
  private setChartSize = () => {
    this.chartSize.x = this.elemDatasets.clientWidth;
    this.chartSize.y = this.elemDatasets.clientHeight;
  };

  private datapointCoordinates: coordinates[][] = [];
  private getDatapointCoordinates = () => {
    const datapoints = this.datasets.map((set) => {
      return getLinePoints(set.values, this.chartSize, this.range);
    });
    return datapoints;
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
    this.renderTooltip();
  };

  private renderWrapper = () => {
    const template = `
      <div class='houdini houdini--line'></div>
    `;

    this.root.innerHTML = template;
  };

  private renderHeader = () => {
    this.root.querySelector('.houdini')!.innerHTML += Header(this.config);
  };

  private renderAxisTitle = () => {
    this.config.options?.titleAxis?.x && this.renderTitleX();
    this.config.options?.titleAxis?.y && this.renderTitleY();
  };

  private renderTitleY = () => {
    const template = `<h3 class='houdini__ytitle'>${this.config.options?.titleAxis?.y}</h3>`;
    this.root.querySelector('.houdini')!.innerHTML += template;
  };

  private renderTitleX = () => {
    const template = `<h3 class='houdini__xtitle'>${this.config.options?.titleAxis?.x}</h3>`;
    this.root.querySelector('.houdini')!.innerHTML += template;
  };

  private renderChart = () => {
    const template = `<section class='houdini__chart'></section>`;
    this.root.querySelector('.houdini')!.innerHTML += template;
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

    this.root.querySelector(
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

    this.root.querySelector('.houdini__chart')!.innerHTML += `
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
              set.values,
              set.name
            )}</div>`;
          })
          .join('')}
      </section>
    `;
    this.root.querySelector('.houdini__chart')!.innerHTML += template;
    this.elemDatasets = this.root.querySelector('.houdini__datasets')!;
    this.setChartSize();
  };

  private renderDataset = (values: number[], name: string) => {
    return `
      ${values
        .map(
          (value, index) =>
            `<span class='houdini__datapoint' dataset='${name}' data-y='${value}' data-x='${this.xaxis[index]}' ></span>`
        )
        .join('')}
    `;
  };

  private renderTooltip = () => {
    // todo: remove paramaters
    const template = Tooltip();
    this.root.querySelector('.houdini__datasets')!.innerHTML += template;
  };

  private styles = () => {
    this.datapointCoordinates = this.getDatapointCoordinates();
    this.setGrid();
    this.setPath();
    this.setDatapoints();
  };

  private setGrid = () => {
    const elem = this.root.querySelector('.houdini__datasets')!;
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
    const elems = this.root.querySelectorAll('.houdini__dataset');
    elems.forEach((elem, index) => {
      // @ts-ignore
      elem.attributeStyleMap.set('background', 'paint(path-line)');
      // @ts-ignore
      elem.attributeStyleMap.set('--path-points', JSON.stringify(this.datapointCoordinates[index]));
      // @ts-ignore
      elem.attributeStyleMap.set('--path-color', this.datasets[index].color);
    });
  };

  private setDatapoints = () => {
    const elems = this.root.querySelectorAll('.houdini__dataset');
    elems.forEach((elem, index) => {
      const color = this.datasets[index].color;

      elem.querySelectorAll('.houdini__datapoint').forEach((datapoint, innerIndex) => {
        // -5px because dotSize = 10 / 2
        const x = this.datapointCoordinates[index][innerIndex].x - 5;
        const y = this.datapointCoordinates[index][innerIndex].y - 5;

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
  };

  private highlightDatapoint = () => {
    const datapoints: HTMLElement[] = [].slice.call(
      document.querySelectorAll('.houdini__datapoint')
    );

    datapoints.forEach((elem: HTMLElement) => {
      elem.addEventListener('click', (event: MouseEvent) => this.handleDatapointClick(event));
      elem.addEventListener('mouseover', (event: MouseEvent) => updateTooltip(event, this.root));
      elem.addEventListener('mouseout', () => hideTooltip(this.root));
    });
    this.elemDatasets.addEventListener('click', () => this.hideHighlight());
  };

  private handleDatapointClick = (event: MouseEvent) => {
    // @ts-ignore
    const leftValue = event.target.attributeStyleMap.get('left').value;
    // @ts-ignore
    this.elemDatasets.attributeStyleMap.set('--grid-highlight', leftValue);
    updateTooltip(event, this.root);

    event.stopPropagation();
  };

  private hideHighlight = () => {
    // @ts-ignore
    this.elemDatasets.attributeStyleMap.set('--grid-highlight', 0);
    hideTooltip(this.root);
  };

  private resize = () => {
    window.addEventListener(
      'resize',
      debounce(() => {
        this.hideHighlight();
        this.setChartSize();
        this.datapointCoordinates = this.getDatapointCoordinates();
        this.setPath();
        this.setDatapoints();
      }, 250)
    );
  };
}

export default LineChart;
