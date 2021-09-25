if (typeof registerPaint !== 'undefined') {
  class GridRadar {
    static get inputProperties() {
      return ['--grid-labels', '--grid-segments', '--grid-color'];
    }
    paint(ctx, size, properties) {
      const color = String(properties.get('--grid-color'));
      const segments = parseInt(properties.get('--grid-segments'));
      const labels = parseInt(properties.get('--grid-labels'));

      const height = size.height;
      const width = size.width;

      const circleSize = width / 2;
      const centerX = width / 2;
      const centerY = height / 2;

      const getPolygonPos = (size, labels) => {
        let dotsArray = [];
        let angle = (Math.PI * 2) / labels;

        for (let i = 0; i < labels; i++) {
          let curPos = {};
          curPos.x = size * Math.sin(i * angle) + centerX;
          curPos.y = -size * Math.cos(i * angle) + centerY;
          dotsArray.push(curPos);
        }

        // push first value again to close shape
        dotsArray.push(dotsArray[0]);

        return dotsArray;
      };

      let radiusSizes = [];
      let segmentDistance = circleSize / (segments - 1);

      for (let i = 0; i < segments; i++) {
        radiusSizes[i] = segmentDistance * i;
      }

      radiusSizes.reverse();

      ctx.strokeStyle = color;

      // Polygon
      for (let i = 0; i < radiusSizes.length; i++) {
        const polygon = getPolygonPos(radiusSizes[i], labels);
        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);

        // increase counter + 1 because of doubled first value
        for (let j = 0; j < labels + 1; j++) {
          ctx.lineTo(polygon[j].x, polygon[j].y);
        }

        ctx.stroke();
      }

      // Axis lines
      const polygon = getPolygonPos(circleSize, labels);
      ctx.beginPath();

      for (let i = 0; i < labels; i++) {
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(polygon[i].x, polygon[i].y);
      }

      ctx.stroke();

      // Test Circle
      ctx.beginPath();
      ctx.arc(centerX, centerX, circleSize, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
  registerPaint('grid-radar', GridRadar);
}
