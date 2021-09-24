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

  private datasets = this.config.data.datasets;
  private labels = this.config.data.labels;

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
      <section class='houdini__chart'>
        ${this.renderLabels()}
        ${this.renderScale()}
      </section>
    `;
  };

  private renderLabels = () => {
    console.log(this.labels.length);
    return `
      <div class='houdini__labels'>
        ${this.labels}
      </div>
    `;
  };

  private renderScale = () => {
    return `
      ${JSON.stringify(this.datasets)}
    `;
  };
}

export default RadarChart;
