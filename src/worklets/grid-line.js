if (typeof registerPaint !== 'undefined') {
  class GridLine {
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
        height: height / segmentsY,
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
        const lineWidth = 2;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#929292';

        const x = gridHighlight + 5;

        ctx.beginPath();
        ctx.setLineDash([20, 5]);
        ctx.moveTo(x - lineWidth / 2, 0);
        ctx.lineTo(x - lineWidth / 2, height);
        ctx.stroke();
      }
    }
  }
  registerPaint('grid-line', GridLine);
}
