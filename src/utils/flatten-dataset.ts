import { Datasets } from '../data';

export function flattenDataset(data: Datasets[], axis: 'x' | 'y'): number[] {
  return data.flatMap((elem) => elem.values.map((item) => item[axis]));
}
