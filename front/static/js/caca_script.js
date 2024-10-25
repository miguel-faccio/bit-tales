const gameContainer = document.getElementById('gameContainer'); // Onde o tabuleiro será gerado dinamicamente
const distanceMessage = document.getElementById('distanceMessage');
const clickCountMessage = document.getElementById('clickCountMessage'); // Nova variável para a contagem de cliques
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');

let treasureLocation;
let clicks = 0;

// Função para calcular a distância entre o clique e o tesouro
function getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

// Função para fornecer uma dica baseada na distância
function getDistanceHint(distance) {
    if (distance < 1.5) {
        return '🔥 O tesouro está queimando sob seus pés! 🔥';
    } else if (distance < 3) {
        return '🌞 Está ficando mais quente! Continue assim, o tesouro está perto! 🌞';
    } else if (distance < 6) {
        return '🌡️ Morno... Talvez tentar um pouco mais para os lados?';
    } else if (distance < 9) {
        return '❄️ Está esfriando, O tesouro está longe! ❄️';
    } else {
        return '🧊 Brrrr, está congelando! O tesouro está do outro lado!';
    }
}

// Função para criar o tabuleiro dinamicamente
function createBoard() {
    console.log("Criando o tabuleiro...");
    gameContainer.innerHTML = ''; // Limpar o container antes de criar o tabuleiro
    const gameBoard = document.createElement('div');
    gameBoard.id = 'gameBoard';
    gameBoard.style.gridTemplateColumns = 'repeat(20, 20px)'; // 20 colunas com 30px
    gameBoard.style.gridTemplateRows = 'repeat(20, 20px)'; // 20 linhas com 30px
    gameBoard.style.gap = '5px'; // Espaçamento entre os quadrados

    for (let y = 0; y < 15; y++) { // 20 linhas
        for (let x = 0; x < 15; x++) { // 20 colunas
            const square = document.createElement('div');
            square.classList.add('square');
            square.addEventListener('click', () => {
                const distance = getDistance(x, y, treasureLocation.x, treasureLocation.y);
                clicks++;
                distanceMessage.innerText = getDistanceHint(distance);
                clickCountMessage.innerText = `Cliques: ${clicks}`; // Atualiza a contagem de cliques

                // Remova animações anteriores e adicione a lógica de temperatura
                square.classList.remove('hot', 'warm', 'mild', 'cool', 'cold', 'clicked', 'found-treasure');
                square.classList.add('clicked');
                setTimeout(() => {
                    square.classList.remove('clicked');
                }, 500);

                // Atribua cores e animações com base na distância
                if (distance < 1.5) {
                    square.classList.add('hot');
                } else if (distance < 3) {
                    square.classList.add('warm');
                } else if (distance < 6) {
                    square.classList.add('mild');
                } else if (distance < 9) {
                    square.classList.add('cool');
                } else {
                    square.classList.add('cold');
                }

                // Condição de vitória
                if (distance === 0){
                    gameBoard.style.pointerEvents = 'none'; // Desativa mais cliques no tabuleiro
                    square.classList.add('found-treasure');
                    distanceMessage.innerText = getWinMessage(clicks); // Mensagem de vitória
                }
            });
            gameBoard.appendChild(square); // Adicionar o quadrado ao tabuleiro
        }
    }

    gameContainer.appendChild(gameBoard); // Adicionar o tabuleiro ao container
}

// Função para inicializar o jogo
function startGame() {
    console.log("Iniciando o jogo..."); // Log para verificar se o botão está funcionando
    treasureLocation = {
        x: Math.floor(Math.random() * 15), // Gera a posição X do tesouro
        y: Math.floor(Math.random() * 15)  // Gera a posição Y do tesouro
    };
    clicks = 0;
    distanceMessage.innerText = 'Encontre o tesouro!';
    clickCountMessage.innerText = `Cliques: ${clicks}`; // Reseta a contagem de cliques
    createBoard(); // Criar o tabuleiro dinamicamente
    startButton.style.display = 'none'; // Esconder o botão de iniciar jogo
    restartButton.style.display = 'inline-block'; // Mostrar o botão de reiniciar
}

// Função para reiniciar o jogo
function resetGame() {
    console.log("Reiniciando o jogo...");
    startGame(); // Reaproveitando a função de inicialização
}

// Inicializa o jogo ao clicar no botão de início
startButton.addEventListener('click', startGame);

// Reinicia o jogo ao clicar no botão de reiniciar
restartButton.addEventListener('click', resetGame);

// Função para fornecer a mensagem de vitória baseada nos cliques
function getWinMessage(clicks) {
    if (clicks <= 1) {
        return 'VAI COM CALMA EDUARDO~~ 🥵... EU NÃO AGUENTO TUDO ISSO NÃO~~ 😩🥵🥵🔥...';
    } else if (clicks <= 2) {
        return 'DUZENTOOOS!!!🗣🔥🔥🗣🔥🗣🔥🔥';
    } else if (clicks <= 5) {
        return '😲 Tá de hack?! 😲';
    } else if (clicks <= 10) {
        return '🤑 Você pode jogar na loteria amanhã! 🤑';
    } else if (clicks <= 15) {
            return 'Você foi bem!... mas ainda não foi o melhor 😙';
    } else if (clicks <= 25) {
        return 'Foi até que bom... mas tem como melhora 🤔';
    } else if (clicks <= 40) {
        return 'Você quer um óculos ou um cérebro novo? 😐';
    } else {
        return 'O tempo é o inimigo da perfeição... mas você é inimigo de ambos 💀...';
    }
}
