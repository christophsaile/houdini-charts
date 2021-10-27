export interface Config {
  title?: string;
  chartType: string;
  data: {
    xaxis: string[];
    datasets: Datasets[];
    scale: Scale;
  };
  options?: Options;
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

export interface Options {
  accessibility?: Access;
  fill?: boolean;
  legend?: boolean;
  titleAxis?: {
    x?: string;
    y?: string;
  };
  gridColor?: string;
}

export interface Access {
  description?: string;
}
