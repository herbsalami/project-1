class Board {
  constructor() {
    this.difficulty = 0;
    this.leftEdge = $('#board').offset().left;
    this.rightEdge = $('#board').offset().left + $('#board').offset().width;
    this.topEdge = $('#board').offset().top;
    this.bottomEdge = $('#board').offset().top + $('#board').offset().height;
  }

}

class Player {
  constructor() {
    this.alive = true;
    this.x = $('.player').css('left');
    this.y = $('.player').css('top');
  }
}

var keys = {};
var keyPressed = false;


$(document).keydown(function (e) {
    keys[e.which] = true;
    // keyPressed = true;
});

$(document).keyup(function (e) {
    delete keys[e.which];
    // keyPressed = false;
});
function checkMovement () {
      if (keys[87]) {
        moveY -= 10;
      }
      if (keys[65]) {
        moveX -= 10;
      }
      if (keys[83]) {
        moveY += 10;
      }
      if (keys[68]) {
        moveX += 10;
      }
      // debugger
      // if (keyPressed) {
        movePlayer();
      // }
      // else {
      //   checkMovement(moveX, moveY);
      // }
}

function movePlayer () {
  $('.player').animate({
          left: moveX + "px",
          top:  moveY + "px"
        }, 10, checkMovement);
    $player.x = moveX;
    $player.y = moveY;
}






var box = $(".player");
var boxCenter = [$(box).offset().left+$(box).width()/2, $(box).offset().top+$(box).height()/2];

$(document).mousemove(function(e){
var angle = Math.atan2(e.pageX- boxCenter[0],- (e.pageY- boxCenter[1]) )*(180/Math.PI);
$(box).css({ "-webkit-transform": 'rotate(' + angle + 'deg)'});
$(box).css({ '-moz-transform': 'rotate(' + angle + 'deg)'});
$(box).css({ 'transform': 'rotate(' + angle + 'deg)'});

});
  var $board = new Board();
  var $player = new Player();
  var moveX = parseFloat($player.x);
  var moveY = parseFloat($player.y);
// $(function () {
//   movePlayer();

// });
