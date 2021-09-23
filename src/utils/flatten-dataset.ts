import { Datasets } from '../config';

export function flattenDataset(data: Datasets[]): number[] {
  return data.flatMap((elem) => elem.values.map((item) => item));
}
