import { spawn } from 'child_process'
import del from 'del'
import fs from 'fs'
import dir from 'node-dir'
import path from 'path'
import through from 'through2'
import File from 'vinyl'

// Cache path
const cachePath = path.join(__dirname, '../.sketch')

export default function(options = {}) {
  let args = []

  if (options.export) {
    args = args.concat('export', options.export)
  }

  if (options.formats) {
    args = args.concat(`--formats=${options.formats}`)
  }

  return through.obj(function(source, encoding, callback) {
    if (source.isStream()) {
      throw new Error()
    }

    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath)
    }

    args = args.concat('--output=' + cachePath, source.path)

    const program = spawn('sketchtool', args)

    if (options.verbose) {
      program.stdout.on('data', (v) => console.info(v.toString()))
    }

    program.stdout.on('end', () => {

      dir.files(cachePath, (error, files) => {
        if (error) {
          throw new Error(error)
        }

        files.forEach((v) => {
          const data = {
            cwd: source.cwd,
            base: source.base,
            path: path.join(source.base, path.basename(v)),
            contents: fs.readFileSync(v)
          }

          this.push(new File(data))
        })

        del.sync(cachePath)
        callback()
      })
    })
  })
}
