document.addEventListener('DOMContentLoaded', function () {
    const verificarBtn = document.getElementById('verificar-sudoku');
    const salvarJogoBtn = document.getElementById('salvar-jogo');
    const novoJogoBtn = document.getElementById('novo-jogo');
    const regrasBtn = document.getElementById('regras-btn');
    const modal = document.getElementById('regras-modal');
    const span = document.getElementsByClassName('close')[0];
    const container = document.querySelector('.sudoku-grid'); // Contêiner da tabela

    // Inicialmente esconde os botões de "Salvar Jogo" e "Verificar Sudoku"
    esconderBotoes();

    // Verifica se há um jogo salvo
    if (jogoIniciado()) {
        restaurarEstadoSudoku(); // Restaura o estado do jogo salvo
        mostrarBotoes(); // Mostra os botões de "Salvar" e "Verificar"
    } else {
        // Esconde a tabela até que o botão "Novo Jogo" seja clicado
        container.style.display = 'none'; 
        novoJogoBtn.style.display = 'inline-block'; // Mostra o botão "Novo Jogo"
    }

    // Evento de salvar o jogo
    salvarJogoBtn.addEventListener('click', function () {
        salvarEstadoSudoku(); // Salva o jogo
        alert("Jogo salvo com sucesso!");
    });

    // Evento para verificar o Sudoku
    verificarBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Evita a atualização da página
        verificarSudoku(); // Chama a função de validação
    });

    // Evento para gerar um novo jogo
    novoJogoBtn.addEventListener('click', function () {
        localStorage.removeItem('estadoSudoku'); // Limpa o jogo anterior
        gerarTabuleiroSudoku(); // Gera um novo tabuleiro
        container.style.display = 'block'; // Exibe a tabela de Sudoku
        mostrarBotoes(); // Mostrar os botões após criar o tabuleiro
    });

    // Modal de regras
    regrasBtn.onclick = function () {
        modal.classList.add('show'); // Abre o modal de regras
    };

    span.onclick = function () {
        modal.classList.remove('show'); // Fecha o modal de regras
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.classList.remove('show'); // Fecha o modal se clicar fora dele
        }
    };
    // Se houver um jogo salvo, restaura o estado
       if (jogoIniciado()) {
        restaurarEstadoSudoku(); // Restaura o estado do jogo salvo
        mostrarBotoes(); // Mostrar os botões de salvar e verificar
    } else {
        gerarTabuleiroSudoku(); // Gera um novo tabuleiro na inicialização se não houver jogo salvo
    }
});

    
 
// Função para gerar a solução completa do Sudoku
function gerarSolucaoSudoku(grid, row, col) {
    // Se completou todas as linhas
    if (row === 9) return true;

    // Se chegou ao final da linha, passa para a próxima
    if (col === 9) return gerarSolucaoSudoku(grid, row + 1, 0);

    // Se a célula já está preenchida, passa para a próxima
    if (grid[row][col] !== 0) return gerarSolucaoSudoku(grid, row, col + 1);

    // Tenta inserir números de 1 a 9 aleatoriamente
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

    for (let num of numeros) {
        if (podeInserirNumero(grid, row, col, num)) {
            grid[row][col] = num;

            if (gerarSolucaoSudoku(grid, row, col + 1)) return true;

            grid[row][col] = 0; // Se não for válido, desfaz a inserção
        }
    }

    return false; // Retorna falso se não puder preencher a célula
}

// Função para remover números do tabuleiro
function removerNumeros(grid, quantidade) {
    let count = 0;

    while (count < quantidade) {
        const randomRow = Math.floor(Math.random() * 9);
        const randomCol = Math.floor(Math.random() * 9);

        if (grid[randomRow][randomCol] !== 0) {
            grid[randomRow][randomCol] = 0;
            count++;
        }
    }
}

// Função para gerar o tabuleiro de Sudoku e exibir na tela
function gerarTabuleiroSudoku() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    // Gera a solução completa
    gerarSolucaoSudoku(grid, 0, 0);

    // Remove números para criar o desafio
    removerNumeros(grid, 40);

    // Preenche o tabuleiro na interface
    preencherTabuleiroSudoku(grid);
}

// Função para preencher o tabuleiro na interface
function preencherTabuleiroSudoku(grid) {
    const container = document.querySelector('.sudoku-grid');
    container.innerHTML = ''; // Limpa o tabuleiro anterior

    const table = document.createElement('table');

    // Preenche o tabuleiro com o grid gerado
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1'; // Limita para apenas um número
            input.classList.add('sudoku-input');

            const valor = grid[i][j];
            if (valor !== 0) {
                input.value = valor;
                input.disabled = true; // Bloqueia a célula predefinida
                input.classList.add('numero-gerado');
            }

            // Restringir para entrada apenas de números
            input.addEventListener('input', function (e) {
                if (!/^[1-9]$/.test(e.target.value)) {
                    e.target.value = ''; // Limpa o valor se não for de 1 a 9
                }
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    container.appendChild(table);
}

// Verificar se o número pode ser inserido na posição
function podeInserirNumero(grid, row, col, num) {
    return (
        verificarLinha(grid, row, num) &&
        verificarColuna(grid, col, num) &&
        verificarQuadrado(grid, row, col, num)
    );
}

function verificarLinha(grid, row, num) {
    return !grid[row].includes(num);
}

function verificarColuna(grid, col, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num) {
            return false;
        }
    }
    return true;
}

