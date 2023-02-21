// https://github.com/coffeedeveloper/turntable#readme
// const tween = {
//   linear: (t, b, c, d) => c * t / d + b,
//   easeInQuart: (t, b, c, d) => c * (t /= d) * t * t * t + b,
//   easeOutQuart: (t, b, c, d) => -c * ((t = t / d - 1) * t * t * t - 1) + b,
// };

// 插入style样式
const appendCSS = (css) => {
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
};

// 对象属性合并
const extend = function (target) {
  for (var i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    for (let p in arg) {
      target[p] = arg[p];
    }
  }
  return target;
};

// 创建一个具有指定的命名空间 URI 和限定名称的元素（https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS）
const createSvgEle = (name) =>
  document.createElementNS("http://www.w3.org/2000/svg", name);

const setAttrs = (ele, attrs) => {
  for (let t in attrs) {
    if (t == "href")
      ele.setAttributeNS("http://www.w3.org/1999/xlink", t, attrs[t]);
    else ele.setAttribute(t, attrs[t]);
  }

  return ele;
};

const getPathPoint = (oPoint, degree) => {
  return {
    x: oPoint.x + oPoint.r * Math.cos(degree * (Math.PI / 180)),
    y: oPoint.y + oPoint.r * Math.sin(degree * (Math.PI / 180)),
    degree,
  };
};

const getPointsDistance = (o, t) =>
  Math.sqrt(Math.pow(t.x - o.x, 2) + Math.pow(t.y - o.y, 2));

const movePoint = (oPoint, tPoint, dis, len) => {
  let x = -1 * ((dis * (tPoint.x - oPoint.x)) / len - tPoint.x);
  let y = -1 * ((dis * (tPoint.y - oPoint.y)) / len - tPoint.y);
  return { x, y };
};

const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const defaults = {
  type: "frame", //转盘转动类型
  size: 320, //转盘尺寸，默认为320
  textSpace: 15, //奖品名称距离转盘边距，默认为15
  // imgSpace: 50, //奖品图片距离转盘边距，默认为50
  speed: 5, //触发start事件后，转盘开始转动的速度，数字必须能给360整除 (5*60/s)
  fastSpeed: 10, //转盘进入高速转动的速度，数字必须能够给360整除 (10*60/s)
  slowSpeed: 5, //转盘从高速转动降下来的速度，数字必须能够给360整除
  speedUp: 2000, //多少毫秒后进入高速转动
  speedDown: 2000, //触发stop事件后，多少毫秒进入缓速
  values: [], //奖品对象，根据传多少个奖品对象，自动生成相应数量的转盘抽奖内容
  className: "turntable-effect", //动态添加class控制transition模式旋转的动画
  ring: 8, //转动多少圈后到达终点，越大转速越快
};

// requestAnimationFrame 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画
// 回调函数执行次数通常是每秒 60 次
// let requestAnimationFrame
// let cancelAnimationFrame
// if (window) {
//   requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
//     || window.mozRequestAnimationFrame || window.oRequestAnimationFrame
//     || window.msRequestAnimationFrame;

//   // cancelAnimationFrame 取消一个先前通过调用window.requestAnimationFrame()方法添加到计划中的动画帧请求
//   cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
// }

export default class Turntable {
  constructor(options) {
    this.opts = extend({}, defaults, options);
    if (!this.opts.values) {
      throw Error("values必须要有值");
      return;
    }

    let half = this.opts.size / 2;
    //圆的中心的坐标及半径
    this.center = {
      x: half,
      y: half,
      r: half,
    };

    //圆的x轴坐标
    this.startPoint = {
      x: this.opts.size,
      y: half,
    };

    this.values = this.opts.values;
    this.count = this.opts.values.length;
    this.degree = 360 / this.count;

    this.container = null;
    this.svg = null;

    if (this.opts.container) this.draw(this.opts.container);
  }

  getValueIndexById(id) {
    let r = this.values.filter((d) => d.id == id).map((d) => d.index);
    return r[random(0, r.length - 1)];
  }

  getValueDegreeByIndex(index) {
    return this.values[index].degree;
  }

  setTransform(val) {
    this.svg.style.msTransform = val;
    this.svg.style.oTransform = val;
    this.svg.style.mozTransform = val;
    this.svg.style.webkitTransform = val;
    this.svg.style.transform = val;
  }

  // 转动中
  turning() {
    this.turnTotal += this.turnBase;
    if (this.turnTotal >= 360 || this.turnTotal <= -360) this.turnTotal = 0;

    this.setTransform("rotate(" + -this.turnTotal + "deg)");
  }

  // 转动结束
  turned() {
    if (this.turnTotal >= 360 || this.turnTotal <= -360) this.turnTotal = 0;
    this.turnTotal += this.turnBase;

    if (parseInt(this.turnTotal, 10) == parseInt(this.turnEndDegree)) {
      cancelAnimationFrame(this.animation);
      this.setTransform("rotate(" + -this.turnTotal + "deg)");
      this.isTurning = false;
      this.turnCallback(this.opts.values[this.index]);
      return false;
    }

    this.setTransform("rotate(" + -this.turnTotal + "deg)");
    return true;
  }

