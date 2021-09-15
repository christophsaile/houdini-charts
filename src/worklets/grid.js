if (typeof registerPaint !== 'undefined') {
  class Grid {
    static get inputProperties() {
      return ['--grid-color', '--grid-segementsY', '--grid-segementsX'];
    }

    paint(ctx, size, properties) {
      const color = String(properties.get('--grid-color'));
      const segmentsX = parseInt(properties.get('--grid-segementsX'));
      const segmentsY = parseInt(properties.get('--grid-segementsY'));

      const height = size.height;
      const width = size.width;
      const segmentsWidth = width / segmentsX;
      const segmentsHeight = height / segmentsY;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let x = 0; x <= width; x += segmentsWidth) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let y = 0; y <= height; y += segmentsHeight) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }
  }
  registerPaint('grid', Grid);
}
