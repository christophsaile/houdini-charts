// styles
import './line-chart.css';

// Interfaces
import { Data } from '../../data';

class LineChart {
  constructor(private readonly data: Data) {}

  private getRenderLocation = (): HTMLElement => {
    return document.querySelector('#lineChart')!;
  };

  public init = () => {
    this.render();
    console.log(this.data);
  };

  private render = () => {
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='lineChart__wrapper'>
        ${this.data.title && this.renderTitle()}
        ${this.renderChart()}
      </div>
    `;
    this.getRenderLocation().innerHTML = defaultTemplate;
  };

  private renderTitle = () => {
    return `<h2>${this.data.title}</h2>`;
  };

  private renderChart = () => {
    const { labels, datasets } = this.data.data;

    // return `
    //   <section class='lineChart__grid'>
    //     ${labels
    //       .map(
    //         (text, index) => `
    //           <div class='lineChart__column'>${index}</div>
    //         `
    //       )
    //       .join('')}
    //     ${this.renderLabers()}
    //   </section>
    // `;

    return this.renderLabels();
  };

  private renderLabels = () => {
    const { labels } = this.data.data;

    return `
      <section class='lineChart__labels'>
        ${labels.map((text) => `<span class='lineChart__label'>${text}</span>`).join('')}
      </section>
    `;
  };
}

export default LineChart;
