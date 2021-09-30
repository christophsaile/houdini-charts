import { coordinates } from './utils';

export function getLinePoints(
  points: number[],
  size: coordinates,
  range: { x: number; y: number; zeroY: number }
): coordinates[] {
  let dotsArray: coordinates[] = [];

  for (let i = 0; i < points.length; i++) {
    const x = size.x * (i / range.x);
    const y = size.y * (points[i] / range.y - range.zeroY);
    const coordinates = {
      x: x,
      y: y,
    };
    dotsArray.push(coordinates);
  }
  return dotsArray;
}
