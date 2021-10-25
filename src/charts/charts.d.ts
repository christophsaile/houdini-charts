export interface Range {
  x?: number;
  y?: number;
  zeroY?: number;
  tickInterval?: string;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface NiceNumbers {
  tickSpacing: number;
  niceMinimum: number;
  niceMaximum: number;
}
