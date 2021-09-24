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

  private init = () => {
    this.render();
  };

  private render = () => {
    // move renderDefaultTemplate function up in render function ???
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='radarChart__wrapper'>
        ${Header(this.config)}
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
