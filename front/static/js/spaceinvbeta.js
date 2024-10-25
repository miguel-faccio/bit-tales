const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Estado do jogo
let isGameOver = false;
let isPaused = false;
let isVictory = false;
let isTakingDamage = false; // Flag para saber se o jogador está levando dano
let damageFlashEndTime = 0; // Tempo quando o flash deve terminar
const DAMAGE_FLASH_DURATION = 500; // Duração do flash em milissegundos
let playerLives = 3; // Adiciona 3 vidas ao jogado
let playerSpeed = 7; // Ajuste a velocidade conforme necessário
let enemySpeed = 7;
let enemyBulletSpeed = 7;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let barriers = [];
let lastEnemyMoveTime = 0;
let enemyDirection = 1;
let lastEnemyShootTime = 0;
let lastPlayerShootTime = 0;
let enemyShootInterval = 900;
let playerShootInterval = 900; 
let startTime = Date.now();
let moveDelay = 10; // Delay para movimentação travada

let score = 0; // Inicializa a pontuação

// Imagens
const startScreenImage = new Image();
startScreenImage.src = ''; 

let gameStarted = false;

const playerImage = new Image();
playerImage.src = '/static/resources/images/elementos_graficos/naves.png';

const enemyImage = new Image();
enemyImage.src = '/static/resources/images/elementos_graficos/inimigo.png';

const bulletImage = new Image();
bulletImage.src = '/static/resources/images/elementos_graficos/tiro.png';

const enemyBulletImage = new Image();
enemyBulletImage.src = '/static/resources/images/elementos_graficos/tiro2.png';

const explosionImage = new Image();
explosionImage.src = '/static/resources/images/elementos_graficos/explosion.gif';

const victoryImage = new Image();
victoryImage.src = '/static/resources/images/ziggy/cutie.png';

const defeatImage = new Image();
defeatImage.src = '/static/resources/images/ziggy/cutie.png';

let explosions = [];

// Jogador
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    dx: 0
};

function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar o PNG no centro do canvas
    const imageX = (canvas.width / 2) - (startScreenImage.width / 2);
    const imageY = (canvas.height / 2) - (startScreenImage.height / 2) - 50; // Ajuste a posição vertical se necessário
    
    ctx.drawImage(startScreenImage, imageX, imageY);
    
    // Texto para instruir o jogador a começar o jogo
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Pressione Enter para jogar", canvas.width / 2, canvas.height / 2 + 100);
}

function startGame() {
    gameStarted = true;
    // Começar o jogo, reiniciar variáveis, etc.
    initGame();
}

// Cria inimigos
function createEnemies(rows, cols) {
    enemies = [];
    const enemyWidth = 40; // Ajuste para o tamanho da imagem
    const enemyHeight = 30; // Ajuste para o tamanho da imagem

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: col * (enemyWidth + 10) + 50, // Ajuste o espaçamento
                y: row * (enemyHeight + 10) + 30, // Ajuste o espaçamento
                width: enemyWidth,
                height: enemyHeight,
                alive: true
            });
        }
    }
}

// Cria barreiras
function createBarriers() {
    const barrierWidth = 80; // Aumente a largura da barreira
    const barrierHeight = 20;
    const spaceBetween = 50; // Aumente o espaçamento entre as barreiras
    const totalBarriers = 4;
    const startX = (canvas.width - (totalBarriers * (barrierWidth + spaceBetween))) / 2;

    barriers = [];
    for (let i = 0; i < totalBarriers; i++) {
        barriers.push({
            x: startX + i * (barrierWidth + spaceBetween),
            y: canvas.height - 150,
            width: barrierWidth,
            height: barrierHeight,
            vida: 20 // Defina o número de pontos de vida para cada barreira
        });
    }
}

// Desenha o jogador
function drawPlayer() {
    // Verifica se a imagem foi carregada antes de desenhar
    if (playerImage.complete) {
        // Ajusta o tamanho da imagem do jogador, se necessário
        const playerWidth = 50;  // Ajuste conforme o tamanho da imagem
        const playerHeight = 50; // Ajuste conforme o tamanho da imagem
        
        // Desenha um flash vermelho se o jogador estiver levando dano
        if (isTakingDamage) {
            const now = Date.now();
            const alpha = Math.max(0, (damageFlashEndTime - now) / DAMAGE_FLASH_DURATION);
            ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`; // Vermelho com transparência
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }

        // Desenha a imagem do jogador na posição correta
        ctx.drawImage(playerImage, player.x, player.y, playerWidth, playerHeight);
    } else {
        // Caso a imagem não tenha carregado, pode desenhar um retângulo provisório
        ctx.fillStyle = "white";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

// Desenha os inimigos
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.alive) {
            // Verifica se a imagem foi carregada antes de desenhar
            if (enemyImage.complete) {
                // Ajuste o tamanho da imagem conforme necessário
                const enemyWidth = 60;  // Pode ajustar conforme a imagem
                const enemyHeight = 50; // Pode ajustar conforme a imagem

                // Desenha a imagem do inimigo na posição correta
                ctx.drawImage(enemyImage, enemy.x, enemy.y, enemyWidth, enemyHeight);
            } else {
                // Caso a imagem não tenha carregado, pode desenhar um retângulo provisório
                ctx.fillStyle = "red";
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        }
    });
}

// Desenha as barreiras
function drawBarriers() {
    barriers.forEach(barrier => {
        if (barrier.vida > 0) {
            // Calcula o valor da transparência com base na vida restante
            const alpha = barrier.vida / 25; // Ajuste conforme o número máximo de vidas
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`; // Verde com transparência
        } else {
            ctx.fillStyle = "rgba(0, 0, 0, 0)"; // Totalmente transparente
        }
        ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
    });
}

