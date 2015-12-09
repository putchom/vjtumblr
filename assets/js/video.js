var $ = jQuery = require('./js/jquery.min.js');
var ipc = require('ipc');

$(function(){
  ipc.on('assign-video-window', function(imageUrl, channel) {
    $('.video__channel-image-'+channel).attr('src', imageUrl);
  });
});
