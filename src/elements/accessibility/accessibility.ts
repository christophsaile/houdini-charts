import { Access } from '../../config';

class Accessibility {
  private root!: HTMLElement;
  private configAccessibility: Access | undefined;
  private datasets!: HTMLElement[];
  private chartType!: string;

  public init = (root: HTMLElement, configAccessibility: Access | undefined, chartType: string) => {
    this.root = root;
    this.configAccessibility = configAccessibility;
    this.chartType = chartType;
    this.datasets = [].slice.call(this.root.querySelectorAll('.houdini__dataset'));
    this.renderAriaLabels();
    this.renderTabIndexes();
  };

  private renderAriaLabels = () => {
    if (this.configAccessibility?.description)
      this.root
        .querySelector('.houdini')
        ?.setAttribute('aria-label', this.configAccessibility.description);

    const yAxis = this.root.querySelector('.houdini__yaxis');
    const xAxis = this.root.querySelector('.houdini__xaxis');

    xAxis?.setAttribute('aria-hidden', 'true');
    yAxis?.setAttribute('aria-hidden', 'true');

    this.datasets.forEach((set, index) => {
      const datapoints = set.querySelectorAll('button');

      set.setAttribute(
        'aria-label',
        `${set.id}, Dataset ${index + 1} of ${this.datasets.length} with ${
          datapoints.length
        } data points.`
      );
    });
  };

  private renderTabIndexes = () => {
    this.datasets.forEach((set) => {
      const datapoints = set.querySelectorAll('button');

      datapoints.forEach((item) => {
        const xLabel = item.getAttribute('data-x');
        const yLabel = item.getAttribute('data-y');
        const dataset = item.parentElement?.id;

        item.setAttribute('tabindex', '0');

        switch (this.chartType.toLowerCase()) {
          case 'line': {
            item.setAttribute('aria-label', `X axis: ${xLabel}, Y axis: ${yLabel}, ${dataset}`);
            break;
          }
          case 'radar': {
            item.setAttribute('aria-label', `Category: ${xLabel}, Value: ${yLabel}, ${dataset}`);
            break;
          }
        }
      });
    });
  };
}

export default new Accessibility();
