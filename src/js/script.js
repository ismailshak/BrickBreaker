var BrickBreaker = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function BrickBreaker()
    {
        Phaser.Scene.call(this, { key: 'brickbreaker' });

        // global variables
        this.bricks;
        this.paddle;
        this.ball;

        this.score = document.querySelector(".score");
        this.lives = document.querySelector(".lives");
        this.scoreCount = 0;
        this.livesCount = 3;

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
            within a single png file (spritesheet.png) that contains all used assets side by side.
        */
        this.load.atlas('assets', '../../img/Tile Set/sprites/spritesheet.png','../../img/Tile Set/sprites/spritesheet.json')

        this.load.atlas('paddleSprite', '../../img/Tile Set/sprites/paddleSpritesheet.png', '../../img/Tile Set/sprites/paddleSpritesheet.json');

        this.load.atlas('oneHundredSprite', '../../img/Tile Set/sprites/oneHundredSpritesheet.png', '../../img/Tile Set/sprites/oneHundredSpritesheet.json');
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
            key: 'assets', frame: [ 'redTile.png', 'greenTile.png', 'blueTile.png', 'redTile.png', 'greenTile.png', 'blueTile.png' ],
            frameQuantity: this.brickColumnCount,
            gridAlign: { width: this.brickColumnCount, height: this.brickRowCount, cellWidth: 70, cellHeight: 30, x: 85, y: 50 }
        });

        // console.log(this.bricks)
        // let currentBrick = this.bricks.children.entries[1]
        // currentBrick = this.physics.add.sprite(currentBrick.x, currentBrick.y, 'oneHundredSprite', 'plusOneHundred1.png');
        // this.bricks.children.entries[1].disableBody(true, true);
        // this.anims.create({
        //     key: 'oneHundred',
        //     frames: this.anims.generateFrameNames('oneHundredSprite', { 
        //         prefix: "plusOneHundred", 
        //         suffix: ".png",
        //         start: 1,
        //         end: 5,
        //     }),
        //     frameRate: 5,
        //     repeat: -1
        // });
        // // Play the animation
        // currentBrick.play('oneHundred');
        
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
            up to and including the end value.
            repeat = -1 just means infinity.
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

        //console.log(this.paddle)

        // Colliders that handle ball to paddle contact and ball to brick contact.
        // When a certain type of contact occurs, third parameter is the callback function.
        // Fifth parameter, this, is the callback context. i.e. to pass the specific objects (ball and brick) to the callback function.
        this.physics.add.collider(this.ball, this.bricks, this.collisionBrick, null, this);
        this.physics.add.collider(this.ball, this.paddle, this.collisionPaddle, null, this);

        // Mouse event handlers
        this.input.on('pointermove', function (e) {

            // Paddle position doesn't phase outside the scene
            this.paddle.x = Phaser.Math.Clamp(e.x, this.paddle.width/2, this.width-(this.paddle.width/2));
            console.log()

            // For the ball to move with the paddle at the start of a life/round
            if (this.ball.getData('onPaddle'))
            {
                this.ball.x = this.paddle.x;
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
    },

    collisionBrick: function (ball, brick)
    {   
        // Removes brick from the scene
        brick.disableBody(true, true);

        this.scoreCount++;
    },

    collisionPaddle: function (ball, paddle)
    {
        // How far the ball hits the paddle compared to midpoint of paddle
        let offset = 0;

        // Hits the left side
        if (ball.x < paddle.x)
        {
            offset = paddle.x-ball.x;
            // Faster speed the further away it is from the center
            ball.setVelocityX(-10*offset);
        }
        // Hits the right side
        else if (ball.x > paddle.x)
        {
            offset = ball.x-paddle.x;
            // Faster speed the further away it is from the center
            ball.setVelocityX(10*offset);
        }
    },

    resetBall: function ()
    {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.paddle.x, this.paddleTop);
        this.ball.setData('onPaddle', true);
    },

    resetLevel: function ()
    {
        this.resetBall();
        // Re-render every brick in the bricks group
        this.bricks.children.each(brick => brick.enableBody(false, 0, 0, true, true));
    },
    update: function() {

        // Updates the score and lives every frame
        this.score.innerText = this.scoreCount;
        this.lives.innerText = this.livesCount;

        // When player loses all lives, reset the game
        if(this.livesCount === 0) {
            //this.resetLevel();
            gameoverOverlay.style.display = "flex";
            this.scoreCount = 0;
        }

        // If ball falls below lower edge of screen, reset ball's position
        if (this.ball.y > this.height)
        {
            this.resetBall();
            this.livesCount--;
        }

        // When player wins
        if (this.scoreCount === this.brickColumnCount*this.brickRowCount)
        {
            //this.resetLevel();
            winnerOverlay.style.display = "flex";
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

retryButton.addEventListener('click', function(e){
    document.location.reload();
});
playAgainButton.addEventListener('click', function(e){
    document.location.reload();
});

// function restartGame() {
//     document.location.reload();
// }