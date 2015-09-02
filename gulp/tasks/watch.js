/* Notes:
   - gulp/tasks/browserSync.js watches and reloads compiled files
   */

var gulp = require('gulp')
var config = require('../config')
var watch = require('gulp-watch')

gulp.task('watch', ['browserSync'], function (callback) {
  watch(config.sass.src, function () { gulp.start('sass') })
  watch(config.images.src, function () { gulp.start('images') })
  watch(config.templates.src, function () { gulp.start('templates') })
})
