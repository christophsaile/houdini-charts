export default function getPolygonPos(size: number, dataPointsLen: number) {
  let dotsArray = [];
  let angle = (Math.PI * 2) / dataPointsLen;
  for (let i = 0; i < dataPointsLen; i++) {
    let curPos: { x?: number; y?: number } = {};
    curPos.x = size * Math.sin(i * angle);
    curPos.y = -size * Math.cos(i * angle);
    dotsArray.push(curPos);
  }
  return dotsArray;
}
