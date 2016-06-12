import { spawn } from 'child_process'
import File from 'vinyl'
import path from 'path'
import through from 'through2'

const toSlices = (s, v) => {
  const addSlice = (s, v) => {
    if (v['name'] && v['name'].length > 0) {
      const names = v['name'].split('/')

      const name = names[names.length - 1]

      const group = names.length > 1 ? names[0] : 'uncategorized'

      return s.concat({ name, group })
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

const sortGlyphs = (group) => {
  return {
    'name': group['name'],
    'glyphs': group['glyphs'].sort(sortName)
  }
}

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

      const groups = glyphs.reduce(toGroups(slices), [])

      const sortedGroups = groups.map(sortGlyphs).sort(sortName)

      const data = {
        cwd: source.cwd,
        base: source.base,
        path: path.join(source.base, 'codepoints.json'),
        contents: new Buffer(JSON.stringify(sortedGroups, null, 2))
      }

      this.push(new File(data))

      callback()
    })
  })

}
