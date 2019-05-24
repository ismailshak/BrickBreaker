var BrickBreaker = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function BrickBreaker()
    {
        Phaser.Scene.call(this, { key: 'brickbreaker' });

        // global variables
        this.bricks;
        this.paddle;
        this.ball;
        this.plus100;
        this.expand;
        this.shrink;

        this.godMode = false;

        this.score = document.querySelector(".score");
        this.lives = document.querySelector(".lives");
        this.scoreCount = 0;
        this.livesCount = 3;
        this.fallSpeed = 100;

        this.width = config.scale.width;        // canvas width
        this.height = config.scale.height;      // canvas height
        this.brickRowCount = 6;                 // for referencing uses only, doesn't dynamically adjust grid. (to change rows you have to edit amount of sprites in the array to match this number)
        this.brickColumnCount = 10;             // this can changes the grid dynamically to fit custom column count
        this.paddleTop = 525;                   // y coordinate to place the ball on
    },
    preload: function (){

        /* 
            sprite sheet that contains all my assets.
            'atlas' references a json file (spritesheet.json) for coordinates to locate a specific sprite
            within a png file (spritesheet.png) that contains all used assets side by side.
        */
        this.load.atlas('assets', './../../img/tile-set/sprites/bricksSpritesheet.png','./../../img/tile-set/sprites/bricksSpritesheet.json')
        this.load.atlas('paddleSprite', './../../img/tile-set/sprites/paddleSpritesheet.png', './../../img/tile-set/sprites/paddleSpritesheet.json');
        this.load.atlas('oneHundredSprite', './../../img/tile-set/sprites/oneHundredSpritesheet.png', './../../img/tile-set/sprites/oneHundredSpritesheet.json');
        this.load.atlas('powerUps', './../../img/tile-set/sprites/powerUpsSpritesheet.png', './../../img/tile-set/sprites/powerUpsSpritesheet.json');
    },
    create: function(){

        //  Enables scene borders as collisions, but disables the floor
        this.physics.world.setBoundsCollision(true, true, true, false);

        /*
            Create the bricks in a 10x6 grid
            --------------------------------
            key is used to reference this group.
            The amount of sprites in the frame array determines the number of rows accurately.
            Any change made to the brickRowCount must be accounted for in this array.
            frameQuantity is how many times you print a specific index in frame.
        */
        this.bricks = this.physics.add.staticGroup({
            key: 'assets', frame: [ 'greyTile.png', 'redTile.png', 'yellowTile.png', 'skyBlueTile.png', 'purpleTile.png', 'greyTile.png'],
            frameQuantity: this.brickColumnCount,
            gridAlign: { width: this.brickColumnCount, height: this.brickRowCount, cellWidth: 70, cellHeight: 30, x: 85, y: 50 }
        });

        /* 
            TODO:
            - shuffle bricks in between both grey rows (fisher-yates algorithm)
        */

        /*
            TODO:
            - add a feature that handles the off chance we get the same random number again
        */

        // Positions power ups in random places on the grid
        for(let i = 0; i < 3; i++) {
            let randomNumber = Math.floor(Math.random()*(this.brickColumnCount*this.brickRowCount))
            // Brick that occupies the space needed to place power up
            let currentBrick = this.bricks.children.entries[randomNumber];
        
            if(i === 0) { // add power up 1 i.e. plus100
                this.plus100 = this.physics.add.sprite(currentBrick.x, currentBrick.y, 'oneHundredSprite', 'plusOneHundred1.png').setImmovable();
                // Place power up on top of brick then destroy brick
                currentBrick = this.plus100;
                this.bricks.children.entries[randomNumber].disableBody(true, true);
            } else if(i === 1) { // power up 2 i.e. expand paddle
                this.expand = this.physics.add.sprite(currentBrick.x, currentBrick.y, 'powerUps', 'expand.png').setImmovable();
                currentBrick = this.expand;
                this.bricks.children.entries[randomNumber].disableBody(true, true);
            } else if(i === 2){ // power up 3 i.e. shrink paddle
                this.shrink = this.physics.add.sprite(currentBrick.x, currentBrick.y, 'powerUps', 'shrink.png').setImmovable();
                currentBrick = this.shrink;
                this.bricks.children.entries[randomNumber].disableBody(true, true);
            }
        }
        
        // Create ball - give bounciness of 1 and allow it to interact with scene border.
        this.ball = this.physics.add.image(this.width/2, this.paddleTop, 'assets', 'ball.png').setCollideWorldBounds(true).setBounce(1);
        // Custom data property added to ball object to track its contact with the paddle.
        this.ball.setData('onPaddle', true);
       
        // Create paddle object and disable force interactions.
        this.paddle = this.physics.add.sprite(this.width/2, 550, 'paddleSprite', 'paddle1.png').setImmovable();

        /*
            Create an animation for paddle.
            -------------------------------
            generateFrameNames goes through the spritesheet (.json) and renders sprites
            from the frames called paddleX.png. The prefix is the start of the file name,
            suffix is the end of the file name and the loop substitutes X with the start value
            up to and including the end value (e.g. paddle1.png).
            repeat = -1 just means infinitely.
        */
        this.anims.create({
            key: 'zap',
            frames: this.anims.generateFrameNames('paddleSprite', { 
                prefix: "paddle", 
                suffix: ".png",
                start: 1,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });
        // Play the animation
        this.paddle.play('zap');

        // Animation for the +100 power up
        this.anims.create({
            key: 'oneHundred',
            frames: this.anims.generateFrameNames('oneHundredSprite', { 
                prefix: "plusOneHundred", 
                suffix: ".png",
                start: 1,
                end: 5,
            }),
            frameRate: 5,
            repeat: -1
        });
        this.plus100.play('oneHundred');

        // Colliders that handle ball to paddle contact and ball to brick contact.
        // When a certain type of contact occurs, third parameter is the callback function.
        // Fifth parameter, this, is the callback context. i.e. to pass the specific objects (ball and brick) to the callback function.
        // Using 'name' to reference that object later
        this.physics.add.collider(this.ball, this.bricks, this.collisionBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.collisionPaddle, null, this);
        this.physics.add.collider(this.ball, this.plus100, this.collisionPlus100, null, this).name = "ballAndPlus100";
        this.physics.add.collider(this.ball, this.expand, this.collisionExpand, null, this).name = "ballAndExpand";
        this.physics.add.collider(this.ball, this.shrink, this.collisionShrink, null, this).name = "ballAndShrink";
        this.physics.add.collider(this.paddle, this.plus100, this.collision100PickUp, null, this);
        this.physics.add.collider(this.paddle, this.expand, this.collisionExpandPickUp, null, this);
        this.physics.add.collider(this.paddle, this.shrink, this.collisionShrinkPickUp, null, this);

        // Mouse event handlers
        this.input.on('pointermove', function (e) {

            if(this.godMode === true) {
                this.ball.x = e.x;
                this.ball.y = e.y;
            } else {
                // Paddle position doesn't phase outside the scene
                this.paddle.x = Phaser.Math.Clamp(e.x, this.paddle.width/2, this.width-(this.paddle.width/2));

                // For the ball to move with the paddle at the start of a life/round
                if (this.ball.getData('onPaddle')){
                    this.ball.x = this.paddle.x;
                }
            }

        }, this);

        this.input.on('pointerup', function (e) {

            // If at the start of a life/round (ball stuck to the paddle)
            if (this.ball.getData('onPaddle'))
            {
                if(this.paddle.x < this.width/2) {
                    // Moves at an angle to the left side
                    this.ball.setVelocity(-80, -400);
                } else if(this.paddle.x > this.width/2) {
                    // Moves at an angle to the left side
                    this.ball.setVelocity(80, -400);
                }
                // Disconnect ball from paddle
                this.ball.setData('onPaddle', false);
            }

        }, this);

        window.addEventListener("deviceorientation", this.handleOrientation, true);
    },

    handleOrientation: function(e) {
        // Rotation amount based on axis of motion
        let z = e.alpha;
        let y = e.beta;
        let x = e.gamma;

        // Temp variables since 'this' in this scope references the entire window.
        let paddleTemp = game.scene.keys.brickbreaker.paddle
        let widthTemp = game.scene.keys.brickbreaker.width;
        let ballTemp = game.scene.keys.brickbreaker.ball;
        let NewValue = (((x - (-90)) * (widthTemp - 0)) / (90 - (-90))) + 0
        paddleTemp.x = Phaser.Math.Clamp(NewValue, paddleTemp.width/2, widthTemp-(paddleTemp.width/2));

        // Move the ball with the baddle at start of round/life
        if (ballTemp.getData('onPaddle'))
        {
            ballTemp.x = paddleTemp.x;
        }
    },

    collisionBrick: function (ball, brick)
    {   
        // If a brick is grey, it needs two hits to break
        if(brick.frame.customData.filename === "greyTile.png") {
            brick.setTexture('assets', 'greyTile1.png')
        } else {
            // Removes brick from the scene
            brick.disableBody(true, true);
            this.scoreCount++;
        }
    },

    collisionPlus100: function (ball, powerUp) {

        // Speed of falling
        powerUp.setVelocityY(this.fallSpeed);

        // Removes collider between the ball and the falling power up.
        this.physics.world.colliders.getActive().find(function(i){
            return i.name == 'ballAndPlus100'
        }).destroy();
    },

    collisionExpand: function(ball, expand) {

        // Speed of falling
        expand.setVelocityY(this.fallSpeed);

        // Removes collider between the ball and the falling power up.
        this.physics.world.colliders.getActive().find(function(i){
            return i.name == 'ballAndExpand'
        }).destroy();
    },

    collisionShrink: function(ball, expand) {

        // Speed of falling
        expand.setVelocityY(this.fallSpeed);

        // Removes collider between the ball and the falling power up.
        this.physics.world.colliders.getActive().find(function(i){
            return i.name == 'ballAndShrink'
        }).destroy();
    },

    collision100PickUp: function(paddle, powerUp){

        // Remove power up and add 100 points to score
        powerUp.disableBody(true, true);
        this.scoreCount += 100;
        
    },

    collisionExpandPickUp: function(paddle, expand){

        // Remove power up, disable any animations and change its sprite to the bigger paddle
        expand.disableBody(true, true);
        this.paddle.anims.pause();
        paddle.setTexture('paddleSprite','paddleLong.png')
    },

    collisionShrinkPickUp: function(paddle, shrink) {

        // Remove power up, disable any animations and change its sprite to the smaller paddle
        shrink.disableBody(true, true);
        this.paddle.anims.pause();
        paddle.setTexture('paddleSprite','paddleShort.png')
    },

    collisionPaddle: function (ball, paddle)
    {
        // How far the ball hits the paddle compared to midpoint of the paddle
        let offset = 0;

        // Hits the left side
        if (ball.x < paddle.x) {
            offset = paddle.x-ball.x;
            // Faster speed the further away it is from the center
            ball.setVelocityX(-10*offset);
        }
        // Hits the right side
        else if (ball.x > paddle.x) {
            offset = ball.x-paddle.x;
            // Faster speed the further away it is from the center
            ball.setVelocityX(10*offset);
        }
    },

    resetBall: function ()
    {
        // Places back on paddle
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, this.paddleTop);
        this.ball.setData('onPaddle', true);
    },

    update: function() {

        // Updates the score/lives every frame
        this.score.innerText = this.scoreCount;
        this.lives.innerText = this.livesCount;

        // When player loses all lives, show game over screen
        if(this.livesCount === 0) {
            gameoverOverlay.style.display = "flex";
            scoreNumber[0].innerHTML = this.scoreCount;
            //this.scoreCount = 0;
        }

        // If ball falls below lower edge of screen, reset ball's position and remove a life
        if (this.ball.y > this.height) {
            this.resetBall();
            this.livesCount--;
        }

        // When player wins (number of bricks - number of power ups in the game) display winner screen
        if (this.bricks.countActive() === 0) {
            winnerOverlay.style.display = "flex";
            
            scoreNumber[1].innerHTML = this.scoreCount;
        }
    }
})

var config = {
    type: Phaser.CANVAS,
    backgroundColor: '#000',
    scale: {
        parent: 'game-container',
        width: 800,
        height: 600,
    },
    scene: [BrickBreaker],
    physics: {
        default: 'arcade',
    },
};

let game = new Phaser.Game(config);

const retryButton = document.querySelector(".retry");
const playAgainButton = document.querySelector(".play-again");
const gameoverOverlay = document.querySelector(".gameover-container");
const winnerOverlay = document.querySelector(".winner-container");
const instructionsButton = document. querySelector(".instructions");
const rules = document.querySelector(".rules-container");

// scoreNumber[0] is gameover overlay and scoreNumber[1] is winner overlay
const scoreNumber = document.querySelectorAll(".score-number")

// When retry clicked, refresh the page
retryButton.addEventListener('click', function(e){
    e.preventDefault();
    document.location.reload();
});

// When retry clicked, refresh the page
playAgainButton.addEventListener('click', function(e){
    e.preventDefault();
    document.location.reload();
});

// When instructions span clicked, toggle rules container on or off
instructionsButton.addEventListener('click', function(e) {
    e.preventDefault();
    if(rules.style.display === "none") {
        rules.style.display = "block";
    } else {
        rules.style.display = "none"
    }
})