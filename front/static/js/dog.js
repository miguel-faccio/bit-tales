let isJumping = false;
let isGameOver = false;
let score = 0;
let scoreInterval;
let obstacleSpeed = 2; // Tempo base para a animação dos obstáculos (em segundos)
const scoreLimit = 3500;
function startGame() {
  isGameOver = false;
  document.getElementById('score').textContent = `Score: 0`;
  score = 0;
  obstacleSpeed = 2; // Reinicia a velocidade dos obstáculos ao iniciar o jogo

  // Limpar obstáculos ao reiniciar
  const existingObstacles = document.querySelectorAll('.obstacle');
  existingObstacles.forEach(obstacle => obstacle.remove());

  // Criar primeiro obstáculo
  createObstacle();

  // Atualizar pontuação
 scoreInterval = setInterval(() => {
    if (!isGameOver) {
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;

      // Verifique se a pontuação atingiu o limite
      if (score >= scoreLimit) {
        isGameOver = true;
        clearInterval(scoreInterval);
        stopObstacles(); // Para os obstáculos quando o jogo acaba
        showGameOver();
        alert("Você atingiu o limite de pontuação!"); // Mensagem para o jogador
        return; // Sai da função para evitar continuar o jogo
      }

      // Aumentar a velocidade dos obstáculos a cada 100 pontos
      if (score % 100 === 0) {
        increaseObstacleSpeed();
      }

      // Atualizar a posição do fundo com base na pontuação
      updateBackgroundPosition();
    }
  }, 100);


}

// Atualiza a posição do fundo com base na pontuação
function updateBackgroundPosition() {
  const background = document.getElementById('background');
  background.style.backgroundPositionX = `${-score / 2}px`; // O fundo se move em relação à pontuação
}

document.addEventListener('keydown', function (event) {
  if ((event.code === 'Space' || event.code === 'ArrowUp') && !isJumping && !isGameOver) {
    jump();
  }
});

function jump() {
  const character = document.getElementById('character');
  if (!isJumping) {
    isJumping = true;
    let jumpHeight = 150; // Aumente a altura do salto
    let jumpSpeed = 15;
    let jumpInterval = setInterval(() => {
      let bottom = parseInt(window.getComputedStyle(character).bottom);
      if (bottom >= jumpHeight) {
        clearInterval(jumpInterval);
        let fallSpeed = 15;
        let fallInterval = setInterval(() => {
          if (bottom <= 0) {
            clearInterval(fallInterval);
            isJumping = false;
          } else {
            bottom -= fallSpeed;
            character.style.bottom = bottom + 'px';
          }
        }, 20);
      } else {
        bottom += jumpSpeed;
        character.style.bottom = bottom + 'px';
      }
    }, 20);
  }
}


function checkCollision() {
  const character = document.getElementById('character');
  const obstacles = document.querySelectorAll('.obstacle');

  obstacles.forEach(obstacle => {
    let characterRect = character.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Verifica colisão
    if (
        characterRect.right > obstacleRect.left &&
        characterRect.left < obstacleRect.right &&
        characterRect.bottom > obstacleRect.top &&
        characterRect.top < obstacleRect.bottom
    ) {
      isGameOver = true;
      clearInterval(scoreInterval);
      stopObstacles(); // Para a animação dos obstáculos
      showGameOver();
    }
  });
}


function stopObstacles() {
  const obstacles = document.querySelectorAll('.obstacle');
  obstacles.forEach(obstacle => {
    obstacle.style.animationPlayState = 'paused'; // Para a animação dos obstáculos
  });
}

function createObstacle() {
  let randomTime = Math.random() * (3000 - 1500) + 1500;

  setTimeout(() => {
    if (isGameOver) return; // Não cria novos obstáculos após o Game Over

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.animation = `moveObstacle ${obstacleSpeed}s linear`; // Ajusta a velocidade da animação
    document.getElementById('gameArea').appendChild(obstacle);

    obstacle.addEventListener('animationend', () => {
      if (!isGameOver) {
        obstacle.remove();
      }
    });

    createObstacle(); // Continua criando obstáculos enquanto o jogo não acabou
  }, randomTime);
}

function increaseObstacleSpeed() {
  obstacleSpeed -= 0.25; // Aumenta a velocidade (reduz o tempo da animação)

  // Impede que a velocidade fique muito baixa
  if (obstacleSpeed < 0.5) {
    obstacleSpeed = 0.5; // Limite mínimo de velocidade
  }
}

function showGameOver() {
  document.querySelector('.modal').style.display = 'block'; // Exibe a tela de Game Over
  document.getElementById('finalScore').textContent = score; // Atualiza a pontuação
}

function closeModal() {
  document.querySelector('.modal').style.display = 'none'; // Fecha o modal
}

function restartGame() {
  isGameOver = false;
  document.querySelector('.modal').style.display = 'none'; // Esconde o modal de Game Over

  const character = document.getElementById('character');
  character.style.bottom = '0px'; // Reseta o personagem

  startGame(); // Reiniciar o jogo
}

// Iniciar o jogo ao carregar
startGame();

// Verificar colisões repetidamente
setInterval(() => {
  if (!isGameOver) {
    checkCollision();
  }
}, 10);
