var $ = jQuery = require('./js/jquery.min.js');
var ipc = require('ipc');

$(function(){
  // コントローラーから画像URLを受け取って各チャンネルへアサインする
  ipc.on('assign-video-window', function(imageUrl, channel) {
    $('.video__channel-image-'+channel).attr('src', imageUrl);
  });

  // コントローラーからCueボタンのTapを受け取って各チャンネルの画像にCueを反映する
  ipc.on('send-cue', function(channel, now) {
    var imgSrc = $('.video__channel-image-'+channel).attr('src');
    $('.video__channel-image-'+channel).attr('src', imgSrc + '?' + now);
  });

  // コントローラーからClearボタンのTapを受け取って各チャンネルの画像をClearする
  ipc.on('send-clear', function(imageUrl, channel) {
    $('.video__channel-image-'+channel).attr('src', imageUrl);
  });

  // コントローラーからABフェーダーの値を受け取って反映させる
  ipc.on('send-ab-fader-val', function(val) {
    $('.video__channel-image-a').attr('style', 'opacity:' + (1 - val/100));
    $('.video__channel-image-b').attr('style', 'opacity:' + val/100);
  });

  // コントローラーから明暗フェーダーの値を受け取って反映させる
  ipc.on('send-bw-fader-val', function(val) {
    $('.video__channel-black').attr('style', 'opacity:' + (- val/100));
    $('.video__channel-white').attr('style', 'opacity:' + (val/100));
  });
});
