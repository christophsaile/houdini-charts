if (typeof registerPaint !== 'undefined') {
  class GridBasic {
    static get inputProperties() {
      return ['--grid-color', '--grid-segementsY', '--grid-segementsX', '--grid-highlight'];
    }

    paint(ctx, size, properties) {
      const color = String(properties.get('--grid-color'));
      const segmentsX = parseInt(properties.get('--grid-segementsX'));
      const segmentsY = parseInt(properties.get('--grid-segementsY'));
      const gridHighlight =
        properties.get('--grid-highlight').length != 0
          ? JSON.parse(String(properties.get('--grid-highlight')))
          : undefined;

      const height = size.height;
      const width = size.width;
      const segments = {
        width: width / segmentsX,
        height: height / segmentsY,
      };

      ctx.strokeStyle = color;

      ctx.beginPath();
      for (let x = 0; x <= width; x += segments.width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let y = 0; y <= height; y += segments.height) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      if (gridHighlight) {
        ctx.strokeStyle = '#000';

        if (gridHighlight.x === 0 && gridHighlight.y === 0) {
          return;
        }

        const position = {
          x: width * (0.01 * gridHighlight.x),
          y: height - height * (0.01 * gridHighlight.y),
        };

        ctx.beginPath();
        ctx.moveTo(0, position.y);
        ctx.lineTo(width, position.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(position.x, 0);
        ctx.lineTo(position.x, height);
        ctx.stroke();
      }
    }
  }
  registerPaint('grid-basic', GridBasic);
}
