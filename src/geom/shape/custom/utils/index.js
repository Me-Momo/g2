const Util = require('../../../../util');
const Global = require('../../../../global');

function addPoints(from, to) {
  Util.each(from, function(subArr) {
    to.push({
      x: subArr[0],
      y: subArr[1]
    });
  });
}

function getAttrs(cfg) {
  const defaultAttrs = Global.shape.schema;
  const attrs = Util.mix(
    {},
    defaultAttrs,
    {
      stroke: cfg.color,
      strokeOpacity: cfg.opacity
    },
    cfg.style
  );
  return attrs;
}

function getLineAttrs(cfg) {
  const defaultAttrs = Global.shape.hollowArea;
  const lineAttrs = Util.mix({}, defaultAttrs, {
    stroke: cfg.color,
    lineWidth: cfg.size,
    strokeOpacity: cfg.opacity
  }, cfg.style);
  return lineAttrs;
}

function getFillAttrs(cfg) {
  const defaultAttrs = Global.shape.area;
  const areaAttrs = Util.mix({}, defaultAttrs, {
    fill: cfg.color,
    stroke: cfg.color,
    lineWidth: cfg.size,
    fillOpacity: cfg.opacity
  }, cfg.style);
  return areaAttrs;
}

module.exports = {
  getAttrs,
  addPoints,
  getLineAttrs,
  getFillAttrs
};
