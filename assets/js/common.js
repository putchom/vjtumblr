// jQueryの読み込み
var $ = jQuery = require("./js/jquery.min.js");

$(function(){
  // gulpのreplaceタスクでapp_config.coffeeに設定したnameとapi_keyが入る
  var userName = 'data_user_name',
      api_key = 'data_api_key';

  // tumblr画像の読み込み
  function loadGif (tag) {
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
      $('.resources__text').text(searchQuery);
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
      console.log('hoge');
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

  // 各チャンネルへのアサイン
  function assignChannel(channel) {
    $('.resources__items').on('click', '.resources__item-button--'+channel, function() {
      var imageUrl = $(this).parent().find('.resources__item-image').attr('src'),
          tag = $(this).parent().find('.resources__item-tags').text(),
          resArray = tag.split(","),
          ret = '';
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
  function tapCue(channel) {
    $('.channel-'+channel+'__cue-button').on('click', function() {
      var imgSrc = $('.channel-'+channel+'__image').attr('src'),
          now = new Date().getTime();
      $('.channel-'+channel+'__image, .master__image--'+channel).attr('src', imgSrc + '?' + now);
    });
  }
  tapCue('a');
  tapCue('b');

  // Clearボタンのタップ
  function tapClear(channel) {
    $('.channel-'+channel+'__clear-button').on('click', function() {
      var defaultImagePath = './assets/images/blank_image.png';
      $('.channel-'+channel+'__image').attr('src', defaultImagePath);
      $('.master__image--'+channel).attr('src', defaultImagePath);
      $(this).parent().find('.channel__tags').children().remove();
    });
  }
  tapClear('a');
  tapClear('b');

  // AB切り替えフェーダー
  $('#fader__ab').on('input', function() {
    $('.master__image--a').attr('style', 'opacity:' + (1 - $('#fader__ab').val()/100));
    $('.master__image--b').attr('style', 'opacity:' + $('#fader__ab').val()/100);
  });

  // 明暗切り替えフェーダー
  $('#fader__bw').on('input', function() {
    $('.master__black').attr('style', 'opacity:' + (- $('#fader__bw').val()/100));
    $('.master__white').attr('style', 'opacity:' + ($('#fader__bw').val()/100));
  });
});
