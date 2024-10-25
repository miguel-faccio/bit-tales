const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

// Carrega a imagem do carro
let carImage = new Image();
carImage.src = '/static/resources/images/elementos_graficos/wladyson.png';

// Carrega as imagens dos obstáculos
let obstacleImages = [
    '/static/resources/images/elementos_graficos/alho.png',
    '/static/resources/images/elementos_graficos/crucifixo.png',
    '/static/resources/images/elementos_graficos/estaca.png'
];

let loadedObstacleImages = [];
let imagesLoaded = 0;

// Função para carregar as imagens dos obstáculos antes de iniciar
function loadImages(callback) {
    obstacleImages.forEach((src, index) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            loadedObstacleImages[index] = img;
            imagesLoaded++;
            if (imagesLoaded === obstacleImages.length) {
                callback(); // Inicia o jogo após carregar todas as imagens
            }
        };
    });
}

// Variáveis principais do jogo
let car = {
    x: (canvas.width - 50) / 2,
    y: canvas.height - 140,
    width: 50,
    height: 80,
    speed: 5,
    movingLeft: false,
    movingRight: false
};

let obstacles = [];
let score = 0;
let gameStarted = false;
let gameOver = false;
let gamePaused = false;
let intervalId;
let difficulty = 'medium';

// Atualiza os botões de dificuldade
function updateDifficultyButtons() {
    const buttons = document.querySelectorAll('.difficulty-button');
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.id === `${difficulty}Button`) {
            button.classList.add('active');
        }
    });
}

function drawCar() {
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

function createObstacle() {
    const obstacleWidth = Math.random() * 50 + 30; // Entre 30 e 80 pixels
    const obstacleX = Math.floor(Math.random() * (canvas.width - obstacleWidth)); // Posição aleatória
    let speed = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 8;

    const obstacleImage = loadedObstacleImages[Math.floor(Math.random() * loadedObstacleImages.length)];

    obstacles.push({
        x: obstacleX,
        y: -50, // Começa fora do canvas
        width: obstacleWidth,
        height: 50,
        speed: speed,
        image: obstacleImage
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.y += obstacle.speed;
    });
}

function moveCar() {
    if (car.movingLeft && car.x > 0) {
        car.x -= car.speed;
    }
    if (car.movingRight && car.x + car.width < canvas.width) {
        car.x += car.speed;
    }
}

function detectCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        if (car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y) {
            handleGameOver();
            return;
        }
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar();
    drawObstacles();
    moveCar();
    detectCollision();

    document.getElementById('score').textContent = "Pontuação: " + score;

    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height); // Remove obstáculos fora do canvas
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameOver = false;
        gamePaused = false;
        score = 0;
        obstacles = [];
        document.getElementById('startButton').disabled = true;
        document.getElementById('pauseButton').style.display = 'inline-block';
        document.getElementById('restartButton').style.display = 'inline-block';

        intervalId = setInterval(() => {
            if (!gamePaused && !gameOver) {
                createObstacle();
                score++;
            }
        }, 1000);

        requestAnimationFrame(gameLoop);
    }
}

function gameLoop() {
    if (!gamePaused && !gameOver) {
        updateGame();
        requestAnimationFrame(gameLoop);
    }
}

function handleGameOver() {
    gameOver = true;
    clearInterval(intervalId); // Para de criar novos obstáculos
    showGameOverModal();
}

function resetGame() {
    gameOver = false;
    gameStarted = false;
    score = 0;
    car.x = (canvas.width - 50) / 2; // Redefine a posição do carro
    obstacles = [];
    document.getElementById('startButton').disabled = false;
    document.getElementById('restartButton').style.display = 'none';
    closeGameOverModal();
}

function pauseGame() {
    gamePaused = !gamePaused;
    document.getElementById('pauseButton').innerText = gamePaused ? 'Retomar' : 'Pausar';
    if (!gamePaused) {
        requestAnimationFrame(gameLoop);
    }
}

function showGameOverModal() {
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = score;
    gameOverModal.style.display = 'block';
}

function closeGameOverModal() {
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = 'none';
}

// Carrega as imagens dos obstáculos antes de iniciar
loadImages(() => {
    document.getElementById('startButton').disabled = false;
});

// Controles de eventos
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', () => {
    resetGame();
    startGame();
});

// Reiniciar o jogo a partir do modal
document.getElementById('restartFromGameOverButton').addEventListener('click', () => {
    closeGameOverModal();
    resetGame();
    startGame();
});

// Fechar o modal e voltar ao início
document.querySelector('.close-btn').addEventListener('click', () => {
    closeGameOverModal();
    resetGame();
});

document.getElementById('pauseButton').addEventListener('click', pauseGame);
document.getElementById('easyButton').addEventListener('click', () => { difficulty = 'easy'; updateDifficultyButtons(); });
document.getElementById('mediumButton').addEventListener('click', () => { difficulty = 'medium'; updateDifficultyButtons(); });
document.getElementById('hardButton').addEventListener('click', () => { difficulty = 'hard'; updateDifficultyButtons(); });

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') car.movingLeft = true;
    if (e.key === 'ArrowRight') car.movingRight = true;
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') car.movingLeft = false;
    if (e.key === 'ArrowRight') car.movingRight = false;
});
