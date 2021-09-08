interface Config {
  labels: {
    titel: string;
    xAxe: string;
    yAxe: string;
  };
  axes: {
    xAxe: Axe;
    yAxe: Axe;
  };
  datasets: Dataset[];
}

interface Axe {
  auto: boolean;
  min?: number;
  max?: number;
}

interface Dataset {
  label: string;
  data: number;
}
