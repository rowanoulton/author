var gulp = require('gulp')
var minifyHTML = require('gulp-minify-html')
var browserSync = require('browser-sync')
var config = require('../config').templates

gulp.task('templates', function () {
  return gulp.src(config.src)
    .pipe(minifyHTML())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream: true}))
})
