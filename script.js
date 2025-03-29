const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 10, ballSpeedY = 10;
let playerScore = 0, aiScore = 0;
let difficulty = 'medium'; // Default difficulty

// Sound effects
const hitSound = new Audio('hit.mp3'); // Add your sound file path
const scoreSound = new Audio('score.mp3'); // Add your sound file path

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("difficulty").addEventListener("change", (event) => {
    difficulty = event.target.value;
});

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.querySelector(".table").style.display = "block";
    playerScore = 0;
    aiScore = 0;
    gameLoop();
}

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, event.clientY - rect.top - paddleHeight / 2));
});

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
    }

    if (aiY + paddleHeight / 2 < ballY) aiY += difficulty === 'hard' ? 10 : 5;
    else if (aiY + paddleHeight / 2 > ballY) aiY -= difficulty === 'hard' ? 10 : 5;

    if (
        (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ||
        (ballX + ballSize >= canvas.width - paddleWidth && ballY >= aiY && ballY <= aiY + paddleHeight)
    ) {
        ballSpeedX *= -1; 
        hitSound.play(); // Play hit sound
    }

    if (ballX <= 0) {
        aiScore++;
        scoreSound.play(); // Play score sound
        resetBall();
    } else if (ballX + ballSize >= canvas.width) {
        playerScore++;
        scoreSound.play(); // Play score sound
        resetBall();
    }

    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("aiScore").innerText = aiScore;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
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
