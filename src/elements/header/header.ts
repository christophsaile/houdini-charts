// styles
import './header.css';

// Interfaces
import { Access, Config, Datasets } from '../../config';

class Header {
  private title: string | undefined;
  private legend: boolean | undefined;
  private accessibility: Access | undefined;
  private datasets!: Datasets[];

  public renderHeader = (config: Config): string => {
    this.title = config.title;
    this.legend = config.options?.legend;
    this.accessibility = config.options?.accessibility;
    this.datasets = config.data.datasets;

    return `
    <section class='houdini__header'>
      <h2 class='houdini__title'>${this.title}</h2>
      ${this.legend ? this.renderLegend() : ''}
    </section>
  `;
  };

  private renderLegend = (): string => {
    return `
      <section class='houdini__legend'>
        ${this.datasets
          .map(
            (elem) =>
              `<button ${this.accessibility ? `aria-label='Show ${elem.name}'` : ''} data-set='${
                elem.name
              }'class='houdini__legend-item'><span style='background-color: ${
                elem.color
              }'></span><p ${this.accessibility ? `aria-hidden='true'` : ''}>${
                elem.name
              }</p></button>`
          )
          .join('')}
      </section>
    `;
  };

  public eventsHeader = (root: HTMLElement) => {
    const legendItems: HTMLElement[] = [].slice.call(
      root.querySelectorAll('.houdini__legend-item')
    );
    if (legendItems) {
      legendItems.forEach((elem) => {
        elem.addEventListener('click', () => {
          const attribute = elem.getAttribute('data-set');
          const dataset = root.querySelector('#' + attribute);
          dataset?.classList.toggle('houdini__dataset--hide');
        });
      });
    }
  };
}

export default new Header();
