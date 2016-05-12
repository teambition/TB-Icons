var icons      = require('../icons')
var write      = require('write')
var capitalize = require('capitalize')
var camel2Dash = require('camel-2-dash')

module.exports = function () {
  var data = "// Teambition Icons Set\n"

  data += "\n/* ==== Base Class ==== */\n" +
  "@font-face\n" +
  "  font-family: 'tb-icons'\n" +
  "  src: url(../fonts/tb-icons.eot)\n" +
  "  src: url(../fonts/tb-icons.eot?#iefix) format('embedded-opentype'), url(../fonts/tb-icons.woff) format('woff'), url(../fonts/tb-icons.ttf) format('truetype'), url(../fonts/tb-icons.svg#tb-icons) format('svg')\n"
  + "\n.icon\n" +
  "  display: inline-block\n" +
  "  font-family: 'tb-icons' !important\n" +
  "  speak: none\n" +
  "  font-style: normal\n" +
  "  font-weight: normal\n" +
  "  font-variant: normal\n" +
  "  text-transform: none\n" +
  "  -webkit-font-smoothing: antialiased\n"

  data += "\n/* ==== Icons ==== */\n"
  for (type in icons) {
    data += "\n// "+ capitalize(type) + "\n"
    for (name in icons[type]) {
      var content = icons[type][name]
      var dashName = camel2Dash(name)
      data += ".icon-" + dashName + ":before\n"
      data += "  content: '\\" + content + "'\n"
      data += "\n"
    }
  }

  write('dist/font-icons.styl', data)
}
