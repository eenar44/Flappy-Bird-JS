// selects the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// gets the restart button element
const restartButton = document.getElementById('restartButton');

// import images
const cloudImg = new Image();
cloudImg.src = "Graphics/cloud.png"; // cloud image

const birdImg = new Image();
birdImg.src = "Graphics/bird.png"; // bird image

const pipeBodyImg = new Image();
pipeBodyImg.src = "Graphics/pipeBody.png"; // pipe body image

const pipeTopImg = new Image();
pipeTopImg.src = "Graphics/pipeTop.png"; // pipe top image

const pipeCapHeight = 15; // height of the fixed cap
const pipeDrawWidth = 50; // The width of the pipe on the canvas
const pipeSpeed = 2;  // the speed the pipes will be moving at
const gap = 120; // the vertical gap between top and bottom pipes
const bird = {
    x: (canvas.width / 2) - 25, // initial posiiton of the bird
    y: (canvas.height / 2),
    width: 16 * 2,
    height: 12 * 2,
    velocity: 0, // how high the bird is when jumping
    gravity: 0.5, // at what rate it will fall
    jumpStrength: -8, // how high it can jump at a time
}; // bird initial properties

let pipes = []; // a list of all the pipe objects on the canvas
let clouds = []; // stores cloud objects on the canvas
let frame = 0; // frames per second
let score = 0; // score counter
let highScore = 0;  // keeps track of the high score
let gameOver = false; // indicates if the game is over
let gameStarted = false; // tracks whether the game has started

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        if (!gameStarted) {
            gameStarted = true; // starts the game when the user first presses space
            jump(); // first jump
        } else if (!gameOver) {
            jump(); // normal jump function
        }
    }
});

// restarts the game when clicking the button
restartButton.addEventListener("click", function () {
    // reset key variables
    gameOver = false;  // not game over
    gameStarted = false;  // game not started until user presses spaebar
    bird.y = (canvas.height / 2);  // reset bird position
    bird.velocity = 0;  // reset bird velocity
    pipes = [];  // clear pipes
    score = 0;  // reset score
    frame = 0;  // reset frame count
    restartButton.style.display = "none";  // hide the restart button
});

// draws the bird using the image graphic on the canvas
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// increase the velocity of the bird by the strentgh of the jump as long as the game isnt over
function jump() {
    if (!gameOver) {
        bird.velocity = bird.jumpStrength;
    }
}

// draws the top pipe on the screen
function drawTopPipe(pipe) {
    // makes sure that the pipe height is always greater than 0
    // finds the height of the pipe by minusing the random y position with the height of the cap
    let bodyHeight = Math.max(pipe.y - pipeCapHeight, 0);

    // draws the pipe body
    ctx.drawImage(pipeBodyImg, pipe.x, 0, pipeDrawWidth, bodyHeight);

    // draws the pipes cap
    ctx.drawImage(pipeTopImg, pipe.x, bodyHeight, pipeDrawWidth, pipeCapHeight);
}

// draws the bottom pipe on the screen
function drawBottomPipe(pipe) {
    // spaces the bottom pipe appropriately
    let bottomPipeY = pipe.y + gap;

    // calculates the bottom pipe height
    // uses the cavas height, the y position of the pipe and the height of the top pipe
    let bottomBodyHeight = canvas.height - bottomPipeY - pipeCapHeight;

    // draws the bottom pipe
    ctx.drawImage(
        pipeBodyImg,
        pipe.x,
        bottomPipeY + pipeCapHeight,
        pipeDrawWidth,
        bottomBodyHeight
    );

    // draws the bottom pipes cap
    // reverses the image of the cap to draw the image
    ctx.save(); // saves the current canas state
    ctx.scale(1, -1); // flips horizontally
    ctx.drawImage(
        pipeTopImg,
        pipe.x,
        -bottomPipeY - pipeCapHeight,
        pipeDrawWidth,
        pipeCapHeight
    ); // draws the image
    ctx.restore(); // restores the canvas
}

// loops and calls the pipe functions to create a continuous loop of pipes
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        drawTopPipe(pipes[i]);
        drawBottomPipe(pipes[i]);
    }
}

// generates pipes
function generatePipes() {

    // dont generate pipes if the game hasnt started
    if (!gameStarted) { return };

    // generates pipes every 100 frames
    if (frame % 100 === 0) {
        // created a random pipe height using random, the height of the canvas and the gap
        // '100' is used as buffer to ensure that a pipe isnt too long or too short
        // 50 is the minimum height of a pipe
        let pipeHeight = Math.random() * (canvas.height - gap - 100) + 50;
        // push the pipes coordinates onto the list of dictionaries of pipe coordinates
        pipes.push({ x: canvas.width, y: pipeHeight });
    }
}

