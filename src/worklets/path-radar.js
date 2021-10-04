if (typeof registerPaint !== 'undefined') {
  class pathRadar {
    static get inputProperties() {
      return ['--path-points', '--path-fill', '--path-color'];
    }
    paint(ctx, size, properties) {
      const points = JSON.parse(String(properties.get('--path-points')));
      const fill =
        String(properties.get('--path-fill')).toLocaleLowerCase() === 'true' ? true : false;
      const color = String(properties.get('--path-color')) || '#000';

      const centerX = size.width / 2;
      const centerY = size.height / 2;

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      points.map((item) => {
        item.x = item.x + centerX;
        item.y = item.y * -1 + centerY;

        return item;
      });

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 0, n = points.length; i < n; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (fill) {
        ctx.fillStyle = `${color}33`; // todo: fix alpha for all colors
        ctx.fill();
      }
      ctx.stroke();
    }
  }
  registerPaint('path-radar', pathRadar);
}
