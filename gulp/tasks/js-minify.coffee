gulp            = require 'gulp'
plumber         = require 'gulp-plumber'
replace         = require 'gulp-replace'
uglify          = require 'gulp-uglify'
config          = require '../config'
app_config      = require '../app_config'

gulp.task 'js-minify', ->
  gulp.src ["#{config.path.src.js}/**/*.js"]
    .pipe plumber()
    .pipe replace('data_tumblr_api_key', "#{app_config.data.tumblr.api_key}")
    .pipe replace('data_twitter_consumer_key', "#{app_config.data.twitter.consumer_key}")
    .pipe replace('data_twitter_consumer_secret', "#{app_config.data.twitter.consumer_secret}")
    .pipe replace('data_twitter_access_token_key', "#{app_config.data.twitter.access_token_key}")
    .pipe replace('data_twitter_access_token_secret', "#{app_config.data.twitter.access_token_secret}")
    .pipe uglify()
    .pipe gulp.dest "#{config.path.dest.js}"
