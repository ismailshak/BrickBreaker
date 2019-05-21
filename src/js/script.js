const canvas = document.querySelector("#mainCanvas");
const context = canvas.getContext("2d");


let cWidth = canvas.width;          //canvas width
let cHeight = canvas.height;        //canvas height

let x = cWidth/2;                   // starting x position for the ball
let y = cHeight-30;                 // starting y position for the ball
let dx = 4;                         // change in x after every frame, effectively the speed of the ball in x
let dy = -4;                        // change in y after every frame, effectively the speed of the ball in y
let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width-paddleWidth) / 2;
let paddleSpeed = 8;

let brickRowCount = 3;
let brickColumnCount = 7;
let brickWidth = 80;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 50;
let brickOffsetLeft = (cWidth-(brickColumnCount*(brickPadding+brickWidth)))/2;       // whatever white space remains after bricks are placed, place half on each side

let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;

let bricks = [];
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
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
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
                //if the ball
                //let xPerimeter = Math.cos(ballRadius)+x
                //let yPerimeter = Math.sin(ballRadius)+y
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy;
                    brick.isBroken = true;
                    score++;
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
            // if the brick hasn't been destroyed
            if (bricks[col][row].isBroken == false) {
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
    context.font = "16px Arial";
    context.fillStyle = "blue";
    context.fillText("Score: "+score, 8, 30);
}

function renderLives() {
    context.font = "16px Arial";
    context.fillStyle = "blue";
    context.fillText("Lives: "+lives, canvas.width-65, 30);
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
        
        if(x > paddleX && x < paddleX + paddleWidth) { // if the ball hits the paddle, bounce back
            dy = -dy;
        } else { // if the ball falls below the paddle alert game over
            //alert("GAME OVER");
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
    //requestAnimationFrame(render);
}
render();




