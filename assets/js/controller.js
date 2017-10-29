// jQueryの読み込み
var $ = jQuery = require('./js/jquery.min.js');
var ipc = require('ipc');

$(function(){

  if(localStorage.getItem('accountName') == null) {

    $('.js-login-form').removeClass('u-hide');
    $('.js-login-button').on('click', function() {
      var accountName = $('.js-login-textarea').val();
      localStorage.setItem('accountName', accountName);
      console.log(localStorage.getItem('accountName'));
      location.reload();
    });

  } else {

    $('.js-controller').removeClass('u-hide');

    // gulpのreplaceタスクでapp_config.coffeeに設定したapi_keyが入る
    var userName = localStorage.getItem('accountName'),
        api_key = 'data_api_key';

    // tumblr画像の読み込み
    function loadGif(tag) {
      url = userName+'.tumblr.com';
      key = api_key;
      $.getJSON('http://api.tumblr.com/v2/blog/'+url+'/posts?api_key='+key+'&jsonp=?&tag='+tag, function(data){
        $.each(data, function(index, val) {
          $.each(val, function(k_post, v_post) {
            if(k_post == 'posts'){
              for(var kp in v_post){
                var type = v_post[kp].type;
                var tags = v_post[kp].tags;
                if(type == 'photo'){
                  $.each(v_post[kp].photos, function(k_photo, v_photo) {
                    $.each(v_photo, function(k,v) {
                      if(k == 'original_size'){
                        for(var n in v){
                          if(n == 'url'){
                            var image = v[n];
                            $('.resources__items').append('<div class="resources__item c-aspect-ratio c-aspect-ratio__16-9"><div class="c-aspect-ratio__inner"><span class="resources__item-button resources__item-button--a"><span class="resources__item-button-inner">A</span></span><span class="resources__item-button resources__item-button--b"><span class="resources__item-button-inner">B</span></span><img src="'+image+'" class="resources__item-image"><span class="resources__item-tags">'+tags+'</span></div></div>');
                          }
                        }
                      }
                    });
                  });
                }
              }
            }
          });
        });
      });
    }

    // タグの読み込み
    var myTumblrPosts = new TumblrPosts();
    myTumblrPosts.config({
      domain : userName+'.tumblr.com',
      maxNum : 1000
    });
    myTumblrPosts.on('complete', function(){
      var $ul, tags;
      tags = this.getTags();
      $ul = $('<ul class="tags__items">');
      $.each(tags, function(i, tag){
        $ul.append(
          $('<li class="tags__item">').text(tag.name)
        );
      });
      $ul.appendTo( $('.tags__items-wrap') );
      $('.tags__items-loading').remove();
      searchTag();
    });
    myTumblrPosts.run();

    // タグクリックでGifを読み込み
    function tagClick(tagParent, tag, type) {
      $(tagParent).on('click', tag, function() {
        var searchQuery = $(this).text();
        $('.tags__items').find('.tags__item').removeClass('tags__item--active');
        if(type === 'list') {
          $(this).addClass('tags__item--active');
        }
        $('.resources__items').empty();
        $('.resources__description').text(searchQuery);
        loadGif(searchQuery);
      });
    }
    tagClick('.tags__items-wrap', '.tags__item', 'list');
    tagClick('.channel__tags', '.channel__tag', 'recommend');

    // タグの絞込み
    function searchTag() {
      var input = $('.tags__input-search'),
          words = $('.tags__items li'),
          timeout_id = null;

      input.on('keyup', function(){
        if(timeout_id) clearTimeout(timeout_id);
        timeout_id = setTimeout(function(){
          timeout_id = null;
          try {
            var word_re = new RegExp(input.val(), "i");
            words.each(function(){
              var display = (this.innerHTML.match(word_re) ? "block" : "none");
              if(this.style.display !== display){
                this.style.display = display;
              }
            });
          }catch(e){}
        }, 300);
      });
    }

    // 各チャンネルへのアサインとvideoWindowへのアサイン
    function assignVideoWindow(imageUrl, channel) {
      ipc.send('assign-video-window', imageUrl, channel);
    }
    function assignChannel(channel) {
      $('.resources__items').on('click', '.resources__item-button--'+channel, function() {
        var imageUrl = $(this).parent().find('.resources__item-image').attr('src'),
            tag = $(this).parent().find('.resources__item-tags').text(),
            resArray = tag.split(","),
            ret = '';
        assignVideoWindow(imageUrl, channel);
        $('.channel-'+channel+'__image').attr('src', imageUrl);
        $('.master__image--'+channel).attr('src', imageUrl);
        for( var i=0 ; i<resArray.length ; i++ ) {
          ret += '<span class="channel__tag">' + resArray[i] + "</span>";
        }
        $('.channel-'+channel+'__tags').html(ret);
      });
    }
    assignChannel('a');
    assignChannel('b');

    // Cueボタンのタップ
    function sendCue(channel, now) {
      ipc.send('send-cue', channel, now);
    }
    function tapCue(channel) {
      $('.channel-'+channel+'__cue-button').on('click', function() {
        var imgSrc = $('.channel-'+channel+'__image').attr('src'),
            now = new Date().getTime();
        $('.channel-'+channel+'__image, .master__image--'+channel).attr('src', imgSrc + '?' + now);
        sendCue(channel, now);
      });
    }
    tapCue('a');
    tapCue('b');

    // Clearボタンのタップ
    function sendClear(imageUrl, channel) {
      ipc.send('send-clear', imageUrl, channel);
    }
    function tapClear(channel) {
      $('.channel-'+channel+'__clear-button').on('click', function() {
        var defaultImagePath = './assets/images/blank_image.svg';
        $('.channel-'+channel+'__image').attr('src', defaultImagePath);
        $('.master__image--'+channel).attr('src', defaultImagePath);
        $(this).parent().find('.channel__tags').children().remove();
        sendClear(defaultImagePath, channel);
      });
    }
    tapClear('a');
    tapClear('b');

    // AB切り替えフェーダー
    function sendFaderABVal(val) {
      ipc.send('send-ab-fader-val', val);
    }
    $('#fader__ab').on('input', function() {
      var faderABVal = $('#fader__ab').val();
      $('.master__image--a').attr('style', 'opacity:' + (1 - faderABVal/100));
      $('.master__image--b').attr('style', 'opacity:' + faderABVal/100);
      sendFaderABVal(faderABVal);
    });

    // 明暗切り替えフェーダー
    function sendFaderBWVal(val) {
      ipc.send('send-bw-fader-val', val);
    }
    $('#fader__bw').on('input', function() {
      var faderBWVal = $('#fader__bw').val();
      $('.master__black').attr('style', 'opacity:' + (- faderBWVal/100));
      $('.master__white').attr('style', 'opacity:' + (faderBWVal/100));
      sendFaderBWVal(faderBWVal);
    });

    // タブ切り替え
    $('.c-tab__button').on('click', function() {
      $('.resources__image, .resources__text').hide();
      $('.c-tab__button').removeClass('c-tab__button--active');
      $(this).addClass('c-tab__button--active');
      $($(this).attr('href')).fadeToggle();
    });

    // Text情報を更新する
    function refreshText(target) {
      var textResource = $('.resources__text-input-text').val();
      target.text(textResource);
    }
    function refreshTextFont(target) {
      var textFontClass = 'c-fonts-' + $('#resources__text-font').val();
      target.removeClass( function(index, className) {
        return (className.match(/\bc-fonts-\S+/g) || []).join(' ');
      }).addClass(textFontClass);
    }
    function refreshTextColor(target) {
      var textColorClass = 'color-' + $('#resources__text-color').val() + '-500';
      target.removeClass( function(index, className) {
        return (className.match(/\bcolor-\S+/g) || []).join(' ');
      }).addClass(textColorClass);
    }
    function sendTextInfo() {
      var textResource = $('.resources__text-input-text').val(),
          textFontClass = 'c-fonts-' + $('#resources__text-font').val(),
          textColorClass = 'color-' + $('#resources__text-color').val() + '-500';
      ipc.send('send-text', textResource, textFontClass, textColorClass);
    }
    function saveButtonRefresh(buttonClass) {
      var $saveButton = $('.resources__text-save-button'),
          $checkIcon = '<i class="material-icons">done</i>';
      $saveButton.removeClass( function(index, className) {
        return (className.match(/\bc-button--\S+/g) || []).join(' ');
      });
      if(buttonClass === 'save') {
        $saveButton.addClass('c-button--secondary').html($checkIcon + 'Saved');
      } else if(buttonClass === 'modify') {
        $saveButton.addClass('c-button--primary').html('Save');
      }
    }
    function realTimeRefresh(trigger, method, func) {
      $('.resources__items-wrap').on(method, trigger, function() {
        var $previewText = $('.resources__text-preview-text');
        saveButtonRefresh('modify');
        func($previewText);
      });
    }

    // Saveボタンクリックで各情報を更新する
    $('.resources__items-wrap').on('click', '.resources__text-save-button', function() {
      var $masterText = $('.master__text-inner');
      saveButtonRefresh('save');
      refreshText($masterText);
      refreshTextFont($masterText);
      refreshTextColor($masterText);
      sendTextInfo();
    });

    // Textを更新したときにPreviewをリアルタイムに更新する
    realTimeRefresh('.resources__text-input-text', 'keyup', refreshText);

    // Textのフォントを更新したときにPreviewをリアルタイムに更新する
    realTimeRefresh('#resources__text-font', 'change', refreshTextFont);

    // Textの色を更新したときにPreviewをリアルタイムに更新する
    realTimeRefresh('#resources__text-color', 'change', refreshTextColor);

    // TextのOpacity
    $('.resources__items-wrap').on('input', '#fader__text-opacity', function() {
      var faderTextOpacityVal = $('#fader__text-opacity').val();
      $('.master__text').attr('style', 'opacity:' + (faderTextOpacityVal/100));
      ipc.send('send-text-opacity', faderTextOpacityVal);
    });
  }

  $('.js-logout-button').on('click', function() {
    localStorage.clear();
    location.reload();
  });
});
