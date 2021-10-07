// styles
import './css/main.css';

// charts
import LineChart from './charts/line-chart/line-chart';
import RadarChart from './charts/radar-chart/radar-chart';

// interfaces
import { Config } from './config';

class HoudiniChart {
  constructor(private readonly container: HTMLElement, private readonly config: Config) {
    this.init();
  }
  public init = () => {
    switch (this.config.chartType.toLowerCase()) {
      case 'line':
        const LINECHART = new LineChart(this.container, this.config);
        break;
      case 'radar':
        const RADARCHART = new RadarChart(this.container, this.config);
        break;
    }
  };
}

export default HoudiniChart;
