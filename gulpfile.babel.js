import consolidate from 'gulp-consolidate'
import del from 'del'
import gulp from 'gulp'
import iconfont from 'gulp-iconfont'
import merge from 'merge-stream'
import rename from 'gulp-rename'
import sequence from 'run-sequence'
import svgmin from 'gulp-svgmin'
import svgsymbols from 'gulp-svg-symbols'

import * as config from './plugins/config'

import json from './plugins/json'
import sketch from './plugins/sketch'

gulp.task('build', (callback) => {
  sequence(
    'clean',
    'svg',
    ['iconfont', 'svgsymbols'],
    callback
  )
})

gulp.task('clean', (callback) => {
  return del(['./lib/**/*'])
})

gulp.task('iconfont', () => {
  const toObject = (glyph) => {
    return {
      name: glyph.name,
      unicode: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
    }
  }

  return gulp.src('./src/sketch/20px.sketch')
    .pipe(sketch(config.SKETCH))
    .pipe(iconfont(config.ICONFONTS))
    .on('glyphs', (glyphs, options) => {
      const data = {
        glyphs: glyphs.map(toObject),
        fontName: options.fontName
      }

      // Generate glyphs json
      const jsonStream = gulp.src('./src/sketch/20px.sketch')
        .pipe(json(data.glyphs))
        .pipe(gulp.dest('./lib'))

      // Convert css template
      const cssStream = gulp.src('./src/templates/tb-icons.css')
        .pipe(consolidate('lodash', data))
        .pipe(gulp.dest('./lib'))

      // Convert stylus template
      const stylusStream = gulp.src('./src/templates/tb-icons.styl')
        .pipe(consolidate('lodash', data))
        .pipe(gulp.dest('./lib'))

      return merge(jsonStream, cssStream, stylusStream)
    })
    .pipe(gulp.dest('./lib/fonts'))
})

gulp.task('svg', () => {
  return gulp.src('./src/sketch/20px.sketch')
    .pipe(sketch(config.SKETCH))
    .pipe(svgmin(config.SKETCH_SVGMIN))
    .pipe(gulp.dest('./lib/svgs'))
})

gulp.task('svgsymbols', () => {
  return gulp.src('./lib/svgs/*.svg')
    .pipe(svgsymbols(config.SVGSYMBOLS))
    .pipe(svgmin(config.SVGSYMBOLS_SVGMIN))
    .pipe(rename('svg-symbols.svg'))
    .pipe(gulp.dest('./lib'))
})
