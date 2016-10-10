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
    this.x = parseFloat($('.player').offset().left);
    this.y = parseFloat($('.player').offset().top);
    this.element = $('.player');
    this.angle = 0;
    this.center = [$(this.element).offset().left+$(this.element).width()/2, $(this.element).offset().top+$(this.element).height()/2];
    this.hitCoordinates = [$(this.element).position().left + 25, $(this.element).position().top + 12.5];
    this.hurtCoordinates = [
      [$(this.element).position().left + 25, $(this.element).position().top + 37.5],
      [$(this.element).position().left + 25, $(this.element).position().top + 62.5],
      [$(this.element).position().left + 25, $(this.element).position().top + 87.5]];
    this.hitbox = [
      parseFloat(this.x) + parseFloat($('.player').width())/2,
      parseFloat(this.y) + parseFloat($('.player').height())/8
    ];
    this.hurtboxes = [
      [
        parseFloat(this.x) + parseFloat($('.player').width())/2,
        parseFloat(this.y) + 3 * parseFloat($('.player').height())/8
      ],
      [
        parseFloat(this.x) + parseFloat($('.player').width())/2,
        parseFloat(this.y) + 5 * parseFloat($('.player').height())/8
      ],
      [
        parseFloat(this.x) + parseFloat($('.player').width())/2,
        parseFloat(this.y) + 7 * parseFloat($('.player').height())/8
      ]
    ]
  }
}

class Enemy {
  constructor(x, y) {
    this.alive = true;
    this.element = $("<div class='enemy'></div>");
    $('#board').append(this.element);
    this.x = this.element.css('left');
    this.y = this.element.css('top');
    // this.element = $('<div class=enemy></div>');
    // this.thing =
    this.moveEnemy();
  }

  movement() {
      var moveX = parseInt(this.x) + (Math.random() * 300 - 150);
      var moveY = parseInt(this.y) + (Math.random() * 300 - 150);
      // console.log(moveX + "  " + moveY);
      // var thing = this;
    // var right = $('#board').width();
    // var top = $('#board').height();
    if ((moveX > 0 && moveX < $('#board').width()-this.element.width()) && (moveY > 0 && moveY < $('#board').height()-this.element.height())) {
      this.x = moveX;
      this.y = moveY;
      this.element.animate({
        left: moveX + "px",
        top:  moveY + "px"
      }, enemyMove, 'swing');
    }
    // else {
    //   move();
    // }
  }

  moveEnemy() {
    var interval = Math.floor(Math.random()*enemyMove) + 50;
    console.log("moveEnemy");
    setTimeout(function() {
      if(!time) {
        this.movement();
      }
      if(Math.abs(parseFloat($player.hitbox[0]) - parseFloat(this.element.offset().left) + 12.5) < 25 &&  Math.abs(parseFloat($player.hitbox[1]) - parseFloat(this.element.offset().top) + 12.5) < 25) {
        console.log('Hit!');
        // alert("hit!");
      }
      this.moveEnemy();
    }.bind(this),interval);
  }

  testCollision() {
    this.element.center =
  }

}

class PowerUp {}

var keys = {};

$(document).on('click', function() {
  time = !time;
  $('.enemy').stop(true);
});

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


function setCollisions(center, hit, hurt) {
  // $player.hitbox = updateCoordinates(center, hit);
  // for (var i = 0; i < 3; i++) {
  //   $player.hurtboxes[i] = updateCoordinates(center, hurt[i]);
    // var newCoord = updateCoordinates($player.center, [$player.hitbox[0], $player.hitbox[1]]);
    $player.hitbox = updateCoordinates($player.center, [$player.hitCoordinates[0], $player.hitCoordinates[1]]);
    for (var i = 0; i < $player.hurtCoordinates.length; i++) {
      $player.hurtboxes[i] = updateCoordinates($player.center, [$player.hurtCoordinates[i][0], $player.hurtCoordinates[i][1]]);
    }
}

function updateCoordinates(origin, point) {
  // var radianAngle = $player.angle;
  var radianAngle = ($player.angle * Math.PI) / 180;
  return [$player.center[0] + (point[0] - $player.center[0]) * Math.cos(radianAngle) - (point[1] - $player.center[1]) * Math.sin(radianAngle),
  $player.center[1] + (point[0] - $player.center[0]) * Math.sin(radianAngle) + (point[1] - $player.center[1]) * Math.cos(radianAngle)];
}

function movePlayer () {
  $('.player').animate({
          left: moveX + "px",
          top:  moveY + "px"
        }, 10, checkMovement);
    $player.x = moveX;
    $player.y = moveY;
    $player.center = [$player.x + 25, $player.y + 50];;
    $player.hitCoordinates[0] = moveX + 25;
    $player.hitCoordinates[1] = moveY + 12.5;
    for (var i = 0; i < $player.hurtCoordinates.length; i++) {
      $player.hurtCoordinates[i][0] = moveX + 25;
      $player.hurtCoordinates[i][1] = moveY + 37.5 + i * 25;
    }
    setCollisions($player.center, $player.hitCoordinates, $player.hurtCoordinates)
    var hieee = [$player.hitbox[0], $player.hitbox[1]];

    // moveCollisions();// setCollisions($player.center, $player.hitbox, $player.hurtboxes);
}

// function moveCollisions





$(document).mousemove(function(e){
  // var playerCenter = [$($player.element).offset().left+$($player.element).width()/2, $($player.element).offset().top+$($player.element).height()/2];
  var angle = Math.atan2(e.pageX- $player.center[0],- (e.pageY- $player.center[1]) )*(180/Math.PI);
  $($player.element).css({ "-webkit-transform": 'rotate(' + angle + 'deg)'});
  $($player.element).css({ '-moz-transform': 'rotate(' + angle + 'deg)'});
  $($player.element).css({ 'transform': 'rotate(' + angle + 'deg)'});
  $player.angle = angle;
  setCollisions($player.center, $player.hitCoordinates, $player.hurtboxes);

});

  var time = false;
  var enemyMove = 500;
  var $board = new Board();
  var $player = new Player();
  for (var i = 1; i < 2; i++) {
    var $enemy = new Enemy(i * 25, i * 25);
  }
  var moveX = parseFloat($player.x);
  var moveY = parseFloat($player.y);
  checkMovement();
