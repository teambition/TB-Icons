import { spawn } from 'child_process'
import inflection from 'inflection'
import path from 'path'
import through from 'through2'
import File from 'vinyl'

const toSlices = (s, v) => {
  const addSlice = (s, v) => {
    if (v['name'] && v['name'].length > 0) {
      const transformedNames = inflection.dasherize(v['name'])

      const names = transformedNames.split('/')

      const name = names[names.length - 1]

      const group = names.length > 1 ? names[0] : 'uncategorized'

      return s.concat({
        name: name.toLowerCase(),
        group: group.toLowerCase()
      })
    } else {
      return s
    }
  }

  return s.concat(v['slices'].reduce(addSlice, []))
}

const toGroups = (slices) => (arr, val) => {
  const hasGroup = (group) => (v) => v['name'] === group

  const hasName = (name) => (v) => v['name'] === name

  const findGroup = (groupArray, groupName) => groupArray.find(hasGroup(groupName))

  const findSlice = (name) => slices.find(hasName(name))

  const targetSlice = findSlice(val['name'])

  if (targetSlice) {
    let targetGroup = findGroup(arr, targetSlice['group'])

    if (!targetGroup) {
      targetGroup = {
        name: targetSlice['group'],
        glyphs: []
      }

      arr = arr.concat(targetGroup)
    }

    targetGroup.glyphs = targetGroup.glyphs.concat([val])
  }

  return arr
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

      const groups = glyphs.reduce(toGroups(sortedSlices), [])

      const sortedGroups = groups.sort(sortName)

      const iconfontsJson = {
        cwd: source.cwd,
        base: source.base,
        path: path.join(source.base, 'glyphs.json'),
        contents: new Buffer(JSON.stringify(sortedGroups, null, 2))
      }

      this.push(new File(iconfontsJson))

      callback()
    })
  })

}
