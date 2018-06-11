import consolidate from 'gulp-consolidate'
import del from 'del'
import request from 'request'
import gulp from 'gulp'
import download from 'gulp-download'
import merge from 'merge-stream'
import rename from 'gulp-rename'
import sequence from 'run-sequence'
import svgmin from 'gulp-svgmin'
import svgsymbols from 'gulp-svg-symbols'
import ghPages from 'gulp-gh-pages'
import through2 from 'through2'
import iconfont from 'gulp-iconfont'

import * as config from './plugins/config'

import json from './plugins/json'
import sketch from './plugins/sketch'
import preserved from './preserved'

let seed = parseInt(preserved.seed, 10)

gulp.task('default', (callback) => {
  sequence(
    'clean',
    'build',
    callback
  )
})

gulp.task('build', (callback) => {
  sequence(
    'svg',
    'iconfont',
    'svgmin',
    'svgsymbols',
    callback
  )
})

gulp.task('publish', (callback) => {
  // TODO
})

gulp.task('dev', ['build'], () => {
  return gulp.watch('./src/sketch/20px.sketch', ['build'])
})

gulp.task('deploy', () => {
  return gulp.src('./build/**/*')
    .pipe(ghPages())
})

gulp.task('clean', (callback) => {
  return del(['./lib/**/*', './.tmp'])
})

gulp.task('download', () => {
  if (!process.env.TB_COOKIE) {
    throw new Error('Download failed, TB_COOKIE is undefined.\n Please run: export TB_COOKIE="Your Teambition cookie"')
  }
  return request
    .get({
      url: 'https://www.teambition.com/api/works/577338e42873fdc76c6c2ad1',
      headers: {
        cookie: process.env.TB_COOKIE
      }
    }, (err, resp, body) => {
      const url = JSON.parse(body).downloadUrl
      return download(url)
        .pipe(rename('20px.sketch'))
        .pipe(gulp.dest('./src/sketch/'))
    })
})

const forkSvgs = () => {
  return rename((path) => {
    const name = path.basename
    const order = `${preserved.order[name] || (++seed)}`
    const prefix = Array.from({ length: 5 - order.length }, () => 0).join('')
    path.basename = `${prefix}${order}#${name}`
  })
}

gulp.task('iconfont', () => {
  const toObject = (glyph) => {
    const [order, name] = glyph.name.split('#')

    return {
      name: name,
      unicode: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase(),
      order: parseInt(order, 10)
    }
  }

  return gulp.src('./lib/svgs/*.svg')
    .pipe(forkSvgs())
    .pipe(gulp.dest('./.tmp'))
    .pipe(iconfont(config.ICONFONTS))
    .on('glyphs', (glyphs, options) => {
      const data = {
        glyphs: glyphs.map(toObject),
        fontName: options.fontName,
        seed: seed
      }

      // Generate glyphs json
      const jsonStream = gulp.src('./src/sketch/20px.sketch')
        .pipe(json(data.glyphs))
        .pipe(gulp.dest('./src/gh-pages'))

      // Convert css template
      const cssStream = gulp.src('./src/templates/tb-icons.css')
        .pipe(consolidate('lodash', data))
        .pipe(gulp.dest('./lib/styles'))

      // Convert stylus template
      const stylusStream = gulp.src('./src/templates/tb-icons.styl')
        .pipe(consolidate('lodash', data))
        .pipe(gulp.dest('./lib/styles'))

      const cacheStream = gulp.src('./src/templates/tb-icons-order.yml')
        .pipe(consolidate('lodash', data))
        .pipe(gulp.dest('./preserved'))

      return merge(jsonStream, cssStream, stylusStream, cacheStream)
    })
    .pipe(gulp.dest('./lib/fonts'))
    .pipe(through2.obj((chunk, enc, callback) => {
      del.sync('./.tmp')
      callback()
    }))
})

gulp.task('svg', () => {
  return gulp.src('./src/sketch/20px.sketch')
    .pipe(sketch(config.SKETCH))
    .pipe(gulp.dest('./lib/svgs'))
})

gulp.task('svgmin', () => {
  return gulp.src('./lib/svgs/*.svg')
    .pipe(svgmin(config.svgoConfig()))
    .pipe(gulp.dest('./lib/svgs'))
})

gulp.task('svgsymbols', () => {
  return gulp.src('./lib/svgs/*.svg')
    .pipe(svgsymbols(config.SVGSYMBOLS))
    .pipe(svgmin(config.svgoConfig(false)))
    .pipe(rename('svg-symbols.svg'))
    .pipe(gulp.dest('./lib'))
})

