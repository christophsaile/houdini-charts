if (typeof registerPaint !== 'undefined') {
  class Tooltip {
    static get inputProperties() {
      return ['background-color'];
    }

    paint(ctx, size, properties) {
      const color = String(properties.get('background-color'));
      const position = (size.width * 25) / 100;
      const arrowSize = 10;

      ctx.beginPath();
      ctx.moveTo(position - arrowSize, 0);
      ctx.lineTo(position + arrowSize, 0);
      ctx.lineTo(position, size.height);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();
    }
  }
  registerPaint('tooltip', Tooltip);
}
