var $ = jQuery = require('./js/jquery.min.js');
var ipc = require('ipc');

$(function(){
  // コントローラーから画像URLを受け取って各チャンネルへアサインする
  ipc.on('assign-video-window', function(imageUrl, channel) {
    $('.video__channel-image-'+channel).attr('src', imageUrl);
  });

  // コントローラーからフェーダーの値を受け取って反映させる
  ipc.on('send-ab-fader-val', function(val) {
    $('.video__channel-image-a').attr('style', 'opacity:' + (1 - val/100));
    $('.video__channel-image-b').attr('style', 'opacity:' + val/100);
  });
});
