export type IPolygonOption = {
  pointX: number
  pointY: number
  r: number
  numofSide: number
  maxScore: number
  pointScore: number[]
}

/*多边形构造函数*/
class Polygon {
  private pointY: number = 0;
  private pointX: number = 0;
  private numofSide: number;
  private r: number;
  private strokeStyle: string;
  private ctx: CanvasRenderingContext2D;
  private progress: number = 0;
  private canvas: HTMLCanvasElement;
  private maxScore: number = 0;
  private pointSize: number = 4;
  private pointScore: number[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, option: IPolygonOption) {
    this.pointY = option.pointY;
    this.pointX = option.pointX;
    this.numofSide = option.numofSide || 3;
    this.r = option.r;
    this.strokeStyle = '#c7cbd5';
    this.ctx = ctx;
    this.canvas = canvas;
    this.maxScore = option.maxScore;
    this.pointScore = option.pointScore;
  }

  // 绘制雷达圈
  public draw({ lineDash = [] }: { lineDash: number[] }) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.setLineDash(lineDash);
    const startX = this.pointX + this.r * Math.sin(Math.PI - (2 * Math.PI * 0) / this.numofSide);

    const startY = this.pointY + this.r * Math.cos(Math.PI + (2 * Math.PI * 0) / this.numofSide);

    this.ctx.moveTo(startX, startY);
    for (let i = 1; i <= this.numofSide; i++) {
      const X = this.pointX + this.r * Math.sin(Math.PI - (2 * Math.PI * i) / this.numofSide);
      const Y = this.pointY + this.r * Math.cos(Math.PI + (2 * Math.PI * i) / this.numofSide);
      this.ctx.lineTo(X, Y);
    }

    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.fillStyle = 'rgba(255,255,255,0.01)';
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();
  }

  //绘制辐射线
  public drawLine() {
    this.ctx.beginPath();
    for (let i = 1; i <= this.numofSide; i++) {
      this.ctx.lineWidth = this.canvas!.height * 0.002;
      this.ctx.strokeStyle = this.strokeStyle;
      this.ctx.moveTo(this.pointX, this.pointY);
      const X = this.pointX + this.r * Math.sin(Math.PI - (2 * Math.PI * i) / this.numofSide);
      const Y = this.pointY + this.r * Math.cos(Math.PI + (2 * Math.PI * i) / this.numofSide);
      this.ctx.lineTo(X, Y);
    }
    this.ctx.setLineDash([]);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  // 绘制点位
  public drawPoint() {
    if (this.progress >= this.maxScore) {
      this.progress === this.maxScore;
    } else {
      // 中间面积的扩散速度
      this.progress += 0.2;
    }

    /*连接分数点*/
    this.ctx.beginPath();
    this.ctx.lineWidth = 0.01; // 隐藏掉border

    const posList: [number, number][] = [];

    for (let i = 0; i < this.numofSide; i++) {
      const x =
        this.pointX -
        ((this.progress * this.pointScore[i]) / this.maxScore / 100) *
        this.r *
        Math.sin(Math.PI + (2 * Math.PI * i) / this.numofSide);
      const y =
        this.pointY +
        ((this.progress * this.pointScore[i]) / this.maxScore / 100) *
        this.r *
        Math.cos(Math.PI + (2 * Math.PI * i) / this.numofSide);

      posList.push([x, y]);

      // 绘制分数点
      this.ctx.beginPath();
      this.ctx.fillStyle = '#2CB6FF';
      this.ctx.lineWidth = 0;
      const r = this.pointSize;

      this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);

      this.ctx.setLineDash([]);
      this.ctx.fill();
      this.ctx.stroke();
    }

    // 分数点连线
    posList.forEach(([x, y]) => {
      this.ctx.lineTo(x, y);
    });

    this.ctx.fillStyle = 'rgba(44,182,255,0.13)';
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();
  }

  // 绘制label
  public drawTip(
    text: string,
    x: number,
    y: number,
    { color, bgColor }: { color: string; bgColor: string },
  ) {
    const fontSize = this.r / 8;
    this.ctx.beginPath();
    this.ctx.font = fontSize + 'px sans-serif';
    this.ctx.textAlign = 'center';

    const textWidth = this.ctx.measureText(text).width;
    const doublePadding = this.r / 6;
    const blockHeight = this.r / 5;
    const radius = 30;

    this.ctx.fillStyle = bgColor;
    this.ctx.roundRect(
      x - (textWidth + doublePadding) / 2,
      y - blockHeight / 2 - fontSize / 4,
      textWidth + doublePadding,
      blockHeight,
      radius,
    );
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);

    this.ctx.closePath();

    this.ctx.restore();
  }
}

export type RadarOptions = {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  maxBoundaryValue: number;
  width: number;
  height: number;
};

export const renderRadar = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: RadarOptions,
) => {
  const { data, maxBoundaryValue, height: canvasH, width: canvasW } = options;

  const pointScore: number[] = [];

  data.forEach((item) => {
    pointScore.push(item.value);
  });

  ctx.clearRect(0, 0, canvasW, canvasH)

  /*设置画布宽高*/
  canvas.width = canvasW;
  canvas.height = canvasH;

  //根据设备的DPR设置画布的宽高
  if (window.devicePixelRatio) {
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';
    canvas.height = canvasH * window.devicePixelRatio;
    canvas.width = canvasW * window.devicePixelRatio;
  }

  const polygonArr: Polygon[] = []; //存放多边形实例

  // tips距离圆心的半径
  const Radius = canvas.height / 2.2;

  const numofSide = pointScore.length; //n边形(n>=3)

  const maxScore = maxBoundaryValue || Math.max.apply(Math, pointScore);

  const layer1 = new Polygon(
    canvas,
    ctx,
    {
      pointX: canvas.width / 2,
      pointY: canvas.height / 2,
      numofSide: numofSide,
      r: canvas.width / 3.5,
      maxScore,
      pointScore,
    },
  );

  const layer2 = new Polygon(
    canvas,
    ctx,
    {
      pointX: canvas.width / 2,
      pointY: canvas.height / 2,
      numofSide: numofSide,
      r: ((canvas.width / 3.5) * 3) / 5,
      maxScore,
      pointScore
    },
  );

  polygonArr.push(layer1, layer2);

  const animationLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygonArr.forEach((polygon, polygonIndex) => {
      polygon.draw({ lineDash: polygonIndex === 0 ? [] : [10, 15] });

      if (polygonIndex === polygonArr.length - 1) {
        polygon.draw({ lineDash: [10, 15] });

        data.forEach((dataItem, tipIndex) => {
          const x =
            canvas.width / 2 -
            (Radius * 0.85) * Math.sin(Math.PI + (2 * Math.PI * tipIndex) / pointScore.length);

          const y =
            canvas.height / 2 +
            (Radius * 0.85) * Math.cos(Math.PI + (2 * Math.PI * tipIndex) / pointScore.length);

          polygonArr[0].drawTip(dataItem.name, x, y, {
            color: '#fff',
            bgColor: dataItem.color,
          });

          polygonArr[0].drawPoint();
        });

        polygonArr[0].drawLine();
      }
    });

    requestAnimationFrame(animationLoop);
  };

  requestAnimationFrame(animationLoop);
};
