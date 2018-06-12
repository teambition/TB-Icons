const yaml = require('js-yaml')
const path = require('path')
const defaultSorter = require('svgicons2svgfont/src/filesorter')
const config = require('./preserved')

function overridedfileSorter(lhs, rhs) {
  const iconOrders = config.order

  const lhsOrder = iconOrders[path.parse(lhs).name] || 10000
  const rhsOrder = iconOrders[path.parse(rhs).name] || 10000

  return lhsOrder - rhsOrder
}

function getSorter() {
  if (config) {
    return overridedfileSorter
  }
  return defaultSorter
}

module.exports = getSorter()
