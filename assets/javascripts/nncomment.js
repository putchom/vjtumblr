var $ = jQuery = require('./javascripts/jquery.min.js');

$(function(){
  var dataKey = 'nncomment';
  $.fn.comment = function(message) {
    if (message == null || message == '') {
      console.warn('Requires string argument');
      return;
    }
    var data = this.data(dataKey);
    if (!data) {
      data = {
        rows: [],
      };
    }

    var comment = $('<span>', {'class': 'video__bullet'})
    .addClass('nnc-comment-custom')
    .text(message)
    .hide();
    this.append(comment);

    var cmHeight = comment.height();
    var numOfRow = Math.max(Math.floor(this.height() / cmHeight) - 1, 0);
    var time = 10000;

    var oldestLeft = this.width();
    var index = 0;
    for (var i=0; i<numOfRow; i++) {
      if (data.rows[i] != null) {
        var older = data.rows[i];
        var deltaV = (comment.width() - older.width()) / time;
        var olderT = ((older.position().left + older.width()) * time) / (this.width() + older.width());
        var deltaD = this.width() - older.position().left - older.width();
        if (deltaD < 0 || deltaV * olderT > deltaD) {
          if (older.position().left < oldestLeft) {
            oldestLeft = older.position().left;
            index = i;
          }
          continue;
        }
      }
      index = i;
      break;
    }
    data.rows[index] = comment;
    comment.css({
      'top': cmHeight * index,
      'left': this.width()
    });
    comment.show();
    var self = this;
    comment.animate({
      'left': -comment.width()-10
    }, time, 'linear', function() {
      comment.remove();
      var data = self.data(dataKey);
      if (data.rows[index] == comment) {
        data.rows[index] = null;
        self.data(dataKey, data);
      }
    });

    this.data(dataKey, data);
  }
});
