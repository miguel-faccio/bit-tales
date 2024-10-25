const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let paddleSpeed = 5;
let ballSpeedX = 4;
let ballSpeedY = 4;
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let player1Score = 0;
let player2Score = 0;
let gameInterval;

// const hitSound = new Audio('hit.mp3');  // Efeito sonoro

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenho das raquetes
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

    // Desenho da bola
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Desenho das pontuações
    ctx.font = '30px Arial';
    ctx.fillText(`Player 1: ${player1Score}`, 50, 30);
    ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 150, 30);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisão da bola com as bordas superior e inferior
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
        hitSound.play();  // Som ao bater na parede
    }

    // Colisão da bola com as raquetes
    if (
        (ballX - ballSize < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) ||
        (ballX + ballSize > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
        hitSound.play();  // Som ao bater na raquete
    }

    // Quando a bola sai da tela
    if (ballX - ballSize < 0) {
        player2Score++;
        resetBall();
    } else if (ballX + ballSize > canvas.width) {
        player1Score++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function movePaddle(e) {
    const key = e.key;
    if (key === 'ArrowUp' && player2Y > 0) {
        player2Y -= paddleSpeed;
    } else if (key === 'ArrowDown' && player2Y < canvas.height - paddleHeight) {
        player2Y += paddleSpeed;
    }

    if (key === 'w' && player1Y > 0) {
        player1Y -= paddleSpeed;
    } else if (key === 's' && player1Y < canvas.height - paddleHeight) {
        player1Y += paddleSpeed;
    }
}

function startGame() {
    document.addEventListener('keydown', movePaddle);
    gameInterval = setInterval(draw, 1000 / 60); // 60 FPS
}

function restartGame() {
    clearInterval(gameInterval);
    player1Score = 0;
    player2Score = 0;
    ballSpeedX = 3;
    ballSpeedY = 2;
    player1Y = canvas.height / 2 - paddleHeight / 2;
    player2Y = canvas.height / 2 - paddleHeight / 2;
    resetBall();
    startGame();
}

document.getElementById('restartButton').addEventListener('click', restartGame);

startGame();

// Seleciona o modal e o botão "Como Jogar"
const modal = document.getElementById('howToPlayModal');
const btn = document.getElementById('howToPlayBtn');
const span = document.getElementsByClassName('close')[0];

// Quando o botão for clicado, o modal aparece
btn.onclick = function() {
    modal.style.display = 'flex';
}

// Quando clicar no "X", o modal é fechado
span.onclick = function() {
    modal.style.display = 'none';
}

// Quando clicar fora do modal, ele também é fechado
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

