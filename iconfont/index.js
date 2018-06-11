const defaultSorterPath = require.resolve('svgicons2svgfont/src/filesorter')
const overridedSorterPath = require.resolve('./sorter')
const sorter = require('./sorter')

// dynamic replace filesorter to preserve the order of unicode
// important!!
require.cache[defaultSorterPath] = require.cache[overridedSorterPath]

const iconfont = require('gulp-iconfont')

module.exports = iconfont
