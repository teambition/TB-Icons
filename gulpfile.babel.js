import del from 'del'
import gulp from 'gulp'
import sketch from 'gulp-sketch'
import svgmin from 'gulp-svgmin'
import sequence from 'run-sequence'

gulp.task('clean', (callback) => {
  return del(['./lib'], callback)
})

gulp.task('sketch', (callback) => {
  return sequence('clean', 'sketch:svg')
})

gulp.task('sketch:svg', () => {
  let sketchOptions = {
    export: 'slices',
    formats: 'svg'
  }

  let svgminOptions = {
    plugins: [
      { cleanupEnableBackground: true },
      { cleanupAttrs: true },
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
      { removeViewBox: true },
      { removeXMLProcInst: true },
      { sortAttrs: true },
      { transformsWithOnePath: true }
    ]
  }

  return gulp.src('./src/sketch/20px.sketch')
    .pipe(sketch(sketchOptions))
    .pipe(svgmin(svgminOptions))
    .pipe(gulp.dest('./lib/svg'))
})
