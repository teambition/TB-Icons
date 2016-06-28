var path = require('path')
var ghpages = require('gh-pages')

const basePath = path.join(__dirname, '../build')

ghpages.publish(basePath, {
  add: true,
  branch: 'gh-pages',
  remote: 'origin',
  message: 'Update' + ' ' + new Date().toISOString()
})
