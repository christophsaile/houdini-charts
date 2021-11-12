// styles
import './css/global.css';
// charts
import LineChart from './charts/line-chart/line-chart';
import RadarChart from './charts/radar-chart/radar-chart';

// interfaces
import { Config } from './config';

class HoudiniChart {
  constructor(private readonly root: HTMLElement, private readonly config: Config) {
    this.init();
  }
  private init = () => {
    switch (this.config.chartType.toLowerCase()) {
      case 'line':
        const LINECHART = new LineChart(this.root, this.config);
        break;
      case 'radar':
        const RADARCHART = new RadarChart(this.root, this.config);
        break;
    }
  };
}

export default HoudiniChart;
