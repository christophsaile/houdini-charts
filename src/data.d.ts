export interface Data {
  title?: string;
  chartType: string;
  data: {
    labels: string[];
    datasets: Datasets[];
    scale: Scale;
  };
  options?: {
    titleAxis?: {
      x?: string;
      y?: string;
    };
  };
}

export interface Datasets {
  name: string;
  values: Datavalue[];
}

export interface Datavalue {
  x: number;
  y: number;
}

export interface Scale {
  auto: boolean;
  min?: number;
  max?: number;
}
