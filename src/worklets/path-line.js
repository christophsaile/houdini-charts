if (typeof registerPaint !== 'undefined') {
  class PathLine {
    static get inputProperties() {
      return ['--path-points', '--path-color'];
    }

    paint(ctx, size, properties) {
      const points = JSON.parse(String(properties.get('--path-points')));
      const color = String(properties.get('--path-color')) || '#000';

      const height = size.height;

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        const x = points[i].x;
        const y = height - points[i].y;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }
  registerPaint('path-line', PathLine);
}
