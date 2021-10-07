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
  let dotsArray: Coordinates[] = [];
  let firstDate;
  switch (range.tickInterval) {
    case 'years': {
      console.log('interval not defined');
      break;
    }
    case 'half_year':
    case 'months':
    case 'months_fortnight': {
      firstDate = DateTime.fromFormat(pointsX[0], 'yyyy LLL dd')
        .startOf('month')
        .toFormat('yyyy LLL dd');
      break;
    }
    case 'months_days':
    case 'days':
    case 'week_days': {
      firstDate = pointsX[0];
      break;
    }
    case 'hours': {
      console.log('interval not defined');
      break;
    }
    case 'minutes_fives':
    case 'minutes':
      console.log('interval not defined');
      break;
    case 'seconds_tens':
    case 'seconds_fives':
    case 'seconds':
      console.log('interval not defined');
      break;
  }

  for (let i = 0, n = pointsY.length; i < n; i++) {
    const daysDifference = getDaysDiff(pointsX[i], firstDate);
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
