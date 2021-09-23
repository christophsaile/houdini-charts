// styles
import './radar-chart.css';

// Interfaces
import { Config } from '../../data';
import { flattenDataset } from '../../utils/flatten-dataset';

class RadarChart {
  constructor(private readonly container: HTMLElement, private readonly config: Config) {}

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
        ${this.config.title && this.renderTitle()}
        ${this.config.options?.titleAxis?.y && this.renderTitleY()}
        ${this.config.options?.titleAxis?.x && this.renderTitleX()}
        ${this.renderChart()}
      </div>
    `;
    this.container.innerHTML = defaultTemplate;
  };

  private renderTitle = () => {};

  private renderTitleY = () => {};

  private renderTitleX = () => {};

  private renderChart = () => {};
}
export default RadarChart;
