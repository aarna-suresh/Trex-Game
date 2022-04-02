//TREX Game by Aarna using JS


//Declare variables for game objects and behaviour indicators(FLAGS)
var PLAY, END, gameState;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstacle, obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, highScore, displayHs;

var gameOver, gameOverImg, restartIcon, restartImg;

var checkPoint, dieSound, jumpSound;


function preload() {
  //Create Media library and load to use it during the course of the software
  //executed only once at the start of the program

  trex_running = loadAnimation("./assets/trex1.png", "./assets/trex3.png", "./assets/trex4.png");

  trex_collided = loadAnimation("./assets/trex_collided.png");

  groundImage = loadImage("./assets/ground2.png");

  cloudImage = loadImage("./assets/cloud.png");

  obstacle1 = loadImage("./assets/obstacle1.png");
  obstacle2 = loadImage("./assets/obstacle2.png");
  obstacle3 = loadImage("./assets/obstacle3.png");
  obstacle4 = loadImage("./assets/obstacle4.png");
  obstacle5 = loadImage("./assets/obstacle5.png");
  obstacle6 = loadImage("./assets/obstacle6.png");

  gameOverImg = loadImage("./assets/gameOver.png");

  restartImg = loadImage("./assets/restart.png");

  checkPoint = loadSound("./assets/checkPoint.mp3");

  dieSound = loadSound("./assets/die.mp3");

  jumpSound = loadSound("./assets/jump.mp3");


}

//define the intial environment of the software(before it is used)
//by defining the declared variables with default values
//executed only once at the start of the program
function setup() {

  createCanvas(displayWidth, displayHeight);
  console.log("displayWidth = " + displayWidth)
  console.log("displayHeight = " + displayHeight)
  // creating trex
  trex = createSprite(50, height / 2, 20, 50);
  trex.addAnimation("trex_running", trex_running);
  trex.addAnimation("trex_collided", trex_collided);
  trex.scale = 0.7;
  trex.setCollider("circle", 0, 0, 40);
  trex.debug = false;

  //creation of ground sprite object
  ground = createSprite(width / 3, (height / 2) - 15, width, 20);
  ground.addImage("groundImage", groundImage);
  ground.x = ground.width / 2;
  ground.debug = false;

  //creation of invisible ground (invGround)
  invisibleGround = createSprite(width / 3, height / 2, width, 10);
  invisibleGround.visible = false;

  //starting value to the score
  score = 0;

  //starting value to the high score
  highScore = 0;

  //flag indicator to check if high score should be displayed or not
  displayHs = false;

  //gamestate values
  PLAY = 1;
  END = 0;
  gamestate = PLAY;

  //creating a group to store the infinite sprites
  obstaclesGroup = createGroup();
  cloudsGroup = new Group();

  //game over sprite creation
  gameOver = createSprite(width / 2, height / 3, 50, 40);
  gameOver.addImage("gameOverImg", gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;
  //restart sprite creation
  restart = createSprite(width / 2, height / 3 + 30, 50, 50);
  restart.addImage("restartImg", restartImg);
  restart.scale = 0.6;
  restart.visible = false;
}


//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw.
//All commands that are supposed to be executed and checked continously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {

  //set background color 
  background("white");
  //display score
  text("SCORE: " + score, width * (3 / 4), height / 16);


  if (gamestate == PLAY) {

    //score calculation
    score = score + Math.round(getFrameRate() / 60);
    //console.log(getFrameRate()/60);


    //checkpoint sound for every addition of 100 to score
    if (score % 100 == 0) {
      checkPoint.play();
    }
    //condition to display high score or not
    if (displayHs == true) {
      text("HIGH SCORE: " + highScore, width * (3 / 4) - 100, height / 16);
    }
    //movement of the ground and treadmill effect
    ground.velocityX = -(4 + score / 70);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //trex behaviour
    //jump when the space key is pressed
    if ((keyDown("up") || keyDown("space") || touches.length > 0) && trex.y >= height / 3) {
      trex.velocityY = -15;
      jumpSound.play();
      touches = [];
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    //function call to create clouds
    spawnClouds();

    //function call to create cacti
    spawnCacti();

    if (trex.isTouching(obstaclesGroup)) {
      gamestate = END;
      dieSound.play();
    }
  }

  else if (gamestate == END) {

    //change animation of trex when it hits the cacti
    trex.changeAnimation("trex_collided", trex_collided);

    //make the trex stop once it hits a cacti
    trex.velocityY = 0;
    ground.velocityX = 0;

    displayHs = true;

    //display high score
    text("HIGH SCORE: " + highScore, width * (3 / 4) - 100, height / 16);

    //calculate high score
    if (highScore < score) {
      highScore = score;
    }

    //make the cacti stop once the trex hits it
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);

    //make clouds stop once the trex hits any cacti
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);

    //make restart and gameOver icons visible
    gameOver.visible = true;
    restart.visible = true;

    //identifying if the restart icon is being clicked
    if (mousePressedOver(restart)) {
      //function call to restart the game
      restartGame();
    }

  }









  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

