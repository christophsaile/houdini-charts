import { Coordinates, Range } from '../charts/charts';

/**
 *Note:
 *for css add center
 *for canvas add center + invert y value
 */
export function getRadarPoints(
  dataseries: number[],
  size: Coordinates,
  range: Range
): Coordinates[] {
  let dotsArray: Coordinates[] = [];
  const center = size.y / 2;
  const angle = (Math.PI * 2) / dataseries.length;

  const getPolygonPos = (radiusSize: number, axis: number) => {
    let curPos: Coordinates = { x: 0, y: 0 };
    curPos.x = radiusSize * Math.sin(axis * angle);
    curPos.y = radiusSize * Math.cos(axis * angle);

    return curPos;
  };

  for (let i = 0, n = dataseries.length; i < n; i++) {
    const radiusSize = center * (dataseries[i] / range.y! - range.zeroY!);
    dotsArray.push(getPolygonPos(radiusSize, i));
  }

  // push first value again to close shape
  dotsArray.push(dotsArray[0]);

  return dotsArray;
}
