if (typeof registerPaint !== 'undefined') {
  class GridBasic {
    static get inputProperties() {
      return ['--grid-color', '--grid-segmentsY', '--grid-segmentsX', '--grid-highlight'];
    }

    paint(ctx, size, properties) {
      const color = String(properties.get('--grid-color'));
      const segmentsX = parseInt(properties.get('--grid-segmentsX'));
      const segmentsY = parseInt(properties.get('--grid-segmentsY'));
      const gridHighlight = parseInt(properties.get('--grid-highlight'));

      const height = size.height;
      const width = size.width;
      const segments = {
        width: width / segmentsX,
        height: Math.round((height / segmentsY) * 100) / 100,
      };

      ctx.strokeStyle = color;

      ctx.beginPath();
      // +1 quickfix for rounding issues
      for (let x = 0; x <= width + 1; x += segments.width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      ctx.beginPath();
      // +1 quickfix for rounding issues
      for (let y = 0; y <= height + 1; y += segments.height) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      if (gridHighlight) {
        ctx.strokeStyle = '#1c1c1ccc';

        const x = gridHighlight + 5;

        ctx.beginPath();
        ctx.setLineDash([20, 5]);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }
  }
  registerPaint('grid-basic', GridBasic);
}
