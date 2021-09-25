export function setMinToZero(scaleMin: number, scaleMax: number): number {
  return scaleMin / (scaleMax - scaleMin);
}
