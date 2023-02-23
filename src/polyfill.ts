interface CornerRadius {
  upperLeft: number;
  upperRight: number;
  lowerLeft: number;
  lowerRight: number;
}

// @ts-ignore
declare global {
  interface CanvasRenderingContext2D {
    roundRect(
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number | CornerRadius,
    ): void;
  }
}
if (typeof CanvasRenderingContext2D.prototype.roundRect !== 'function') {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    const cornerRadius: CornerRadius =
      typeof radius === 'object'
        ? { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0, ...radius }
        : { upperLeft: radius!, upperRight: radius!, lowerLeft: radius!, lowerRight: radius! };

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    this.fill();
  };
}