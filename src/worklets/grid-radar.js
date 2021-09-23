if (typeof registerPaint !== 'undefined') {
  class GridRadar {
    static get inputProperties() {
      return ['--grid-color', '--grid-segementsY', '--grid-segementsX', '--grid-highlight'];
    }
    paint(ctx, size, properties) {}
  }
  registerPaint('grid-radar', GridRadar);
}
