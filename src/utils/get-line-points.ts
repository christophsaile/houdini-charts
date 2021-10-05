import { coordinates } from './utils';
import { getDaysDiff } from './get-days-difference';

export function getLinePoints(
  points: number[],
  size: coordinates,
  range: { x: number; y: number; zeroY: number }
): coordinates[] {
  let dotsArray: coordinates[] = [];

  for (let i = 0, n = points.length; i < n; i++) {
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

export function getLinePointsDate(
  pointsY: number[],
  pointsX: string[],
  size: coordinates,
  range: { x: number; y: number; zeroY: number }
): coordinates[] {
  let dotsArray: coordinates[] = [];

  for (let i = 0, n = pointsY.length; i < n; i++) {
    const daysDifference = getDaysDiff(pointsX[i], pointsX[0]);
    const x = size.x * (daysDifference / range.x);

    const y = size.y * (pointsY[i] / range.y - range.zeroY);
    const coordinates = {
      x: x,
      y: y,
    };
    dotsArray.push(coordinates);
  }
  return dotsArray;
}
