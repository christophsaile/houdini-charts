// styles
import './line-chart.css';

// Interfaces
import { Data, Datavalue } from '../../data';
import { isInScaleRange } from '../../utils/isInScaleRange';

class LineChart {
  constructor(private readonly data: Data) {}

  private getScaleSettings = this.data.data.scale;
  private getDatasets = this.data.data.datasets;
  private getLabels = this.data.data.labels;

  private getRenderLocation = (): HTMLElement => {
    return document.querySelector('#lineChart')!;
  };

  public init = () => {
    this.render();
    console.log(this.data);
  };

  private render = () => {
    // move renderDefaultTemplate function up in render function ???
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='lineChart__wrapper'>
        ${this.data.title && this.renderTitle()}
        ${this.data.options?.labelAxis?.y && this.renderTitleY()}
        ${this.renderChart()}
        ${this.data.options?.labelAxis?.x && this.renderTitelX()}
      </div>
    `;
    this.getRenderLocation().innerHTML = defaultTemplate;
  };

  private renderTitle = () => {
    return `<h2 class='lineChart__title'>${this.data.title}</h2>`;
  };

  private renderTitleY = () => {
    return `<h3 class='lineChart__title-y'>${this.data.options?.labelAxis?.y}</h3>`;
  };

  private renderTitelX = () => {
    return `<h3 class='lineChart__title-x'>${this.data.options?.labelAxis?.x}</h3>`;
  };

  private renderChart = () => {
    return `
    <section class='lineChart__chart'>
      ${this.renderData()}
      ${this.renderLabels()}
    </section>
    `;
  };

  private renderData = () => {
    return `
      <section class='lineChart__data'>
        ${this.getDatasets
          .map((set) => {
            return `<section id='${set.name}' class='lineChart__dataset'>${this.renderDataset(
              set.values
            )}</section>`;
          })
          .join('')}
      </section>
    `;
  };

  private renderDataset = (values: Datavalue[]) => {
    return `
      ${values
        .map(
          (value) =>
            `<span class='lineChart__datapoint' ${this.setDatapointPosition(value)}></span>`
        )
        .join('')}
    `;
  };

  private setDatapointPosition = (value: Datavalue) => {
    return `style='left: ${value.x}px; bottom: ${value.y}px'`;
  };

  private renderLabels = () => {
    return `
      <section class='lineChart__labels'>
        ${this.getLabels.map((text) => `<span class='lineChart__label'>${text}</span>`).join('')}
      </section>
    `;
  };
}

export default LineChart;