//function defintion to restart the game

function restartGame() {
  gamestate = PLAY;

  //destroying all cacti objects from the previous session once the restart button is pressed
  obstaclesGroup.destroyEach();

  //destroying all cloud objects from the previous session once the restart button is pressed
  cloudsGroup.destroyEach();

  //change animation of trex when restart button is clicked
  trex.changeAnimation("trex_running", trex_running);

  //make restart and gameOver icons invisible
  gameOver.visible = false;
  restart.visible = false;

  displayHs = true;

  //display high score
  text("HIGH SCORE: " + highScore, width * (3 / 4) - 100, height / 16);

  //calculate high score
  if (highScore < score) {
    highScore = score;
  }

  //make the score = 0
  score = 0;
}


//function definition to create and move clouds
function spawnClouds() {
  if (frameCount % 45 == 0) {
    cloud = createSprite(width + 10, height / 2, 20, 5);
    cloud.velocityX = -3;
    cloud.y = random(50, height / 3);
    cloud.addImage("cloudImage", cloudImage);
    cloud.scale = 0.5;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 10 + (width / 3);
    cloud.debug = false;
    cloudsGroup.add(cloud);
  }
}

//function definition to create and move obstacles
function spawnCacti() {
  //create cactus objects after every 60 frames
  //to attain this we have to divide the framecount by 60 and check if the remainder is equal to zero
  //if framecount is divisible by given number then a cactus object will be created

  if (frameCount % 150 == 0) {
    //create and define a cactus sprite object in declared variable
    obstacle = createSprite(width + 10, (height / 2) - 30, 5, 20);
    //velocity of cactus which make sit move from left to right
    obstacle.velocityX = -(4 + score / 70);

    //generating lifetime to solve the problem of memory leak 
    //by dividing the distance to be crossed by the object with the speed of the object.
    //here width = width of canvas(400) and speed is velocity of cactus(-6)
    //as velocity is negative, we need to make the lifetime as positive by muliplying the answer with -1;
    obstacle.lifetime = (width / 3) + 10;


    //random is a function used to egnerate any number between given range.
    //Math.round function is used to round and convert any decimal number to its nearest whole integer.
    //generate a random number between 1 to 6 and save it in variable caseNumber.
    var caseNumber = Math.round(random(1, 6));
    //console.log(caseNumber);

    //switch case passes a single variable to match with cases 
    switch (caseNumber) {
      case 1:
        obstacle.addImage("obstacle1", obstacle1);
        //adjust the size of animation for cactus sprite by keeping the width and height ratio stable
        obstacle.scale = 0.8;
        break;
      case 2:
        obstacle.addImage("obstacle2", obstacle2);
        obstacle.scale = 0.8;
        break;
      case 3:
        obstacle.addImage("obstacle3", obstacle3);
        obstacle.scale = 0.8;
        break;
      case 4:
        obstacle.addImage("obstacle4", obstacle4);
        obstacle.scale = 0.6;
        break;
      case 5:
        obstacle.addImage("obstacle5", obstacle5);
        obstacle.scale = 0.6;
        break;
      case 6:
        obstacle.addImage("obstacle6", obstacle6);
        obstacle.scale = 0.5;
        break;
    }

    obstacle.debug = false;

    //Adding each cactus to Group
    //1.to detect collisons between trex and the group 
    //2.to manage and track all cactus
    //3. because it it mot possible to modify or control any individual cactus 
    //Group.add(sprite)
    obstaclesGroup.add(obstacle);




  }
}