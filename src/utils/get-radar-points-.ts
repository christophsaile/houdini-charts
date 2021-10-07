import { Coordinates, Range } from '../charts/charts';

/**
 *Note:
 *for css add center
 *for canvas add center + invert y value
 */
export function getRadarPoints(points: number[], size: Coordinates, range: Range): Coordinates[] {
  let dotsArray: Coordinates[] = [];
  const center = size.y / 2;
  const angle = (Math.PI * 2) / points.length;

  const getPolygonPos = (size: number, dataPoint: number) => {
    let curPos: Coordinates = { x: 0, y: 0 };
    curPos.x = size * Math.sin(dataPoint * angle);
    curPos.y = size * Math.cos(dataPoint * angle);

    return curPos;
  };

  for (let i = 0, n = points.length; i < n; i++) {
    const newSize = center * (points[i] / range.y! - range.zeroY!);
    dotsArray.push(getPolygonPos(newSize, i));
  }

  // push first value again to close shape
  dotsArray.push(dotsArray[0]);

  return dotsArray;
}
