if (typeof registerPaint !== 'undefined') {
  class pathRadar {
    static get inputProperties() {
      return ['--path-points', '--path-xaxis', '--path-range', '--path-color'];
    }
    paint(ctx, size, properties) {
      const points = JSON.parse(String(properties.get('--path-points')));
      const xaxis = parseInt(properties.get('--path-xaxis'));
      const range = JSON.parse(String(properties.get('--path-range')));
      const color = String(properties.get('--path-color')) || '#000';

      const height = size.height;
      const width = size.width;

      const centerX = width / 2;
      const centerY = height / 2;

      const getPolygonPos = (size, point) => {
        let angle = (Math.PI * 2) / xaxis;
        let curPos = {};
        curPos.x = size * Math.sin(point * angle) + centerX;
        curPos.y = -size * Math.cos(point * angle) + centerY;
        return curPos;
      };

      let dotsArray = [];
      for (let i = 0; i < xaxis; i++) {
        const size = centerY * (points[i] / range.y - range.zeroY);
        dotsArray.push(getPolygonPos(size, i));
      }
      // push first value again to close shape
      dotsArray.push(dotsArray[0]);

      ctx.lineWidth = 2;
      ctx.strokeStyle = color;

      ctx.beginPath();
      ctx.moveTo(dotsArray[0].x, dotsArray[0].y);

      // increase counter + 1 because of doubled first value
      for (let i = 0; i < xaxis + 1; i++) {
        ctx.lineTo(dotsArray[i].x, dotsArray[i].y);
      }

      ctx.stroke();
    }
  }
  registerPaint('path-radar', pathRadar);
}
