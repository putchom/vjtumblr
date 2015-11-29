gulp            = require 'gulp'
plumber         = require 'gulp-plumber'
sass            = require 'gulp-sass'
minifyCss       = require 'gulp-minify-css'
config          = require '../config'

gulp.task 'sass', ->
  gulp.src ["#{config.path.src.css}/**/*.scss"]
    .pipe plumber()
    .pipe sass()
    .pipe minifyCss()
    .pipe gulp.dest "#{config.path.dest.css}"
