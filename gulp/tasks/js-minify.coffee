gulp            = require 'gulp'
plumber         = require 'gulp-plumber'
replace         = require 'gulp-replace'
concat          = require 'gulp-concat'
uglify          = require 'gulp-uglify'
config          = require '../config'
app_config      = require '../app_config'

gulp.task 'js-minify', ->
  gulp.src ["#{config.path.src.js}/**/*.js"]
    .pipe plumber()
    .pipe concat('app.js')
    .pipe replace('data_user_name', "#{app_config.data.user_name}")
    .pipe replace('data_api_key', "#{app_config.data.api_key}")
    .pipe gulp.dest "#{config.path.dest.js}"
