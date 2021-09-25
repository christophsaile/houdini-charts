if (typeof registerPaint !== 'undefined') {
  class pathRadar {
    static get inputProperties() {
      return ['--path-points', '--path-range', '--path-color'];
    }
    paint(ctx, size, properties) {
      console.log(size);
    }
  }
  registerPaint('path-radar', pathRadar);
}