// Desenha o HUD
function drawHUD() {
    const elapsedTime = isPaused ? pauseStartTime - startTime : Date.now() - startTime;
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Tempo: ${Math.floor(elapsedTime / 1000)} s`, 10, 30);
    
    drawScore();  // Adiciona a pontuação ao HUD

    // Desenha as vidas restantes
    ctx.textAlign = "right";
    ctx.fillText(`Vidas: ${playerLives}`, canvas.width - 10, 30);
}

// Movimenta os inimigos
function moveEnemies() {
    if (Date.now() - lastEnemyMoveTime > 200) {
        let hitEdge = false;
        enemies.forEach(enemy => {
            if (enemy.alive) {
                enemy.x += enemyDirection * enemySpeed;
                if (enemy.x + enemy.width > canvas.width || enemy.x < 0) {
                    hitEdge = true;
                }
            }
        });
        if (hitEdge) {
            enemyDirection *= -1;
            enemies.forEach(enemy => {
                if (enemy.alive) {
                    enemy.y += 20; 
                }
            });
        }
        lastEnemyMoveTime = Date.now();
    }
}

// Desenha e move os tiros do jogador
function handleBulletCollisionWithEnemies(bullets, enemies) {
    bullets.forEach((bullet, index) => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        // Remove se sair da tela
        if (bullet.y < 0) bullets.splice(index, 1);

        // Verifica colisão com inimigos
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y &&
                enemy.alive
            ) {
                enemy.alive = false;  // Mata o inimigo
                bullets.splice(index, 1);  // Remove a bala
                
                score += 100; // Incrementa a pontuação (100 pontos por inimigo morto)

                // Adiciona uma explosão
                explosions.push({
                    x: enemy.x,
                    y: enemy.y,
                    width: 50,
                    height: 50,
                    startTime: Date.now(),
                    lifetime: 500
                });
            }
        });

        // Verifica colisão com barreiras
        barriers.forEach(barrier => {
            if (
                bullet.x < barrier.x + barrier.width &&
                bullet.x + bullet.width > barrier.x &&
                bullet.y < barrier.y + barrier.height &&
                bullet.y + bullet.height > barrier.y
            ) {
                bullets.splice(index, 1);
            }
        });
    });
}

// Desenha e move os tiros do jogador
function drawBullets() {
    handleBulletCollisionWithEnemies(bullets, enemies);
}

// Desenha e move os tiros dos inimigos
function drawEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        // Usa a imagem para desenhar a bala dos inimigos
        ctx.drawImage(enemyBulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y += enemyBulletSpeed;

        // Remove se sair da tela
        if (bullet.y > canvas.height) enemyBullets.splice(index, 1);

        // Verifica colisão com barreiras
        barriers.forEach((barrier, barrierIndex) => {
            if (
                bullet.x < barrier.x + barrier.width &&
                bullet.x + bullet.width > barrier.x &&
                bullet.y < barrier.y + barrier.height &&
                bullet.y + bullet.height > barrier.y
            ) {
                barrier.vida -= 1; // Reduz a vida da barreira
                enemyBullets.splice(index, 1); // Remove a bala

                // Remove a barreira se a vida chegar a zero
                if (barrier.vida <= 0) {
                    barriers.splice(barrierIndex, 1);
                }
            }
        });

        // Verifica colisão com o jogador
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            // Deixa o jogador levar dano e verifica se deve acabar o jogo
            playerLives -= 1;
            isTakingDamage = true;
            damageFlashEndTime = Date.now() + DAMAGE_FLASH_DURATION;
            
            // Verifica se o jogador deve morrer
            if (playerLives <= 0) {
                isGameOver = true;
            }
            enemyBullets.splice(index, 1);
        }
    });
}

// Desenha as explosões
function drawExplosions() {
    const now = Date.now();
    explosions.forEach((explosion, index) => {
        if (now - explosion.startTime < explosion.lifetime) {
            ctx.drawImage(explosionImage, explosion.x, explosion.y, explosion.width, explosion.height);
        } else {
            explosions.splice(index, 1); // Remove a explosão depois do tempo de vida
        }
    });
}

// Função de tiro do jogador
function shoot() {
    if (Date.now() - lastPlayerShootTime > playerShootInterval) {
        bullets.push({ x: player.x + player.width / 2 - 10, y: player.y, width: 15, height: 30, speed: 14 }); // Ajuste o tamanho da munição conforme necessário
        lastPlayerShootTime = Date.now();
        
    }
}

// Função de tiro dos inimigos
function shootEnemies() {
    if (Date.now() - lastEnemyShootTime > enemyShootInterval) {
        const shootingEnemies = enemies.filter(enemy => enemy.alive && Math.random() < 0.05);
        shootingEnemies.forEach(enemy => {
            enemyBullets.push({
                x: enemy.x + enemy.width / 2 - 2,
                y: enemy.y + enemy.height,
                width: 10,
                height: 30,
                speed: enemyBulletSpeed
            });
        });
        lastEnemyShootTime = Date.now();
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Pontuação: ${score}`, 10, 60);  // Exibe a pontuação no HUD
}

