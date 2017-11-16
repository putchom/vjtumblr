var $ = jQuery = require('./javascripts/jquery.min.js');
var twitter = require('twitter');

$(function(){

  // gulpのreplaceタスクでapp_config.coffeeに設定した値が入る
  var client = new twitter({
    consumer_key:        'data_twitter_consumer_key',
    consumer_secret:     'data_twitter_consumer_secret',
    access_token_key:    'data_twitter_access_token_key',
    access_token_secret: 'data_twitter_access_token_secret',
  });
  var currentTwitterStream = null;

  $('.js-comment-submit-button').on('click', function() {
    $('.js-comment-stream').empty();
    stopTweetStream();
    var hashtag = $('.js-comment-textfield').val();
    var search_query = hashtag;
    getTweetHistory(search_query);
    getTweetStream(search_query);
  });

  // 過去のツイートを取得する
  function getTweetHistory(search_query) {
    client.get('search/tweets', {q: search_query}, function(error, tweets, response) {
      $.each(tweets.statuses, function(i, tweet) {
        var random_color = '#'+Math.floor(Math.random()*16777215).toString(16);
        var comment = '<tr><th style="color:'+ random_color +';">@' + tweet.user.screen_name + ': </th><td>' + tweet.text + '</td></tr>';
        $('.js-comment-stream').prepend(comment);
      });
    });
  }

  // ツイートをリアルタイムに取得する
  function getTweetStream(search_query) {
    client.stream('statuses/filter', {track: search_query},  function(stream) {
      stream.on('data', function(tweet) {
        var random_color = '#'+Math.floor(Math.random()*16777215).toString(16);
        var comment = '<tr><th style="color:'+ random_color +';">@' + tweet.user.screen_name + ': </th><td>' + tweet.text + '</td></tr>';
        $('.js-comment-stream').prepend(comment);
      });

      stream.on('error', function(error) {
        var random_color = '#'+Math.floor(Math.random()*16777215).toString(16);
        $('.js-comment-stream').prepend('<tr><th style="color:'+ random_color +';">@vjtumblr: </th><td style="color: red;">' + error + '</td></tr>');
      });

      currentTwitterStream = stream;
    });
  }

  // ツイートのリアルタイム取得を止める
  function stopTweetStream() {
    if(currentTwitterStream) {
      currentTwitterStream.destroy();
      currentTwitterStream = null;
    }
  }

});