// a circular collider inside the bird, as the 
function circleCollision(bird, pipe) {
    let birdRadius = bird.width / 2.25;  // using the width to find the radius

    // using the coordinates and the width/ height to find the centre of the collider
    let birdCenterX = bird.x + bird.width / 2;
    let birdCenterY = (bird.y + bird.height / 2) + 4;

    // uses the horizontal distance between the birds center and the center of the pipe
    // if the distance is less than the sum of their radii, it means they are overlapping
    // if the y coord. minus the bird radius is above the top pipes bottom, then it has hit it vertically

    // check collision with the top pipe
    if (
        Math.abs(birdCenterX - (pipe.x + pipeDrawWidth / 2)) <
        birdRadius + pipeDrawWidth / 2 &&  // checking horizonal
        birdCenterY - birdRadius < pipe.y  // checks vertically 
    ) {
        return true;
    }

    // check collision with the bottom pipe
    if (
        Math.abs(birdCenterX - (pipe.x + pipeDrawWidth / 2)) <
        birdRadius + pipeDrawWidth / 2 &&
        birdCenterY + birdRadius > pipe.y + gap
    ) {
        return true;
    }

    return false;
}

function updatePipes() {
    // generates the pipes
    generatePipes();

    // move pipes left
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        // check for collisions
        if (circleCollision(bird, pipes[i])) {
            gameOver = true;
        }

        // prevents bird from flying off the top
        if (bird.y < 0) {
            bird.y = 0;
        }

        // game over if the bird hits the ground
        if (bird.y + bird.height >= canvas.height) {
            gameOver = true;
            bird.y = canvas.height - bird.height; // stop bird at the ground
        }

        // check if bird passed a pipe to increase score
        if (pipes[i].x + pipeDrawWidth < bird.x && !pipes[i].scored) {
            score++;
            pipes[i].scored = true; // Mark this pipe as counted
        }
    }
}

// generates clouds
function generateClouds() {
    // loop to generate the clouds
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: i * 300, // space between the clouds
            y: Math.random() * canvas.height, // random heights
            width: 48 * 4, // width for all clouds
            height: 16 * 4,  // height of the clouds
            speed: pipeSpeed + .2, // moves at the same speed as pipes
        });
    }
}

// move clouds left
function updateClouds() {
    for (let i = 0; i < clouds.length; i++) {
        // moves the x coordinate of the cloud left by 2 (the speed)
        clouds[i].x -= clouds[i].speed;

        // reset cloud position when it goes off screen
        if (clouds[i].x + clouds[i].width < 0) {
            clouds[i].x = canvas.width; // move to the right edge instead of deleting
        }
    }
}

// draws all clouds
function drawClouds() {
    for (let i = 0; i < clouds.length; i++) {
        ctx.drawImage(
            cloudImg,
            clouds[i].x,
            clouds[i].y,
            clouds[i].width,
            clouds[i].height
        );
    }
}

function update() {
    // checks the gameover flag
    if (!gameStarted || gameOver) { return }; // Wait for space to start

    // applies gravity to the bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // moves the clouds
    updateClouds();

    // moves the pipes
    updatePipes()

    // remove pipes that are off screen
    pipes = pipes.filter((pipe) => pipe.x > -50);

    frame++; // increase frame count
}

function drawGameOverScreen() {
    let boxWidth = 300;
    let boxHeight = 250;
    let boxX = (canvas.width - boxWidth) / 2;
    let boxY = (canvas.height - boxHeight) / 2;

    // Draw box border
    ctx.fillStyle = "#5A3E2B";
    ctx.fillRect(boxX - 5, boxY - 5, boxWidth + 10, boxHeight + 10);

    // Draw box background
    ctx.fillStyle = "#F4A259";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Set text properties
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P', cursive";

    // Function to manually center text
    function drawCenteredText(text, yOffset) {
        let textWidth = ctx.measureText(text).width;
        let textX = boxX + (boxWidth - textWidth) / 2;
        ctx.fillText(text, textX, boxY + yOffset);
    }

    // Draw text inside the box
    drawCenteredText("Game Over", 50);
    drawCenteredText("Score", 90);
    drawCenteredText(score.toString(), 120);
    drawCenteredText("High Score", 150);
    drawCenteredText(highScore.toString(), 180);

    // Show restart button (CSS handles positioning)
    restartButton.style.display = "block";
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw all the graphics
    drawClouds();
    drawBird();
    drawPipes();

    // Draw the score
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P', cursive";
    ctx.fillText("Score: " + score, 20, 30);

    // Show "Press Space to Start" before game starts
    if (!gameStarted) {
        ctx.fillText("Press Space to Start", canvas.width / 2 - 200, (canvas.height / 2) - 50);
    }

    // Draw game over text and show the restart button
    if (gameOver) {
        if (score > highScore) {
            highScore = score;
        }
        drawGameOverScreen();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

generateClouds();
gameLoop();