// Verifica se o jogador perdeu
function checkGameOver() {
    enemies.forEach(enemy => {
        if (enemy.alive && enemy.y + enemy.height >= player.y) {
            isGameOver = true;
        }
    });
}

// Verifica se o jogador venceu
function checkVictory() {
    if (enemies.every(enemy => !enemy.alive)) {
        isVictory = true;
    }
}

// Reiniciar o jogo
function restartGame() {
    isGameOver = false;
    isPaused = false;
    isVictory = false;
    playerLives = 3; // Reseta as vidas do jogador
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 60;
    createEnemies(5, 10);
    createBarriers();
    bullets = [];
    enemyBullets = [];
    startTime = Date.now();
}

// Controle do jogador

let pauseStartTime = 0; // Armazena o tempo quando o jogo é pausado

document.addEventListener("keydown", e => {
    if (e.code === "ArrowLeft") player.dx = -playerSpeed;
    if (e.code === "ArrowRight") player.dx = playerSpeed;
    if (e.code === "KeyF") shoot();
    if (e.code === "KeyR" && (isGameOver || isVictory)) restartGame();
    if (e.code === "Escape") {
        if (isPaused) {
            // Quando o jogo é retomado, atualize o tempo de início
            startTime += Date.now() - pauseStartTime;
        } else {
            // Quando o jogo é pausado, armazene o tempo de pausa
            pauseStartTime = Date.now();
        }
        isPaused = !isPaused;
    }
});
document.addEventListener("keyup", e => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") player.dx = 0;
});
// Adiciona o listener para teclas
document.addEventListener('keydown', (event) => {
    if (event.key === 'f') { // Se 'f' for a tecla de disparo
        shoot();
    }
});
// Detectar o pressionamento da tecla Enter para iniciar o jogo
window.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !gameStarted) {
        startGame();
    }
});


// Atualiza a posição do jogador com movimento suave
function updatePlayer() {
    if (!isGameOver && !isVictory) {
        player.x += player.dx;

        // Limita a posição do jogador
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }
}

// Função principal do jogo
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Exibe a tela de "jogar" se o jogo ainda não começou
    if (!gameStarted) {
        showStartScreen(); // Mostra a tela inicial com o PNG
    } else if (!isPaused) {
        if (!isGameOver && !isVictory) {
            updatePlayer();
            moveEnemies();
            shootEnemies();
            drawPlayer();
            drawEnemies();
            drawBarriers();
            drawBullets();
            drawEnemyBullets();
            drawExplosions();
            checkGameOver();
            checkVictory();
        }
        drawHUD();
    }

    if (isGameOver) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Verifica se a imagem foi carregada
        if (defeatImage.complete) {
            ctx.drawImage(defeatImage, 0, 0, canvas.width, canvas.height);
        }
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Centraliza verticalmente
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Pressione R para reiniciar", canvas.width / 2, canvas.height / 2 + 40);
        
        ctx.fillText(`Pontuação total: ${score}`, canvas.width / 2, canvas.height / 2 + 100);
    } else if (isVictory) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (victoryImage.complete) {
            ctx.drawImage(victoryImage, 0, 0, canvas.width, canvas.height);
        }

        // Ajusta o texto da tela de vitória
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Centraliza verticalmente
        ctx.fillText("Vitória!", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Pressione R para jogar novamente", canvas.width / 2, canvas.height / 2 + 40);

        ctx.fillText(`Pontuação final: ${score}`, canvas.width / 2, canvas.height / 2 + 100);
    } else if (isPaused) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Centraliza verticalmente
        ctx.fillText("Pausado", canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
}

createEnemies(5, 10);
createBa