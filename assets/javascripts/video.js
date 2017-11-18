var $ = jQuery = require('./javascripts/jquery.min.js');
var ipc = require('ipc');

$(function(){
  // ウィンドウ読み込み時とリサイズが終わったタイミングでvideoWindowの画像を真ん中に寄せる
  function centeringVideo() {
    var $videoChannel = $('.video__channel'),
        windowHeight = $(window).height(),
        videoChannelHeight = $videoChannel.height(),
        LetterBoxMargin = (windowHeight - videoChannelHeight)/2;
    $videoChannel.attr('style', 'top:'+LetterBoxMargin+'px');
  }
  centeringVideo();
  var timer = false;
  $(window).resize(function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      centeringVideo();
    }, 200);
  });

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

  // コントローラーからTextを受け取って反映させる
  ipc.on('send-text', function(textResources, textFontClass, textColorClass) {
    var $videoChannelTextOutput = $('.video__channel-text-output');
    $videoChannelTextOutput.removeClass( function(index, className) {
      return (className.match(/\bc-fonts-\S+/g) || []).join(' ');
    });
    $videoChannelTextOutput.removeClass( function(index, className) {
      return (className.match(/\bcolor-\S+/g) || []).join(' ');
    });
    $videoChannelTextOutput.text(textResources).addClass(textFontClass).addClass(textColorClass);
  });

  // コントローラーからTextのOpacityの値を受け取って反映させる
  ipc.on('send-text-opacity', function(textOpacity) {
    $('.video__channel-text-output').attr('style', 'opacity:' + (textOpacity/100));
  });

  // コントローラーからコメントを受け取って反映させる
  ipc.on('send-bullet', function(bullet) {
    $('.js-video-bullet').comment(bullet);
  });

  // コントローラーからコメントのOpacityの値を受け取って反映させる
  ipc.on('send-comment-opacity', function(commentOpacity) {
    $('.js-video-bullet').attr('style', 'opacity:' + (commentOpacity/100));
  });
});
