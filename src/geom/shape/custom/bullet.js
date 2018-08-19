/**
 * @fileOverview 自定义的 bullet shape
 * @author xinming002@gmail.com
 */
const Util = require('../../../util');
const Shape = require('../shape');
const { addPoints, getAttrs } = require('./utils');

/**
 * @param  {object} pointInfo: {x, y, y0, size},y坐标必须是数组形式[target, actual, max]
 * @return {array}  points
 */
function getBulletPoints(pointInfo) {
  const { x, y0, size: width } = pointInfo;
  const points = [];
  let { y } = pointInfo;
  if (!Util.isArray(y)) {
    y = [ y ];
  }
  const target = y[0]; // 目标值
  const actual = y[1]; // 实际值
  const max = y[2] || Math.max(target, actual); // 最大值,value[2] 或value[1]
  const pointsArray = [
    // 子弹图分类轴
    [ x - width, y0 ],
    [ x - width, max ],
    [ x + width, max ],
    [ x + width, y0 ],
    // 子弹图进度轴，宽度为一半
    [ x - width / 2, y0 ],
    [ x - width / 2, actual ],
    [ x + width / 2, actual ],
    [ x + width / 2, y0 ],
    // 子弹图目标值, 宽度为0.9
    [ x + (width * 0.9), target ],
    [ x - (width * 0.9), target ]
  ];

  addPoints(pointsArray, points);
  return points;
}

// 子弹图
Shape.registerShape('schema', 'bullet', {
  getPoints(pointInfo) {
    return getBulletPoints(pointInfo);
  },
  draw(cfg, container) {
    const attrs = getAttrs(cfg);
    const points = cfg.points;
    // 1. 添加子弹图背景
    let backPlot = [
      [ 'M', points[0].x, points[0].y ],
      [ 'L', points[1].x, points[1].y ],
      [ 'L', points[2].x, points[2].y ],
      [ 'L', points[3].x, points[3].y ],
      [ 'L', points[0].x, points[0].y ], // 封闭 z
      [ 'Z' ]
    ];
    backPlot = this.parsePath(backPlot);
    container.addShape('path', {
      attrs: {
        path: backPlot,
        fill: 'transparent',
        stroke: '#ddd'
      }
    });

    // 2. 添加进度条
    let bulletPath = [
      [ 'M', points[4].x, points[4].y ],
      [ 'L', points[5].x, points[5].y ],
      [ 'L', points[6].x, points[6].y ],
      [ 'L', points[7].x, points[7].y ],
      [ 'L', points[4].x, points[4].y ], // 封闭 z
      [ 'Z' ]
    ];
    bulletPath = this.parsePath(bulletPath);
    container.addShape('path', {
      attrs: {
        path: bulletPath,
        stroke: 'transparent',
        // 进度条颜色由用户输入
        fill: attrs.fill
      }
    });

    // 3. 添加子弹图目标
    let targetPath = [
      [ 'M', points[8].x, points[8].y ],
      [ 'L', points[9].x, points[9].y ]
    ];
    targetPath = this.parsePath(targetPath);
    return container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: targetPath
      })
    });
  }
});
