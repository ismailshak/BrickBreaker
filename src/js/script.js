const canvas = document.querySelector("#mainCanvas");
const context = canvas.getContext("2d");


let cWidth = canvas.width;          //canvas width
let cHeight = canvas.height;        //canvas height

let x = cWidth/2;                   // starting x position for the ball
let y = cHeight-30;                 // starting y position for the ball
let dx = 4;                         // change in x after every frame, effectively the speed of the ball in x
let dy = -4;                        // change in y after every frame, effectively the speed of the ball in y
let ballRadius = 10;

let paddleHeight = 10;              // thickness of paddle
let paddleWidth = 100;
let paddleX = (canvas.width-paddleWidth) / 2; // top left corner of paddle
let paddleSpeed = 8;

let brickRowCount = 3;
let brickColumnCount = 7;
let brickWidth = 80;
let brickHeight = 20;
let brickPadding = 10;              // to control space between each brick
let brickOffsetTop = 50;            // amount of white space to the top of first row
let brickOffsetLeft = (cWidth-(brickColumnCount*(brickPadding+brickWidth)))/2;       // whatever white space remains after bricks are placed, place half on each side

let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;

let bricks = [];
// creates a 2d array of bricks not yet given a position on the screen
for(let col=0; col<brickColumnCount; col++) {
    bricks[col] = [];
    for(let row=0; row<brickRowCount; row++) {
        bricks[col][row] = { 
            x: 0,
            y: 0, 
            isBroken: false
        };
    }
}

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.addEventListener("mousemove", mouseMove, false)

function mouseMove(e) {
    var thisX = e.clientX - canvas.offsetLeft; // to match mouse and paddle position
    if(thisX > 0 && thisX < canvas.width) {
        paddleX = thisX - paddleWidth/2;
    }
}

function keyDown(e) {
    if(e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUp(e) {
    if(e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisions() {
    for (let col = 0; col < brickColumnCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            let brick = bricks[col][row];
            if (brick.isBroken == false) {
                //if the ball's center collides with a brick's x or y edge
                //let xPerimeter = Math.cos(ballRadius)+x <-- attempt at making the hitbox round instead of centre circle
                //let yPerimeter = Math.sin(ballRadius)+y
                if (x > brick.x - ballRadius && x < brick.x + brickWidth + ballRadius && y > brick.y - ballRadius && y < brick.y + brickHeight + ballRadius) {
                    dy = -dy;   // forces the ball to bounce back maintaining x direction
                    brick.isBroken = true; // sets its broken bool to true
                    score++;    // update score since a brick has been destroyed
                    if(score === brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function renderBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

function renderPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

function renderBricks() {

    for (let col = 0; col < brickColumnCount; col++) {
        for (let row = 0; row < brickRowCount; row++) {
            // if the brick hasn't been destroyed - bricks are re-rendered every frame
            if (bricks[col][row].isBroken == false) {
                // takes into account row/col number, padding and offset to render each brick
                let brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "blue";
                context.fill();
                context.closePath();
            }
        }
    }
}

function renderScore() {
    context.font = "18px Verdana";
    context.fillStyle = "blue";
    context.fillText("Score: "+score, 8, 30);
}

function renderLives() {
    context.font = "18px Verdana";
    context.fillStyle = "blue";
    context.fillText("Lives: "+lives, canvas.width-75, 30);
}

function render() {

    // clears previously drawn renderings on the whole canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderBall();
    renderPaddle();
    renderBricks();
    renderScore();
    renderLives();
    collisions();
    x += dx;
    y += dy;

    /* 
        detection for walls, taking in ball radius into account 
    */

    // handles the left and right wall
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // handles the top wall
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        
        if(x > paddleX && x < paddleX + paddleWidth && y > paddleHeight + ballRadius) { // if the ball hits the paddle, bounce back
            dy = -dy;
        } else { // if the ball falls below the paddle alert game over
            lives--;
            if(lives === 0) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = mainCanvas.width/2;
                y = mainCanvas.height-30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    requestAnimationFrame(render);
}
render();




