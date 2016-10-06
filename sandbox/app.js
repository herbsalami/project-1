$ball = $('#area');
var docHeight = parseInt($('body').css('height')) - 100;
var docWidth = parseInt($('body').css('width')) - 100;

// $(document).on('mousemove', function(e){
//     $('.circle').css({
//        left: -50 + e.pageX,
//        top:  -50 + e.pageY
//     });
//     $('.blur').animate({
//       left: -50 + e.pageX,
//       top:  -50 + e.pageY
//     }, 15, 'swing');
// });
$(document).on('mousemove', function(e){
    $('.circle').css({
       left: -50 + e.pageX,
       top:  -50 + e.pageY
    });
});

function randomMoveSun () {
      var moveX = parseInt($('.blur').css('left')) + (Math.random() * 500 - 250);
      var moveY = parseInt($('.blur').css('top')) + (Math.random() * 500 - 250);
      if ((moveX > 0 && moveX < docWidth) && (moveY > 0 && moveY < docHeight)) {
        $('.blur').animate({
          left: moveX + "px",
          top:  moveY + "px"
        }, 200, 'swing', randomMoveSun);
      }
      else {
        randomMoveSun();
      }
}

randomMoveSun();

var keys = {};

$(document).keydown(function (e) {
    keys[e.which] = true;
});

$(document).keyup(function (e) {
    delete keys[e.which];
});
