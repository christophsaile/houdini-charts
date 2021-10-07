import { Coordinates, Range } from '../charts/charts';
import { getDaysDiff } from './get-days-difference';
import { DateTime } from 'luxon';

export function getLinePoints(points: number[], size: Coordinates, range: Range): Coordinates[] {
  let dotsArray: Coordinates[] = [];

  for (let i = 0, n = points.length; i < n; i++) {
    const x = size.x * (i / range.x!);
    const y = size.y * (points[i] / range.y! - range.zeroY!);
    const coordinates: Coordinates = {
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
  size: Coordinates,
  range: Range
): Coordinates[] {
  const firstMonthStart = DateTime.fromFormat(pointsX[0], 'yyyy LLL dd')
    .startOf('month')
    .toFormat('yyyy LLL dd');
  let dotsArray: Coordinates[] = [];

  for (let i = 0, n = pointsY.length; i < n; i++) {
    const daysDifference = getDaysDiff(pointsX[i], firstMonthStart);
    const x = size.x * (daysDifference / range.x!);
    const y = size.y * (pointsY[i] / range.y! - range.zeroY!);
    const coordinates: Coordinates = {
      x: x,
      y: y,
    };
    dotsArray.push(coordinates);
  }

  return dotsArray;
}
