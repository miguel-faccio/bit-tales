// script.js

// Variáveis do Jogo
let player;
let balls = [];
let powerUps = [];
let container;
let scoreElement;
let finalScoreElement;
let timerElement;
let containerWidth;
let containerHeight;
let playerSpeed = 30;
let ballSpeed;
let gameInterval;
let collisionInterval;
let keysPressed = {};
let gameOver = false;
let score = 0;
let gameDuration = 30; // Duração do jogo em segundos
let timerIntervalId;

// Sons do Jogo (verifique os caminhos dos arquivos)
const audioCapture = new Audio('sounds/capture_sound.mp3');
const audioBackground = new Audio('sounds/background_music.mp3');
const powerUpSound = new Audio('sounds/powerup_sound.mp3');

// Tipos de Power-Ups
const powerUpTypes = ['increaseScore', 'slowDown', 'extraBall', 'increaseTime'];

// Inicialização do Jogo após o Carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('game-container');
    scoreElement = document.getElementById('score');
    finalScoreElement = document.getElementById('final-score');
    timerElement = document.getElementById('timer-value');

    // Precarregar Sons
    preloadSounds();

    // Ajustar o tamanho do contêiner quando a janela for redimensionada
    window.addEventListener('resize', updateContainerSize);
});

// Função para Precarregar Sons
function preloadSounds() {
    audioCapture.preload = 'auto';
    audioBackground.preload = 'auto';
    powerUpSound.preload = 'auto';
}

// Atualizar o Tamanho do Contêiner
function updateContainerSize() {
    containerWidth = container.offsetWidth;
    containerHeight = container.offsetHeight;
}

// Atualizar a Pontuação
function updateScore(delta = 1) {
    score += delta;
    scoreElement.textContent = score;

    // Aumentar a dificuldade a cada 5 pontos
    if (score % 5 === 0) {
        ballSpeed += 0.2; // Incremento mais suave
    }
}

// Atualizar o Timer
function updateTimer() {
    if (gameDuration > 0) {
        timerElement.textContent = gameDuration;
        gameDuration--;
    } else {
        endGame();
    }
}

// Criar o Jogador
function createPlayer() {
    player = document.createElement('div');
    player.classList.add('player');
    container.appendChild(player);

    // Eventos de Teclado para Movimentação
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Usar requestAnimationFrame para movimentar o jogador
    movePlayer();
}

