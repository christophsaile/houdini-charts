import { coordinates } from './utils';

/**
 *Note:
 *for css add center
 *for canvas add center + invert y value
 */
export function getRadarPoints(
  points: number[],
  size: coordinates,
  range: { y: number; zeroY: number }
): coordinates[] {
  let dotsArray: coordinates[] = [];
  const center = size.y / 2;
  const angle = (Math.PI * 2) / points.length;

  const getPolygonPos = (size: number, dataPoint: number) => {
    let curPos: coordinates = { x: 0, y: 0 };
    curPos.x = size * Math.sin(dataPoint * angle);
    curPos.y = size * Math.cos(dataPoint * angle);

    return curPos;
  };

  for (let i = 0, n = points.length; i < n; i++) {
    const newSize = center * (points[i] / range.y - range.zeroY);
    dotsArray.push(getPolygonPos(newSize, i));
  }

  // push first value again to close shape
  dotsArray.push(dotsArray[0]);

  return dotsArray;
}
