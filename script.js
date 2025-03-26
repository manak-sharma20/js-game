const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 5;
let playerScore = 0, aiScore = 0;


canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    console.log(`Mouse Event Y: ${event.clientY}`); // Debugging statement
    console.log(`Rect Top: ${rect.top}, Canvas Height: ${canvas.height}`); // Debugging statement
    console.log(`Calculated PlayerY: ${event.clientY - rect.top - paddleHeight / 2}`); // Debugging statement
    console.log(`Event Client Y: ${event.clientY}, Rect Top: ${rect.top}`); // Additional debugging statement
    console.log(`Rect: ${JSON.stringify(rect)}`); // Debugging statement for rect
    console.log(`Canvas Height: ${canvas.height}`); // Debugging statement for canvas height
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, event.clientY - rect.top - paddleHeight / 2));
    console.log(`Updated Player Paddle Y: ${playerY}`); // Debugging statement
    console.log(`Final PlayerY after assignment: ${playerY}`); // Debugging statement for final playerY
    console.log(`PlayerY after calculation: ${event.clientY - rect.top - paddleHeight / 2}`); // Additional debugging statement
    console.log(`Updated Player Paddle Y: ${playerY}`); // Debugging statement

});


function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
    }

    
    if (aiY + paddleHeight / 2 < ballY) aiY += 5;
    else if (aiY + paddleHeight / 2 > ballY) aiY -= 5;

   
    if (
        (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ||
        (ballX + ballSize >= canvas.width - paddleWidth && ballY >= aiY && ballY <= aiY + paddleHeight)
    ) {
        ballSpeedX *= -1; 
    }

    
    if (ballX <= 0) {
        aiScore++;
        resetBall();
    } else if (ballX + ballSize >= canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
}

function draw() {
    console.log(`Player Paddle Y: ${playerY}, AI Paddle Y: ${aiY}, Ball Position: (${ballX}, ${ballY})`); // Debugging statement
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw Scores
    ctx.font = "20px Arial";
    ctx.fillText(`Player: ${playerScore}`, 50, 30);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
