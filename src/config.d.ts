export interface Config {
  title?: string;
  chartType: string;
  data: {
    xaxis: string[];
    datasets: Datasets[];
  };
  options?: Options;
}

export interface Datasets {
  name: string;
  values: number[];
  color?: string;
}

export interface Options {
  scales?: Scale;
  accessibility?: Access;
  fill?: boolean;
  legend?: boolean;
  titleAxis?: {
    x?: string;
    y?: string;
  };
  gridColor?: string;
}

export interface Scale {
  xAxis?: {
    type?: string;
  };
  yAxis?: {
    type?: string;
    min?: number;
    max?: number;
  };
}

export interface Access {
  description?: string;
}
