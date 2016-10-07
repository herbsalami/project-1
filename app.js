class Board {
  constructor() {
    this.difficulty = 0;
    this.leftEdge = $('#board').offset().left;
    this.rightEdge = $('#board').offset().left + $('#board').width();
    this.topEdge = $('#board').offset().top;
    this.bottomEdge = $('#board').offset().top + $('#board').height();
  }

}

class Player {
  constructor() {
    this.alive = true;
    this.x = $('.player').css('left');
    this.y = $('.player').css('top');
    this.element = $('.player');
  }
}

class Enemy {
  constructor() {
    this.alive = true;
    this.x = $('.enemy').css('left');
    this.y = $('.enemy').css('top');
    // this.element = $('<div class=enemy></div>');
    this.element = $('.enemy');
    // this.thing =
    this.moveEnemy();
  }
  movement() {
      var moveX = parseInt(this.x) + (Math.random() * 300 - 150);
      var moveY = parseInt(this.y) + (Math.random() * 300 - 150);
      console.log(moveX + "  " + moveY);
      // var thing = this;
    // var right = $('#board').width();
    // var top = $('#board').height();
    if ((moveX > 0 && moveX < $('#board').width()-this.element.width()) && (moveY > 0 && moveY < $('#board').height()-this.element.height())) {
      this.x = moveX;
      this.y = moveY;
      this.element.animate({
        left: moveX + "px",
        top:  moveY + "px"
      }, 500, 'swing');
    }
    // else {
    //   move();
    // }
  }

  moveEnemy() {
    var interval = Math.floor(Math.random()*500) + 50;
    setTimeout(function() {
      this.movement();
      this.moveEnemy();
    }.bind(this),interval);
  }

}

var keys = {};


$(document).keydown(function (e) {
    keys[e.which] = true;
});

$(document).keyup(function (e) {
    delete keys[e.which];

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
        movePlayer();

}

function movePlayer () {
  $('.player').animate({
          left: moveX + "px",
          top:  moveY + "px"
        }, 10, checkMovement);
    $player.x = moveX;
    $player.y = moveY;
}








$(document).mousemove(function(e){
  var boxCenter = [$($player.element).offset().left+$($player.element).width()/2, $($player.element).offset().top+$($player.element).height()/2];
var angle = Math.atan2(e.pageX- boxCenter[0],- (e.pageY- boxCenter[1]) )*(180/Math.PI);
$($player.element).css({ "-webkit-transform": 'rotate(' + angle + 'deg)'});
$($player.element).css({ '-moz-transform': 'rotate(' + angle + 'deg)'});
$($player.element).css({ 'transform': 'rotate(' + angle + 'deg)'});

});
  var $board = new Board();
  var $player = new Player();
  var $enemy = new Enemy();
  $enemy.moveEnemy();
  var moveX = parseFloat($player.x);
  var moveY = parseFloat($player.y);
  checkMovement();
// $(function () {
//   movePlayer();

// });
