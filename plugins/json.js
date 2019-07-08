import { spawn } from 'child_process'
import inflection from 'inflection'
import path from 'path'
import through from 'through2'
import File from 'vinyl'

import groupBy from 'lodash.groupby'

const toSlices = (s, v) => {
  const addSlice = (s, v) => {
    if (v['name'] && v['name'].length > 0) {
      const transformedNames = inflection.dasherize(v['name'])

      const names = transformedNames.split('/')

      const name = names[names.length - 1]

      const category = names.length > 1 ? names[0] : 'uncategorized'
      const subCategory = names.length > 2 ? names[1] : 'others'
      return s.concat({
        name: name.toLowerCase(),
        category: category.toLowerCase(),
        subCategory: subCategory.toLowerCase()
      })
    } else {
      return s
    }
  }

  return s.concat(v['slices'].reduce(addSlice, []))
}

const toGroups = (glyphs, slices) => {
  let results = []
  let glyphsMap = {}
  glyphs.forEach((item) => {
    glyphsMap[item.name] = item
  })
  const categoryGroups = groupBy(slices, (item) => {
    return item.category
  })

  const allCategory = Object.keys(categoryGroups)
  allCategory.forEach((categroupName) => {
    const icons = categoryGroups[categroupName]
    let subCate = []
    const subGroups = groupBy(icons, (item) => {
      return item.subCategory || 'others'
    })
    Object.keys(subGroups).forEach((subName) => {
      const glyphs = subGroups[subName].map((item) => {
        return glyphsMap[item.name]
      })
      subCate.push({
        subCategory: subName,
        glyphs: glyphs
      })
    })
    subCate = subCate.sort((a, b) => {
      return a['subCategory'].localeCompare(b['subCategory'])
    })
    results.push({
      category: categroupName,
      subCategory: subCate
    })
  })
  return results
}

const toSort = (a, b) => a.localeCompare(b)

const sortName = (a, b) => toSort(a['name'], b['name'])

export default function(glyphs = []) {

  return through.obj(function(source, encoding, callback) {
    if (source.isStream()) {
      throw new Error()
    }

    const args = ['list', 'slices', source.path]

    const program = spawn('sketchtool', args)

    let buffer = ''

    program.stdout.on('data', v => buffer += v.toString())

    program.stdout.on('end', () => {
      const buffers = JSON.parse(buffer)

      const slices = buffers['pages'].reduce(toSlices, [])

      const sortedSlices = slices.sort(sortName)

      const groups = toGroups(glyphs, sortedSlices)
      const sortedGroups = groups.sort((a, b) => {
        return toSort(a['category'], b['category'])
      })

      const iconfontsJson = {
        cwd: source.cwd,
        base: source.base,
        path: path.join(source.base, 'glyphs.json'),
        contents: new Buffer(JSON.stringify(sortedGroups, null, 4))
      }

      this.push(new File(iconfontsJson))

      callback()
    })
  })

}
