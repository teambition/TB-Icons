var path       = require('path')
var gulp       = require('gulp')
var wait       = require('gulp-wait')
var jade       = require('gulp-jade')
var stylus     = require('gulp-stylus')
var rimraf     = require('gulp-rimraf')
var connect    = require('gulp-connect')
var sequence   = require('gulp-sequence')
var ghPages    = require('gulp-gh-pages')
var camel2Dash = require('camel-2-dash')
var svgSymbols = require('gulp-svg-symbols')

var svgo       = require('./src/tools/gulp-svgo')
var SVGOConfig = require('./svgo.config.json')

var icons      = require('./src/icons')
var generators = require('./src/generators')

/* ==== Functions ==== */
var objectKeysC2D = function(object) {
  var convertedObject = JSON.parse(
    camel2Dash(JSON.stringify(object))
  )
  return convertedObject
}

/* ==== Tasks ==== */
gulp.task('clean', function () {
  return gulp.src(['_gh_pages', 'dist'], {read: false})
    .pipe(rimraf({
      force: true
    }))
})

gulp.task('generator', function () {
  for (key in generators) {
    task = generators[key]
    task()
  }
  return gulp.src('').pipe(wait(1000))
})

gulp.task('svg-optimize', function () {
  return gulp.src('dist/svgs/*.svg')
    .pipe(svgo(SVGOConfig))
    .pipe(gulp.dest('dist/svgs'))
})

gulp.task('svg-sprites', function () {
  return gulp.src('dist/svgs/*.svg')
    .pipe(svgSymbols({
      "templates":  ['default-svg', path.join(__dirname, 'src/docs/svg-symbols/index.html')]
    }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('styl-to-css', function () {
  return gulp.src('dist/*.styl')
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules']
    }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('move-fonts', function () {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/'))
})

gulp.task('docs-jade', function () {
  gulp.src('src/docs/**/*.jade')
    .pipe(jade({
      locals: {
        icons: objectKeysC2D(icons)
      },
      pretty: true
    }))
    .pipe(gulp.dest('_gh_pages/'))
    .pipe(connect.reload())
})

gulp.task('docs-svg-symbols', function () {
   gulp.src(['dist/svg-symbols.svg'])
    .pipe(gulp.dest('_gh_pages/svg-symbols/'))
   gulp.src(['dist/index.html'])
    .pipe(rimraf({
      force: true
    }))
    .pipe(gulp.dest('_gh_pages/svg-symbols/'))
    .pipe(connect.reload())
})

gulp.task('docs-style', function () {
  gulp.src('src/docs/*.styl')
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules']
    }))
    .pipe(gulp.dest('_gh_pages/'))
    .pipe(connect.reload())
})

gulp.task('docs-script', function () {
  gulp.src('src/docs/*.js')
    .pipe(gulp.dest('_gh_pages/'))
    .pipe(connect.reload())
})

gulp.task('docs-fonts', function () {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('_gh_pages/fonts/'))
})

gulp.task('docs-icons', function () {
  gulp.src('dist/*.css')
    .pipe(gulp.dest('_gh_pages/icons/'))
})

/* ==== Watch & Serve ==== */
gulp.task('watch', function () {
  gulp.watch('src/docs/**/*', function(){
    sequence('svg-sprites', 'docs')(function(){})
  })
})

gulp.task('serve', ['watch'], function () {
  connect.server({
    root: '_gh_pages',
    port: 8001,
    livereload: true
  });
})

/* ==== Deploy ==== */
gulp.task('deploy', function() {
  gulp.src('_gh_pages/**/*')
    .pipe(ghPages())
})

/* ==== Task Quences ==== */
gulp.task('dev', function(callback) {
  sequence(
  'generator',
  'svg-optimize',
  'svg-sprites',
  'styl-to-css',
  'move-fonts'
  )(callback)
})

gulp.task('docs', function(callback) {
  sequence(
  'docs-jade',
  'docs-style',
  'docs-script',
  'docs-fonts',
  'docs-icons',
  'docs-svg-symbols'
  )(callback)
})

gulp.task('build', function(callback) {
  sequence(
  'clean',
  'dev',
  'docs'
  )(callback)
})

gulp.task('default', ['build'])
