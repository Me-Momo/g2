/**
 * @desc 自定义Shape的样板文件
 * @author xinming.lxj@antfin.com
 */

const Util = require('../../util');
// const PathUtil = Util.PathUtil;
// const ShapeUtil = require('../util/shape');
const Global = require('../../global');
const Shape = require('./shape');

// 1. 获取填充属性
// 对应Shape: point、area、interval、schema
function getFillAttrs(cfg) {
  const defaultAttrs = Global.shape.point;
  const pointAttrs = Util.mix({}, defaultAttrs, {
    fill: cfg.color,
    fillOpacity: cfg.opacity
    // radius: cfg.size, // 如point
    // stroke: cfg.color, // 针对带描边的图形;如area,interval,schema
    // lineWidth: cfg.size, // 针对带边的图形,如area,
  }, cfg.style);
  return pointAttrs;
}

// 2. 获取线属性
// 对应Shape: point、area、interval
function getLineAttrs(cfg) {
  const defaultAttrs = Global.shape.hollowPoint;
  const pointAttrs = Util.mix({}, defaultAttrs, {
    stroke: cfg.color,
    strokeOpacity: cfg.opacity,
    radius: cfg.size
  }, cfg.style);
  return pointAttrs;
}

const NewShape = Shape.registerFactory('<geomType>', {
  defaultShapeType: 'XXX',
  getActiveCfg(type, cfg) {
    // 返回活跃状态下的样式等等
    return {
      // 例子
      radius: cfg.radius + 1
      // strokeOpacity: 1
    };
  },
  getDefaultPoints(pointInfo) {
    // NOTE 这里可以对pointInfo进行处理
    return pointInfo;
  }
});

/**
 * @desc 此处拿到点的信息，可以自定义path
 * @see 关于cfg参数 详看: https://antv.alipay.com/zh-cn/g2/3.x/api/shape.html#_%E5%8F%82%E6%95%B0
 * @param {object} cfg 属性
 * @return {array} 返回绘制路径
 */
function getCustomPath(cfg) {
  // const path = [];
  // const points = cfg.points;
  // const nextPoints = cfg.nextPoints;
  return cfg.path;
}

/**
 * @desc 根据数据映射获取的点的信息，转换为绘制shape需要的关键点
 * 更多可以参看: 箱型图点的处理 getBoxPoints
 * @param {objec} cfg 属性
 * cfg: {x: number, y: any, y0: number, size: number}
 * @return {array} 返回绘制shape的关键点
 */
function getCustomPoints(cfg) {
  const points = cfg.points;
  return points;
}

Shape.registerShape('<geomType>', '<shapeType>', {
  getPoints(pointInfo) {
    // NOTE 这里可以对pointInfo进行处理,
    // 在draw过程就可以获取处理后的points
    return getCustomPoints(pointInfo);
  },
  draw(cfg, container) {
    // NOTE 以下两个attrs属于可选;根据实际情况
    // 判断你的shape是否可以通过style自定义fillAttrs和lineAttr
    const fillAttrs = getFillAttrs(cfg);
    const lineAttrs = getLineAttrs(cfg);
    let path = getCustomPath(cfg);
    // NOTE 将归一化的path转化为画布上的坐标值
    path = this.parsePath(path);
    return container.addShape('path', {
      attrs: Util.mix(fillAttrs, lineAttrs, {
        path
      })
    });
  }
  // 自定义Maker标记
  // getMarkerCfg(cfg) {
  //   const <shapeType>Cfg = getFillAttrs(cfg);
  //   const isInCircle = cfg.isInCircle;
  //   return Util.mix({
  //     symbol: isInCircle ? 'circle' : 'square',
  //     radius: isInCircle ? 4.5 : 4
  //   }, <shapeType>Cfg);
  // }
});

module.exports = NewShape;
