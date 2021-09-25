if (typeof registerPaint !== 'undefined') {
  class pathLine {
    static get inputProperties() {
      return ['--path-points', '--path-range', '--path-color'];
    }

    paint(ctx, size, properties) {
      const points = JSON.parse(String(properties.get('--path-points')));
      const range = JSON.parse(String(properties.get('--path-range')));
      const color = String(properties.get('--path-color')) || '#000';

      const height = size.height;
      const width = size.width;

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        const x = i;
        const y = points[i];
        const newX = width * (x / range.x);
        const newY = height - height * (y / range.y - range.zeroY);
        ctx.lineTo(newX, newY);
      }

      ctx.stroke();
    }
  }
  registerPaint('path-line', pathLine);
}