// Manipuladores de Eventos de Teclado
function handleKeyDown(event) {
    keysPressed[event.key] = true;
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

// Movimentar o Jogador com Base nas Teclas Pressionadas
function movePlayer() {
    if (!player) return;

    let playerLeft = player.offsetLeft;

    if (keysPressed['ArrowLeft'] && playerLeft > 0) {
        player.style.left = Math.max(playerLeft - playerSpeed, 0) + 'px';
    }

    if (keysPressed['ArrowRight'] && (playerLeft + player.offsetWidth) < containerWidth) {
        player.style.left = Math.min(playerLeft + playerSpeed, containerWidth - player.offsetWidth) + 'px';
    }

    requestAnimationFrame(movePlayer); // Substituir o uso de setInterval
}

// Criar uma Bola
function createBall() {
    if (gameOver) return;

    const ball = document.createElement('div');
    
    // Decidir aleatoriamente se será uma maçã ou uma laranja
    const isApple = Math.random() < 0.5; // 50% de chance para cada um
    ball.classList.add('ball');
    
    // Adicionar classe específica para maçã ou laranja
    if (isApple) {
        ball.classList.add('apple'); // Classe para maçã
    } else {
        ball.classList.add('orange'); // Classe para laranja
    }
    
    ball.style.left = `${Math.random() * (containerWidth - 30)}px`;
    ball.style.top = '0px';
    container.appendChild(ball);
    balls.push(ball);
    moveBall(ball);
}


// Movimentar a Bola Descendo na Tela
function moveBall(ball) {
    const moveBallInterval = setInterval(() => {
        if (gameOver || !ball.parentElement) {
            clearInterval(moveBallInterval);
            return;
        }

        let ballTop = ball.offsetTop;
        ball.style.top = `${ballTop + ballSpeed}px`;

        // Verificar colisão entre o jogador e a bola
        const playerRect = player.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        if (isColliding(playerRect, ballRect)) {
            audioCapture.currentTime = 0;
            audioCapture.play();

            // Verificar se a bola capturada é uma maçã ou laranja
            if (ball.classList.contains('apple')) {
                updateScore(2); // Pontuação para maçã
            } else if (ball.classList.contains('orange')) {
                updateScore(1); // Pontuação para laranja
            }

            container.removeChild(ball); // Remove a bola do contêiner
            balls = balls.filter(b => b !== ball); // Remove da lista de bolas
            createParticles(ballRect.left, ballRect.top); // Efeito de partículas
            clearInterval(moveBallInterval); // Para o movimento
            return;
        }

        // Verificar se a bola chegou ao fundo da tela
        if (ballTop + ball.offsetHeight >= containerHeight) {
            clearInterval(moveBallInterval);
            container.removeChild(ball);
            balls = balls.filter(b => b !== ball);
            endGame(); // Fim de jogo se a bola atingir o fundo
        }
    }, 20);
}


// Criar um Power-Up
function createPowerUp() {
    if (gameOver) return;

    const powerUp = document.createElement('div');
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    powerUp.classList.add('power-up', type);
    powerUp.style.left = `${Math.random() * (containerWidth - 30)}px`;
    powerUp.style.top = '0px';
    container.appendChild(powerUp);
    powerUps.push(powerUp);
    movePowerUp(powerUp);
}

// Movimentar o Power-Up Descendo na Tela
function movePowerUp(powerUp) {
    const movePowerUpInterval = setInterval(() => {
        if (gameOver || !powerUp.parentElement) {
            clearInterval(movePowerUpInterval);
            return;
        }

        let powerUpTop = powerUp.offsetTop;
        powerUp.style.top = `${powerUpTop + 2}px`; // Velocidade do power-up

        // Verificar se o power-up chegou ao fundo
        if (powerUpTop + powerUp.offsetHeight >= containerHeight) {
            clearInterval(movePowerUpInterval);
            container.removeChild(powerUp);
            powerUps = powerUps.filter(p => p !== powerUp);
        }
    }, 20);
}

// Iniciar o Jogo com um Nível Específico
function startGame(level) {
    updateContainerSize();
    clearGame();

    switch (level) {
        case 1:
            ballSpeed = 2;
            break;
        case 2:
            ballSpeed = 4;
            break;
        case 3:
            ballSpeed = 6;
            break;
        default:
            ballSpeed = 2;
    }

    const ballCreationRate = Math.max(1000 / level, 400);

    gameOver = false;
    score = 0;
    gameDuration = 30;
    updateScore(0);
    updateTimer();
    createPlayer();

    audioBackground.loop = true;
    audioBackground.currentTime = 0;
    audioBackground.play();

    timerIntervalId = setInterval(updateTimer, 1000);

    gameInterval = setInterval(() => {
        createBall();
        if (Math.random() < 0.3) createPowerUp();
    }, ballCreationRate);

    collisionInterval = setInterval(checkCollisions, 20);
}

// Verificar Colisões entre o Jogador e Power-Ups
function checkCollisions() {
    const playerRect = player.getBoundingClientRect();

    powerUps.forEach(powerUp => {
        if (!powerUp.parentElement) return;

        const powerUpRect = powerUp.getBoundingClientRect();

        if (isColliding(playerRect, powerUpRect)) {
            powerUpSound.currentTime = 0;
            powerUpSound.play();
            applyPowerUp(powerUp.classList[1]);
            container.removeChild(powerUp);
            powerUps = powerUps.filter(p => p !== powerUp);
        }
    });
}

// Função de Detecção de Colisão (AABB)
function isColliding(rect1, rect2) {
    return (
        rect1.left < rect2.left + rect2.width &&
        rect1.left + rect1.width > rect2.left &&
        rect1.top < rect2.top + rect2.height &&
        rect1.height + rect1.top > rect2.top
    );
}

// Aplicar o Efeito do Power-Up
function applyPowerUp(type) {
    switch (type) {
        case 'increaseScore':
            updateScore(2);
            break;
        case 'slowDown':
            ballSpeed = Math.max(ballSpeed - 1, 1);
            break;
        case 'extraBall':
            createBall();
            break;
        case 'increaseTime':
            gameDuration = Math.min(gameDuration + 10, 30); // Adiciona 10 segundos, máximo de 60
            break;
        default:
            console.warn(`Tipo de power-up desconhecido: ${type}`);
    }
}

// Criar Partículas de Efeito Visual
function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${x + 15}px`;
        particle.style.top = `${y + 15}px`;
        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentElement) {
                container.removeChild(particle);
            }
        }, 600);
    }
}

// Limpar o Estado Atual do Jogo
function clearGame() {
    clearInterval(gameInterval);
    clearInterval(collisionInterval);
    clearInterval(timerIntervalId);

    balls.forEach(ball => {
        if (ball.parentElement) {
            container.removeChild(ball);
        }
    });
    balls = [];

    powerUps.forEach(powerUp => {
        if (powerUp.parentElement) {
            container.removeChild(powerUp);
        }
    });
    powerUps = [];

    if (player && player.parentElement) {
        container.removeChild(player);
    }

    gameOver = true;

    audioBackground.pause();
    audioBackground.currentTime = 0;

    keysPressed = {};
}

// Finalizar o Jogo e Exibir Tela de Fim de Jogo
function endGame() {
    if (gameOver) return; // Verifica se o jogo já terminou

    gameOver = true; // Define que o jogo terminou
    finalScoreElement.textContent = score; // Exibe a pontuação final

    // Exibe a tela de fim de jogo
    document.getElementById('game-wrapper').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'flex';
    
    // Oculta o menu de navegação
    document.querySelector('nav').style.display = 'none';

    // Para todos os processos do jogo
    clearGame();
}


// Função para Reiniciar o Jogo
function restartGame() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('game-wrapper').style.display = 'flex';
    document.querySelector('nav').style.display = 'block';
    startGame(1);
}

// Função para Pausar o Jogo
function pauseGame() {
    if (gameOver) return;

    gameOver = true;

    clearInterval(gameInterval);
    clearInterval(collisionInterval);
    clearInterval(timerIntervalId);

    audioBackground.pause();
}

// Função para Resetar o Jogo
function resetGame() {
    endGame();
    restartGame();
}

// Função para abrir o modal
function openModal() {
    const gameWrapper = document.getElementById('game-wrapper');
    if (gameWrapper.style.display === 'flex') {
        document.getElementById('rules-modal').style.display = 'flex';
    }
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('rules-modal').style.display = 'none';
}

// Fecha o modal quando o usuário clica fora da área do modal
window.onclick = function (event) {
    const modal = document.getElementById('rules-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Mostrar a Área de Jogo e Iniciar o Jogo
function showGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-wrapper').style.display = 'flex';
    document.querySelector('nav').style.display = 'block';
}
