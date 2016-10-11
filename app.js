//board class, with methods to easily get the current positions of its edges in case the window size changes

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

// player class, with information about its positioning to help realign hitboxes and hurtboxes according
// to its movements and rotations
class Player {
  constructor() {
    this.alive = true;
    this.x = parseFloat($('.player').offset().left);
    this.y = parseFloat($('.player').offset().top);
    this.element = $('.player');
    this.angle = 0;
    this.center = [
      $(this.element).offset().left+$(this.element).width()/2,
      $(this.element).offset().top+$(this.element).height()/2
      ];
    this.hitCoordinates = [$(this.element).position().left + 25, $(this.element).position().top + 12.5];
    this.hurtCoordinates = [
      [
        $(this.element).position().left + 25,
        $(this.element).position().top + 37.5
      ],
      [
        $(this.element).position().left + 25,
        $(this.element).position().top + 62.5
      ],
      [
      $(this.element).position().left + 25,
      $(this.element).position().top + 87.5
      ]
    ];
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

// enemy class, with factory methods for movement and detection methods to see if
// a given instance is touching a hitbox or hurtbox
class Enemy {
  constructor(x, y) {
    this.alive = true;
    this.element = $("<div class='enemy'></div>");
    this.element.css('top', $board.bottomEdge() - 50 + "px");
    this.element.css('left', $board.leftEdge() + x + "px");
    $('#board').append(this.element);
    this.x = parseFloat(this.element.offset().left);
    this.y = parseFloat(this.element.offset().top);
    this.moveEnemy();
  }
// randomly increment movement, unless the movement would project it outside of the board, in which case
// we try a new movement
  movement() {
    var moveX = parseInt(this.x) + (Math.random() * 300 - 150);
    var moveY = parseInt(this.y) + (Math.random() * 300 - 150);
    this.testCollision();
    if (moveX > $board.leftEdge() && moveY > $board.topEdge() && moveX < $board.rightEdge() && moveY < $board.bottomEdge()) {
      this.x = moveX;
      this.y = moveY;
      this.element.animate({
        left: moveX + "px",
        top:  moveY + "px"
      }, enemyMove, 'swing');
    }
  }
  // slightly randomize the movement interval and check for collisions
  moveEnemy() {
    if(this.alive){
      var interval = Math.floor(Math.random()*enemyMove) + 50;
      console.log("moveEnemy");
      setTimeout(function() {
        this.movement();
        this.testCollision();
        this.moveEnemy();
  // the following line of code was dedicated to Trevor by Bobby
      }.bind(this),interval);
  // thank you
      this.testCollision();
    }
  }
  // test for collisions. I found a helpful way to detect collisions with circles at
  // http://jsfiddle.net/gQ3hD/2/
  testCollision() {
    var hitbox = {radius: 12.5, x: $player.hitbox[0], y: $player.hitbox[1]};
    var enemyCircle = {radius: 12.5, x: parseFloat(this.element.offset().left) + 12.5, y: parseFloat(this.element.offset().top) + 12.5};
    var dx = hitbox.x - enemyCircle.x;
    var dy = hitbox.y - enemyCircle.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (this.checkCollision($player.hitbox)) {
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

  // the method responsible for taking the various hit & hurtboxes of the player and comparing them
  // to the center of a given enemy
  checkCollision(box) {
    var box1 = {radius: 12.5, x: box[0], y: box[1]};
    var enemyCircle = {radius: 12.5, x: parseFloat(this.element.offset().left) + 12.5, y: parseFloat(this.element.offset().top) + 12.5};
    var dx = box1.x - enemyCircle.x;
    var dy = box1.y - enemyCircle.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < box1.radius + enemyCircle.radius;
  }
}

// found a useful way to detect multiple keyboard inputs at once, making controls a bit smoother
// source: http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once

var keys = {};


$(document).keydown(function (e) {
  keys[e.which] = true;
});

$(document).keyup(function (e) {
  delete keys[e.which];
});

// function to adjust the player's movement coefficient based on the keys pressed
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
  movePlayer(moveX, moveY);
}

// function to change the player's hitboxes and hurtboxes to reflect mid-game adjustments to rotaion
// and to positioning
function setCollisions(center, hit, hurt) {
  $player.hitbox = updateCoordinates($player.center, [$player.hitCoordinates[0], $player.hitCoordinates[1]]);
  for (var i = 0; i < $player.hurtCoordinates.length; i++) {
    $player.hurtboxes[i] = updateCoordinates($player.center, [$player.hurtCoordinates[i][0], $player.hurtCoordinates[i][1]]);
  }
}

// function that takes a hit/hurtbox's center point and rotates it around the player's center
// according the the player's rotation
function updateCoordinates(origin, point) {
  var radianAngle = ($player.angle * Math.PI) / 180;
  return [$player.center[0] + (point[0] - $player.center[0]) * Math.cos(radianAngle) - (point[1] - $player.center[1]) * Math.sin(radianAngle),
  $player.center[1] + (point[0] - $player.center[0]) * Math.sin(radianAngle) + (point[1] - $player.center[1]) * Math.cos(radianAngle)];
}

// function to move the player based on keyboard input
// player will die if they touch the edge of "space"
function movePlayer (moveX, moveY) {
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
}

// function to change the player's angle based on the position of the mouse
// adapted the code i found on http://stackoverflow.com/questions/15653801/rotating-object-to-face-mouse-pointer-on-mousemove
$(document).mousemove(function(e){
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

// initialize necessary global variables to start the game
var level = 0;
var enemies = [];
var enemyMove = 500;
var $board = new Board();
var $player = new Player();
var moveX = parseFloat($player.x);
var moveY = parseFloat($player.y);
var enemiesKilled = 0;
var game = true;

// function to increment the level, and then umber of enemies
function levelUp() {
  if(game){
    level++;
    $('#hud-left > h3').text("level " + level);
    setTimeout(function() {
      for (var i = 1; i <= level; i++) {
        var $enemy = new Enemy(i * 25, i * 25);
        enemies.push($enemy);
      }
    }, 2000);
  }
}

// game loss function to handle losing and make visible the "you lose" div
function lose() {
  $('#lose').css({
    "display" : 'block',
    "margin": "auto",
    "width": "400px",
    "height": "400px",
    "background": "red",
    "font-size": "40px",
    "text-align" : "center" });
  $('#lose').text(name + " lost!");
  $('.enemy').remove();
  $player.element.remove();
  game = false;
  level = 0;
}
// code to get form data
var $data = window.location.search;
$data = $data.substring(1);
$data = $data.split('&');
var $formData = {};

for (var i = 0; i < $data.length; i++) {
  var $pair = $data[i].split('=');
  $formData[$pair[0]] = $pair[1];
}
var difficulty = $formData["difficulty"]

switch (difficulty) {
  case "Relaxed" :
    enemyMove = 750;
    break;
  case "Healthy" :
    enemyMove = 500;
    break;
  case "Taxing" :
    enemyMove = 250;
    break;
}

$('#hud-left > h2').text(difficulty);

var name = $formData["name"];
levelUp();
checkMovement();