function verificarQuadrado(grid, row, col, num) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Função para verificar o Sudoku
function verificarSudoku() {
    const inputs = document.querySelectorAll('.sudoku-input');
    let correto = true;

    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    inputs.forEach((input, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;

        if (input.value === '') {
            correto = false; // Células vazias
        } else {
            grid[row][col] = parseInt(input.value);
        }
    });

    // Verifica se a solução gerada é válida
    if (correto && gerarSolucaoSudoku(grid)) {
        alert('Parabéns! Você completou o Sudoku corretamente!');
    } else {
        alert('Existem erros ou células vazias.');
    }
}

// Função para salvar o estado do jogo
function salvarEstadoSudoku() {
    const inputs = document.querySelectorAll('.sudoku-input');
    const estadoJogo = [];

    inputs.forEach(input => {
        estadoJogo.push({
            value: input.value,
            disabled: input.disabled
        });
    });

    localStorage.setItem('estadoSudoku', JSON.stringify(estadoJogo));
}

// Função para restaurar o estado do jogo salvo
function restaurarEstadoSudoku() {
    const estadoJogo = JSON.parse(localStorage.getItem('estadoSudoku'));

    if (estadoJogo) {
        const container = document.querySelector('.sudoku-grid');
        container.innerHTML = ''; // Limpa o tabuleiro anterior
        const table = document.createElement('table');

        for (let i = 0; i < 9; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.classList.add('sudoku-input');

                const index = i * 9 + j;
                input.value = estadoJogo[index].value;
                input.disabled = estadoJogo[index].disabled;

                if (input.disabled) {
                    input.classList.add('numero-gerado');
                }

                cell.appendChild(input);
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        container.appendChild(table);
    }
}

// Função para verificar se há um jogo salvo
function jogoIniciado() {
    return localStorage.getItem('estadoSudoku') !== null;
}

// Função para esconder os botões
function esconderBotoes() {
    document.getElementById('salvar-jogo').style.display = 'none';
    document.getElementById('verificar-sudoku').style.display = 'none';
}

// Função para mostrar os botões
function mostrarBotoes() {
    document.getElementById('salvar-jogo').style.display = 'inline-block';
    document.getElementById('verificar-sudoku').style.display = 'inline-block';
}
// Função para gerar o tabuleiro completo (solução do Sudoku)
function gerarSolucaoSudoku(grid, row, col) {
    // Se completou todas as linhas
    if (row === 9) return true;

    // Se chegou ao final da linha, passa para a próxima
    if (col === 9) return gerarSolucaoSudoku(grid, row + 1, 0);

    // Se a célula já está preenchida, passa para a próxima
    if (grid[row][col] !== 0) return gerarSolucaoSudoku(grid, row, col + 1);

    // Tenta inserir números de 1 a 9 aleatoriamente
    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

    for (let num of numeros) {
        if (podeInserirNumero(grid, row, col, num)) {
            grid[row][col] = num;

            if (gerarSolucaoSudoku(grid, row, col + 1)) return true;

            grid[row][col] = 0; // Se não for válido, desfaz a inserção
        }
    }

    return false; // Retorna falso se não puder preencher a célula
}

// Função para remover números do tabuleiro
function removerNumeros(grid, quantidade) {
    let count = 0;

    while (count < quantidade) {
        const randomRow = Math.floor(Math.random() * 9);
        const randomCol = Math.floor(Math.random() * 9);

        if (grid[randomRow][randomCol] !== 0) {
            grid[randomRow][randomCol] = 0;
            count++;
        }
    }
}

// Função para gerar um novo jogo de Sudoku
function gerarNovoJogo() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));

    // Gera a solução completa
    gerarSolucaoSudoku(grid, 0, 0);

    // Mostra o tabuleiro completo no console
    console.log("Tabuleiro completo (solução):");
    console.table(grid);

    // Remove números para criar o desafio
    removerNumeros(grid, 40); // Remove 40 números (pode ajustar essa quantidade)

    // Mostra o tabuleiro modificado (incompleto) no console
    console.log("Tabuleiro incompleto (jogo gerado):");
    console.table(grid);

    return grid;
}

// Exemplo de uso
document.addEventListener('DOMContentLoaded', function () {
    gerarNovoJogo();
});
