export interface Config {
  title?: string;
  chartType: string;
  data: {
    xaxis: string[];
    datasets: Datasets[];
    scale: Scale;
  };
  options?: {
    accessibility?: {
      description?: string;
    };

    fill?: boolean;
    legend?: boolean;
    titleAxis?: {
      x?: string;
      y?: string;
    };
    gridColor?: string;
  };
}

export interface Datasets {
  name: string;
  values: number[];
  color?: string;
}

export interface Scale {
  auto: boolean;
  min?: number;
  max?: number;
}
