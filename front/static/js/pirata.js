        // Seleciona o canvas e o contexto 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 470;
canvas.height = 470;

// Carrega a imagem da bola
const ballImage = new Image();
ballImage.src = '/static/resources/images/elementos_graficos/bola.png'; // Caminho da sua imagem da bola

// Propriedades do jogo e dificuldade
let ball = { x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2, radius: 10 };
let paddle = { width: 75, height: 10, x: (canvas.width - 70) / 2, speed: 7, rightPressed: false, leftPressed: false };
let bricks = [];
let score = 0, lives = 3, isPaused = false, difficulty = 'facil';

// Cria os tijolos
const createBricks = () => {
    let brickRowCount = difficulty === 'dificil' ? 5 : difficulty === 'medio' ? 4 : 3;
    let brickColumnCount = 5, brickWidth = 75, brickHeight = 20, brickPadding = 10, brickOffsetTop = 30, brickOffsetLeft = 30;

    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }; // Tijolo ativo
        }
    }
};

// Desenha a bola usando a imagem
const drawBall = () => {
    ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
};

// Desenha a raquete
const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = '#ff6347'; // Cor da raquete
    ctx.fill();
    ctx.closePath();
};
const brickImage = new Image();
brickImage.src = '/static/resources/images/elementos_graficos/madeira.jpg'; // Substitua pelo caminho da sua imagem

// Desenha os tijolos
const drawBricks = () => {
    bricks.forEach((col, c) => col.forEach((brick, r) => {
        if (brick.status) {
            let brickX = (c * (75 + 10)) + 30;
            let brickY = (r * (20 + 10)) + 30;
            brick.x = brickX;
            brick.y = brickY;
            ctx.drawImage(brickImage, brickX, brickY, 75, 20); // Desenha a imagem
        }
    }));
};

// Certifique-se de que a imagem seja carregada antes de desenhar
brickImage.onload = () => {
    drawBricks(); // Chama a função de desenho após a imagem estar carregada
};

// Detecta colisões com os tijolos
const collisionDetection = () => {
    bricks.forEach(col => col.forEach(brick => {
        if (brick.status && ball.x > brick.x && ball.x < brick.x + 75 && ball.y > brick.y && ball.y < brick.y + 20) {
            ball.dy = -ball.dy; // Inverte a direção da bola
            brick.status = 0; // Marca o tijolo como quebrado
            score++; // Incrementa a pontuação
        }
    }));
};

// Funções para desabilitar/ativar botões de dificuldade
const disableDifficultyButtons = () => {
    document.getElementById('facilButton').disabled = true;
    document.getElementById('medioButton').disabled = true;
    document.getElementById('dificilButton').disabled = true;
};

const enableDifficultyButtons = () => {
    document.getElementById('facilButton').disabled = false;
    document.getElementById('medioButton').disabled = false;
    document.getElementById('dificilButton').disabled = false;
};

// Funções de controle dos botões de dificuldade
document.getElementById('facilButton').addEventListener('click', () => {
    difficulty = 'facil';
    createBricks();
    enableDifficultyButtons();
});
document.getElementById('medioButton').addEventListener('click', () => {
    difficulty = 'medio';
    createBricks();
    enableDifficultyButtons();
});
document.getElementById('dificilButton').addEventListener('click', () => {
    difficulty = 'dificil';
    createBricks();
    enableDifficultyButtons();
});

// Funções dos botões de controle
document.getElementById('startButton').addEventListener('click', () => {
    isPaused = false;
    disableDifficultyButtons();
    draw();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    isPaused = !isPaused;
    if (!isPaused) draw();
});

document.getElementById('restartButton').addEventListener('click', () => {
    document.location.reload();
});

// Funções de desenho do jogo
const drawScore = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('Pontuação: ' + score, 8, 20);
};

const drawLives = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('Vidas: ' + lives, canvas.width - 80, 20);
};

// Movimento da raquete
const movePaddle = () => {
    if (paddle.rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed; // Move a raquete para a direita
    } else if (paddle.leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed; // Move a raquete para a esquerda
    }
};

// Função principal do jogo
const draw = () => {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        drawBricks(); // Desenha os tijolos
        drawBall(); // Desenha a bola (imagem)
        drawPaddle(); // Desenha a raquete
        drawScore(); // Desenha a pontuação
        drawLives(); // Desenha as vidas
        collisionDetection(); // Detecta colisões com os tijolos

        // Move a bola
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Detecta colisão com as bordas
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx; // Inverte a direção da bola ao colidir com as bordas
        }

        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy; // Inverte a direção da bola ao colidir com o teto
        } else if (ball.y + ball.dy > canvas.height - ball.radius) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                ball.dy = -ball.dy; // Inverte a direção da bola ao bater na raquete
            } else {
                lives--; // Reduz uma vida
                if (lives > 0) {
                    // Reseta a bola e a raquete se ainda houver vidas
                    ball.x = canvas.width / 2;
                    ball.y = canvas.height - 30;
                    ball.dx = 2;
                    ball.dy = -2;
                    paddle.x = (canvas.width - paddle.width) / 2; // Centraliza a raquete
                } else {
                    checkLives(); // Verifica se perdeu todas as vidas
                }
            }
        }

        // Move a raquete
        movePaddle();

        requestAnimationFrame(draw); // Solicita o próximo frame
    }
};

// Função para verificar vidas e mostrar o modal de Game Over
const checkLives = () => {
    if (lives <= 0) {
        showGameOverModal(); // Mostra o modal se o jogador perder
    }
};

// Seleciona o modal de Game Over e o botão de reiniciar
const gameOverModal = document.getElementById('gameOverModal');
const restartGameButton = document.getElementById('restartGameButton');

// Função para mostrar o modal de Game Over
const showGameOverModal = () => {
    gameOverModal.style.display = 'flex';
};

// Função para esconder o modal de Game Over e reiniciar o jogo
restartGameButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    document.location.reload();
});

// Listeners para controle de teclas pressionadas
document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.rightPressed = true; // Raquete move para a direita
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.leftPressed = true; // Raquete move para a esquerda
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.rightPressed = false; // Para de mover para a direita
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.leftPressed = false; // Para de mover para a esquerda
    }
});

// Inicializa os tijolos ao carregar a página
createBricks();

// Seleciona o modal de regras
const modalRegras = document.getElementById('modalRegras');
const regrasLink = document.getElementById('regrasLink');
const closeModalRegras = document.getElementsByClassName('close-regras')[0]; // Seleciona o botão de fechar específico

// Quando o usuário clicar no link "Como Jogar", o modal de regras é aberto
regrasLink.onclick = (e) => {
    e.preventDefault();
    modalRegras.style.display = 'flex';
}

// Quando o usuário clicar no "X", o modal de regras é fechado
closeModalRegras.onclick = () => {
    modalRegras.style.display = 'none';
}

// Quando o usuário clicar fora do modal de regras, ele também fecha
window.onclick = (e) => {
    if (e.target === modalRegras) {
        modalRegras.style.display = 'none';
    }
}
