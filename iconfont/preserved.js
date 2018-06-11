const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

let config = null

try {
  config = yaml.safeLoad(
    fs.readFileSync(path.join(process.cwd(), 'preserved', 'tb-icons-order.yml'),
    'utf8')
  )
} catch(e) { }

module.exports = config
