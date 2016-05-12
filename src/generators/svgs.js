var _                = require('lodash')
var fs               = require('fs')
var path             = require('path')
var mkdirp           = require('mkdirp')
var camel2Dash       = require('camel-2-dash')
var svgfont2svgicons = require('svgfont2svgicons')

var icons            = require('../icons')

module.exports = function () {
  var fontStream   = fs.createReadStream(path.resolve(__dirname, '../fonts/tb-icons.svg'))
  var iconProvider = svgfont2svgicons()

  var distDir      = process.cwd() + '/dist/svgs/'

  mkdirp.sync(distDir)

  // Piping the font
  fontStream.on('open', function() {
    fontStream.pipe(iconProvider)
  })

  // Saving the SVG files
  iconProvider.on('readable', function() {

    var icon, name
    do {
      icon = iconProvider.read()
      if(icon) {
        if (icon.metadata.name.indexOf('notdef') !== -1) return
        icon.metadata.name = icon.metadata.name.toLowerCase().replace('.', '').replace('oo', '00')
        _.forEach(icons, function(subIcons) {
          _.find(subIcons, function(value, key) {
            if (value === icon.metadata.name) {
              icon.metadata.name = name = camel2Dash(key)
            }
          })
        })
        if (name) icon.pipe(fs.createWriteStream(distDir + name + '.svg'))
      }
    } while(null !== icon)

  }).once('end', function() {})
}
