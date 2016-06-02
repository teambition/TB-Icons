import async from 'async'
import consolidate from 'gulp-consolidate'
import del from 'del'
import gulp from 'gulp'
import iconfont from 'gulp-iconfont'
import sequence from 'run-sequence'
import sketch from 'gulp-sketch'
import svgmin from 'gulp-svgmin'
import svgsymbols from 'gulp-svg-symbols'

gulp.task('build', (callback) => {
  return sequence('svg', 'svgsymbols', 'iconfont', callback)
})

gulp.task('iconfont', (callback) => {
  return sequence('iconfont:clean', 'iconfont:build', callback)
})

gulp.task('iconfont:clean', (callback) => {
  const files = [
    './lib/css',
    './lib/fonts',
    './lib/stylus'
  ]

  return del(files, callback)
})

gulp.task('iconfont:build', (callback) => {
  const iconfontOptions = {
    formats: ['eot', 'svg', 'ttf', 'woff', 'woff2'],
    fontName: 'tb-icons',
    timestamp: Math.round(Date.now() / 1000)
  }

  const stream = gulp.src('./lib/svgs/*.svg')
    .pipe(iconfont(iconfontOptions))

  return async.parallel([
    (next) => {
      stream.on('glyphs', (glyphs, options) => {
        const consolidateOptions = {
          glyphs: glyphs,
          fontName: options.fontName
        }

        gulp.src('./src/templates/tb-icons.css')
          .pipe(consolidate('lodash', consolidateOptions))
          .pipe(gulp.dest('./lib/css'))
          .on('finish', next)
      })
    },
    (next) => {
      stream.on('glyphs', (glyphs, options) => {
        const consolidateOptions = {
          glyphs: glyphs,
          fontName: options.fontName
        }

        gulp.src('./src/templates/tb-icons.styl')
          .pipe(consolidate('lodash', consolidateOptions))
          .pipe(gulp.dest('./lib/stylus'))
          .on('finish', next)
      })
    },
    (next) => {
      stream
        .pipe(gulp.dest('./lib/fonts'))
        .on('finish', next)
    }
  ], callback)
})

gulp.task('svg', (callback) => {
  return sequence('svg:clean', 'svg:build', callback)
})

gulp.task('svg:clean', (callback) => {
  return del(['./lib/svgs'], callback)
})

gulp.task('svg:build', () => {
  const sketchOptions = {
    export: 'slices',
    formats: 'svg',
    saveForWeb: true
  }

  const svgminOptions = {
    plugins: [
      { cleanupAttrs: true },
      { cleanupEnableBackground: true },
      { cleanupIDs: true },
      { cleanupListOfValues: true },
      { cleanupNumericValues: true },
      { collapseGroups: true },
      { convertColors: true },
      { convertPathData: true },
      { convertShapeToPath: true },
      { convertStyleToAttrs: true },
      { convertTransform: true },
      { mergePaths: true },
      { minifyStyles: true },
      { moveElemsAttrsToGroup: true },
      { moveGroupAttrsToElems: true },
      { removeAttrs: true },
      { removeComments: true },
      { removeDesc: true },
      { removeDimensions: true },
      { removeDoctype: true },
      { removeEditorsNSData: true },
      { removeEmptyAttrs: true },
      { removeEmptyContainers: true },
      { removeEmptyText: true },
      { removeHiddenElems: true },
      { removeMetadata: true },
      { removeNonInheritableGroupAttrs: true },
      { removeRasterImages: true },
      { removeStyleElement: true },
      { removeTitle: true },
      { removeUnknownsAndDefaults: true },
      { removeUnusedNS: true },
      { removeUselessDefs: true },
      { removeUselessStrokeAndFill: true },
      { removeViewBox: false },
      { removeXMLProcInst: true },
      { sortAttrs: true },
      { transformsWithOnePath: true }
    ]
  }

  return gulp.src('./src/sketch/20px.sketch')
    .pipe(sketch(sketchOptions))
    .pipe(svgmin(svgminOptions))
    .pipe(gulp.dest('./lib/svgs'))
})

gulp.task('svgsymbols', (callback) => {
  return sequence('svgsymbols:clean', 'svgsymbols:build', callback)
})

gulp.task('svgsymbols:clean', (callback) => {
  return del(['./lib/svg-symbols.svg'], callback)
})

gulp.task('svgsymbols:build', () => {
  return gulp.src('./lib/svgs/*.svg')
    .pipe(svgsymbols({
      templates: ['default-svg']
    }))
    .pipe(gulp.dest('./lib'))
})
