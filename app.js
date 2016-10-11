class Board {
  constructor() {
    this.difficulty = 0;
    this.element = $('#board');
    this.narrow = false;
  }
  leftEdge() {
      return $('#board').offset().left;
  }
    rightEdge() {
      return $('#board').offset().left + $('#board').width();
  }
    topEdge() {
      return $('#board').offset().top;
  }
    bottomEdge() {
    return $('#board').offset().top + $('#board').height();
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
    this.element.css('top', $board.bottomEdge() - 50 + "px");
    this.element.css('left', $board.leftEdge() + x + "px");
    $('#board').append(this.element);
    this.x = parseFloat(this.element.offset().left);
    this.y = parseFloat(this.element.offset().top);


    // this.element = $('<div class=enemy></div>');
    // this.thing =
    this.moveEnemy();
  }

  movement() {
      var moveX = parseInt(this.x) + (Math.random() * 300 - 150);
      var moveY = parseInt(this.y) + (Math.random() * 300 - 150);
      this.testCollision();

      // console.log(moveX + "  " + moveY);
      // var thing = this;
    // var right = $('#board').width();
    // var top = $('#board').height();
    if (moveX > $board.leftEdge() && moveY > $board.topEdge() && moveX < $board.rightEdge() && moveY < $board.bottomEdge()) {
     // ((moveX > 0 && moveX < $('#board').width()+this.element.width()) && (moveY > 0 && moveY < $('#board').height()-this.element.height())) {

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
    if(this.alive){
    var interval = Math.floor(Math.random()*500) + 50;
    console.log("moveEnemy");
    setTimeout(function() {
        this.movement();

      // if(Math.abs(parseFloat($player.hitbox[0]) - parseFloat(this.element.offset().left) + 12.5) < 25 &&  Math.abs(parseFloat($player.hitbox[1]) - parseFloat(this.element.offset().top) + 12.5) < 25) {
      //   console.log('Hit!');
      //   // alert("hit!");
      // }
      this.testCollision();
      this.moveEnemy();
    }.bind(this),interval);
    this.testCollision();
  }
  }

  testCollision() {
    var hitbox = {radius: 12.5, x: $player.hitbox[0], y: $player.hitbox[1]};
    var enemyCircle = {radius: 12.5, x: parseFloat(this.element.offset().left) + 12.5, y: parseFloat(this.element.offset().top) + 12.5};

    var dx = hitbox.x - enemyCircle.x;
    var dy = hitbox.y - enemyCircle.y;
var distance = Math.sqrt(dx * dx + dy * dy);

if (this.checkCollision($player.hitbox)) {
    // collision detected!
    this.element.remove();
    enemiesKilled++;
    $('h3').text(enemiesKilled);
    enemies.splice(enemies.indexOf(this), 1);
    this.alive = false;
    if(enemies.length < 1) {
      levelUp();
    }
}
else {
  for (var i = 0; i < $player.hurtboxes.length; i++) {
    if(this.checkCollision($player.hurtboxes[i])) {
      lose();
    }
  }
}
}
  checkCollision(box) {
    var box1 = {radius: 12.5, x: box[0], y: box[1]};
    var enemyCircle = {radius: 12.5, x: parseFloat(this.element.offset().left) + 12.5, y: parseFloat(this.element.offset().top) + 12.5};
    var dx = box1.x - enemyCircle.x;
    var dy = box1.y - enemyCircle.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < box1.radius + enemyCircle.radius;
  }

}

class PowerUp {}

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
    if($player.center[0] < $board.leftEdge() || $player.center[1] < $board.topEdge() || $player.center[0] > $board.rightEdge() || $player.center[1] > $board.bottomEdge()) {
      lose();
    }
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
    for(var i = 0; i < enemies.length; i++) {
      enemies[i].testCollision();
    }

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
  for(var i = 0; i < enemies.length; i++) {
    enemies[i].testCollision();
  }

});
  var level = 0;
  var enemies = [];
  var enemyMove = 500;
  var $board = new Board();
  var $player = new Player();
  var moveX = parseFloat($player.x);
  var moveY = parseFloat($player.y);
  var enemiesKilled = 0;
  var game = true;
  function levelUp() {
    if(game){
      level++;
      $('#hud-left > h2').text("level " + level);
      setTimeout(function() {
        for (var i = 1; i <= level; i++) {
          var $enemy = new Enemy(i * 25, i * 25);
          enemies.push($enemy);
        }
      }, 2000);
    }
  }
  function lose() {
    $('#lose').css({
      "display" : 'block',
      "margin": "auto",
      "width": "400px",
      "height": "400px",
      "background": "red",
      "font-size": "40px",
      "text-align" : "center" });
    $('.enemy').remove();
    $player.element.remove();
    game = false;
    level = 0;
  }
  levelUp();
  checkMovement();