  turn() {
    this.animation = requestAnimationFrame(
      function () {
        if (!this.isTurnStop) {
          this.turning();
          this.turn();
        } else {
          if (this.turned()) {
            this.turn();
          }
        }
      }.bind(this)
    );
  }

  start() {
    if (this.isTurning) return;
    this.turnBase = this.opts.speed;
    this.turnTotal = 0;
    this.isTurnStop = false;
    this.index = null;
    this.isTurning = true;
    this.turn();

    setTimeout(
      function () {
        this.turnBase = this.opts.fastSpeed;
      }.bind(this),
      this.opts.speedUp
    );
  }

  stop(id, cb) {
    this.index = this.getValueIndexById(id);
    this.turnEndDegree = this.getValueDegreeByIndex(this.index);
    this.turnBase = this.opts.slowSpeed;
    if (typeof cb !== "function") cb = function () {};
    this.turnCallback = cb;

    setTimeout(
      function () {
        this.turnBase = 1;
        this.isTurnStop = true;
      }.bind(this),
      this.opts.speedDown
    );
  }

  goto(id, cb) {
    if (this.isTurning) return;
    this.isTurning = true;
    let deg = Math.abs(
      this.svg.style.transform.replace("rotate(", "").replace("deg)", "") || 0
    );
    let ndeg = deg != 0 ? Math.abs(this.turnEndDegree) : 0;

    ndeg = Math.abs(this.opts.ring * 360 + deg - ndeg);

    this.index = this.getValueIndexById(id);
    this.turnEndDegree = this.getValueDegreeByIndex(this.index);
    this.turnCallback = cb;

    this.setTransform(`rotate(-${ndeg + this.turnEndDegree}deg)`);
  }

  // 绘制转盘
  draw(container) {
    var that = this;
    this.container = container;

    let svg = setAttrs(createSvgEle("svg"), {
      width: this.opts.size,
      height: this.opts.size,
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
    });

    let degree = this.degree;
    let pathStartPoint = this.startPoint;
    let pathEndPoint = getPathPoint(this.center, degree);

    this.values = this.values.map((info, i) => {
      info.degree =
        i == 0 ? 90 + this.degree / 2 : this.values[i - 1].degree + this.degree;
      if (info.degree >= 360) info.degree = info.degree - 360;
      info.index = i;

      let g = createSvgEle("g");

      // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
      let path = setAttrs(createSvgEle("path"), {
        fill: info.bg,
        d: `
          M${this.center.x}, ${this.center.y}
          L${pathStartPoint.x}, ${pathStartPoint.y}
          A${this.center.x}, ${this.center.y}
          1 0, 1
          ${pathEndPoint.x}, ${pathEndPoint.y}
          z
        `,
      });

      g.appendChild(path);

      let fanCenterPoint = {
        x: (pathEndPoint.x + pathStartPoint.x) / 2,
        y: (pathEndPoint.y + pathStartPoint.y) / 2,
      };

      let centerDistance = getPointsDistance(fanCenterPoint, this.center);

      let textDegree = 180 - (360 - this.degree * 2) / 2 / 2;
      let textPoint = movePoint(
        this.center,
        fanCenterPoint,
        this.opts.textSpace,
        centerDistance
      );
      let rotate = textDegree + this.degree * i;

      let text = setAttrs(createSvgEle("text"), {
        x: textPoint.x,
        y: textPoint.y,
        "text-anchor": "middle",
        "font-weight": 900,
        "font-size": "20px",
        stroke: info.color,
        "border-radius": "10%",
        // "font-family": "Barlow-Regular",
        // fill: info.color,
        transform: `rotate(${rotate}, ${textPoint.x}, ${textPoint.y})`,
      });
      text.appendChild(document.createTextNode(info.name));

      g.appendChild(text);

      if (info.img) {
        var imgPoint = movePoint(
          this.center,
          fanCenterPoint,
          info.imgSpace,
          centerDistance
        );
        var img = setAttrs(createSvgEle("image"), {
          width: info.img.width,
          height: info.img.height,
          href: info.img.src,
          x: imgPoint.x,
          y: imgPoint.y,
          transform: `rotate(${rotate}, ${imgPoint.x}, ${
            imgPoint.y
          }) translate(${-(info.img.width / 2)}, ${-(info.img.height / 2)})`,
        });
        g.appendChild(img);
      }

      svg.appendChild(g);

      pathStartPoint = pathEndPoint;
      pathEndPoint = getPathPoint(
        this.center,
        this.degree + this.degree * (i + 1)
      );

      return info;
    });

    container.appendChild(svg);
    this.svg = svg;

    if (this.opts.type == "transition") this.initTransition();
  }

  initTransition() {
    setAttrs(this.svg, { class: this.opts.className });

    this.svg.addEventListener(
      "transitionend",
      () => {
        this.isTurning = false;
        this.turnCallback(this.values[this.index]);
      },
      false
    );

    appendCSS(`
      .${this.opts.className} {
        -webkit-transition: -webkit-transform ${this.opts.speed}s ease-in-out;
        transition: transform ${this.opts.speed}s ease-in-out;
      }
    `);
  }
}
