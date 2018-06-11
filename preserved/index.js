import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

let config = null

try {
  config = yaml.safeLoad(
    fs.readFileSync(path.join(process.cwd(), 'preserved', 'tb-icons-order.yml'),
    'utf8')
  )
} catch(e) {
  config = {
    name: 'tb-icon-preserved',
    seed: 0,
    order: {}
  }
}

export default config

