var gulp       = require('gulp')
var jade       = require('gulp-jade')
var stylus     = require('gulp-stylus')
var rimraf     = require('gulp-rimraf')
var connect    = require('gulp-connect')
var sequence   = require('gulp-sequence')
var ghPages    = require('gulp-gh-pages')

var camel2Dash = require('camel-2-dash')

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
  return gulp.src('./src/generators')
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
    .pipe(gulp.dest('_gh_pages/icons'))
})

/* ==== Watch & Serve ==== */
gulp.task('watch', function () {
  gulp.watch('src/docs/**/*', ['docs'])
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
  'docs-icons'
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
