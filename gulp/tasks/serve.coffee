gulp            = require 'gulp'
config          = require '../config'

gulp.task 'watch', ->
  gulp.start 'sass'
  gulp.start 'js-minify'
  gulp.watch "#{config.path.src.css}/**/*.scss", ['sass']
  gulp.watch "#{config.path.src.js}/**/*.js", ['js-minify']
