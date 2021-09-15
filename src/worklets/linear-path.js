if (typeof registerPaint !== 'undefined') {
  class LinearPath {
    static get inputProperties() {
      return ['--path-data', '--path-color'];
    }

    paint(ctx, size, properties) {
      const data = JSON.parse(String(properties.get('--path-data')));
      const color = String(properties.get('--path-color')) || '#000';

      const height = size.height;
      const width = size.width;

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      const dataToPixel = (value, height) => {
        const range = height;
        return value / range;
      };

      console.log(dataToPixel(data[4].y, height, width));

      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(200, 400);
      ctx.lineTo(300, 800);
      ctx.stroke();

      console.log(data);
      console.log(width, height, color);
    }
  }
  registerPaint('linearPath', LinearPath);
}
