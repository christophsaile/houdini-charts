export interface Data {
  title?: string;
  chartType: string;
  data: {
    labels: string[];
    datasets: Datasets[];
  };
  options?: {
    startAtZero?: boolean;
    scale?: {
      x?: {
        min: number;
        max: number;
      };
      y?: {
        min: number;
        max: number;
      };
    };
    labelAxis?: {
      x?: string;
      y?: string;
    };
  };
}

export interface Datasets {
  name: string;
  values: number[];
}
