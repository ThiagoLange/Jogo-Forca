// --- Elementos do DOM ---
// Telas
const loginScreenEl = document.getElementById('login-screen');
const gameScreenEl = document.getElementById('game-screen');

// Elementos do Login
const playerNameInput = document.getElementById('player-name-input');
const startGameButton = document.getElementById('start-game-button');
const loginMessageEl = document.getElementById('login-message');

// Elementos do Jogo
const wordDisplayEl = document.getElementById('word-display');
const wrongLettersListEl = document.getElementById('wrong-letters-list');
const instructionsEl = document.getElementById('instructions');
const restartButton = document.getElementById('restart-button');
const bodyParts = document.querySelectorAll('.hangman-part'); // Pega TODOS os elementos SVG com a classe
const playerGreetingEl = document.getElementById('player-greeting'); // Opcional para saudação
// SELECIONA AS PARTES DO CORPO DA FORCA

const palavras = [
    "JAVASCRIPT",
    "PROGRAMADOR",
    "DESAFIO",
    "COMPUTADOR",
    "ALGORITMO",
    "INTERFACE",
    "FRONTEND",
    "BACKEND",
    "DEBUGGING",
    "VARIAVEL",
    "FUNCAO",
    "CLASSE",
    "OBJETO",
    "METODO",
    "SERVIDOR",
    "CLIENTE",
    "BANCODEDADOS",
    "REPOSITORIO",
    "FRAMEWORK", 
    "BIBLIOTECA",  
    "COMPILAR",   
    "INTERPRETAR",
    "SISTEMA",  
    "HARDWARE",
    "SOFTWARE",
    "MEMORIA",
    "PROCESSADOR",
    "NAVEGADOR",  
    "PROTOCOLO",
    "SEGURANCA"
];

let palavraSecreta; // Palavra a ser adivinhada
let letrasCorretas; // Array de letras corretas adivinhadas
let letrasErradas;  // Array de letras erradas
let jogoAtivo;      // Flag para indicar se o jogo está em andamento
let textoInstrucaoOriginal; // Armazena o texto inicial das instruções
let playerName = ''; // Nome do jogador

// --- Funções ---

/**
 * Inicia o jogo após a validação do login.
 */
function startGame() {
    playerName = playerNameInput.value.trim(); // Pega o nome e remove espaços

    if (playerName === "") {
        loginMessageEl.textContent = "Por favor, digite seu nome para iniciar!";
        loginMessageEl.style.display = 'block'; // Garante que a mensagem de erro seja visível
        return; // Interrompe se o nome estiver vazio
    }

    // Limpa mensagem de erro caso exista
    loginMessageEl.textContent = "";
    loginMessageEl.style.display = 'none';

    // Esconde tela de login, mostra tela do jogo
    loginScreenEl.style.display = 'none';
    gameScreenEl.style.display = 'block'; // Mostra a tela do jogo

    // Opcional: Exibe a saudação
    if (playerGreetingEl) {
        playerGreetingEl.textContent = `Boa sorte, ${playerName}!`;
    }

    // Guarda o texto original das instruções na primeira vez que o jogo inicia
     if (!textoInstrucaoOriginal) {
         textoInstrucaoOriginal = instructionsEl.textContent;
     }

    reiniciarJogo(); // Inicia o estado do jogo da forca
}

/**
 * Reinicia o estado do jogo para uma nova partida.
 * Chamado tanto no início (por startGame) quanto pelo botão "Jogar Novamente".
 */
function reiniciarJogo() {
    console.log("Reiniciando o jogo...");

    // 1. Reseta as variáveis de estado
    letrasCorretas = [];
    letrasErradas = [];
    jogoAtivo = true;

    // 2. Escolhe uma nova palavra secreta
    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    console.log("Nova Palavra Secreta:", palavraSecreta); // Para depuração

    // 3. Limpa as mensagens e restaura instruções originais
    if (textoInstrucaoOriginal) { // Garante que temos o texto original
        instructionsEl.textContent = textoInstrucaoOriginal;
    }
    instructionsEl.className = ''; // Limpa classes CSS (win/lose)
    instructionsEl.classList.add('message'); // Readiciona a classe base se você usar uma
    instructionsEl.style.fontWeight = '';
    instructionsEl.style.color = '';

    // 4. Atualiza a interface gráfica do jogo
    exibirPalavra(); // Mostra os underscores da nova palavra
    exibirLetrasErradas(); // Limpa lista de erradas E reseta o desenho da forca
}

/**
 * Atualiza a exibição da palavra na tela, mostrando letras corretas
 * e underscores para as letras não adivinhadas.
 */
function exibirPalavra() {
    wordDisplayEl.innerHTML = ''; // Limpa a exibição anterior
    palavraSecreta.split('').forEach(letra => {
        const spanLetra = document.createElement('span');
        spanLetra.classList.add('letter'); // Adiciona a classe CSS .letter

        if (letrasCorretas.includes(letra)) {
            spanLetra.textContent = letra; // Mostra a letra correta
        } else {
            spanLetra.textContent = '_'; // Mostra underscore
        }
        wordDisplayEl.appendChild(spanLetra);
    });

    // Verifica condição de vitória APÓS atualizar a exibição
     if (jogoAtivo) { // Só verifica vitória se o jogo ainda está ativo
         verificarVitoria();
     }
}

/**
 * Atualiza a lista de letras erradas E o desenho da forca.
 */
function exibirLetrasErradas() {
    // Atualiza a lista de texto
    wrongLettersListEl.textContent = letrasErradas.join(', ');

    // ATUALIZA O DESENHO DA FORCA
    const erros = letrasErradas.length; // Número de erros

    bodyParts.forEach((part, index) => {
        if (index < erros) {
            // Se o índice da parte for menor que o número de erros, mostra a parte
            part.classList.add('visible');
        } else {
            // Caso contrário, esconde a parte (importante para o reset)
            part.classList.remove('visible');
        }
    });

    // Verifica condição de derrota APÓS atualizar a exibição
    if (jogoAtivo) { // Só verifica derrota se o jogo ainda está ativo
        verificarDerrota();
    }
}

/**
 * Processa a letra digitada pelo usuário.
 * @param {string} letra - A letra digitada (já convertida para maiúscula).
 */
function processarLetra(letra) {
    // Só processa se o jogo estiver ativo
    if (!jogoAtivo) return;

    // 1. Verifica se é uma letra válida (A-Z) - ignora outras teclas
    if (!letra.match(/^[A-Z]$/)) {
        // console.warn(`Input inválido: "${letra}". Esperando uma letra de A-Z.`);
        return;
    }

    // 2. Verifica se a letra já foi tentada (correta ou errada)
    if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) {
        mostrarMensagemTemporaria(`Letra "${letra}" já foi tentada!`);
        return;
    }

    // 3. Verifica se a letra está na palavra secreta
    if (palavraSecreta.includes(letra)) {
        letrasCorretas.push(letra); // Adiciona às corretas
        exibirPalavra(); // Atualiza a palavra (que vai chamar verificarVitoria)
    } else {
        letrasErradas.push(letra); // Adiciona às erradas
        exibirLetrasErradas(); // Atualiza letras erradas (que vai chamar verificarDerrota e desenho)
    }
}

/**
 * Verifica se o jogador ganhou o jogo.
 */
function verificarVitoria() {
    // Ganha se todas as letras ÚNICAS da palavra secreta estão no array de letrasCorretas
    const letrasUnicasPalavra = [...new Set(palavraSecreta.split(''))];
    const ganhou = letrasUnicasPalavra.every(letra => letrasCorretas.includes(letra));

    if (ganhou) {
        mostrarMensagem(`Parabéns, ${playerName}! Você venceu! 🎉 A palavra era: ${palavraSecreta}`, "win");
        jogoAtivo = false;
    }
}

/**
 * Verifica se o jogador perdeu o jogo (baseado no número de partes do corpo).
 */
function verificarDerrota() {
    // Perde quando o número de erros é igual ou maior que o número de partes do corpo
    if (letrasErradas.length >= bodyParts.length) {
        mostrarMensagem(`Você perdeu, ${playerName}! 😢 A palavra era: ${palavraSecreta}`, "lose");
        jogoAtivo = false;
    }
}

/**
 * Exibe uma mensagem temporária na área de instruções (ex: letra repetida).
 * @param {string} texto - A mensagem a ser exibida.
 * @param {number} duracaoMs - Quanto tempo a mensagem fica visível (em milissegundos).
 */
function mostrarMensagemTemporaria(texto, duracaoMs = 1500) {
    // Só mostra se o jogo estiver ativo e não houver mensagem final de win/lose
    if (!jogoAtivo || instructionsEl.classList.contains('win') || instructionsEl.classList.contains('lose')) {
        return;
    }

    const originalText = textoInstrucaoOriginal; // Usa o texto original guardado
    instructionsEl.textContent = texto;
    instructionsEl.classList.remove('win', 'lose'); // Garante que não tenha classes de fim de jogo
    instructionsEl.classList.add('message', 'error'); // Adiciona classe de erro temporário
    instructionsEl.style.fontWeight = 'bold';

    setTimeout(() => {
        // Só restaura se ainda for a mensagem temporária (evita sobrescrever msg final)
        if (instructionsEl.textContent === texto) {
            instructionsEl.textContent = originalText;
            instructionsEl.className = 'message'; // Volta para classe base
            instructionsEl.style.fontWeight = '';
        }
    }, duracaoMs);
}

/**
* Exibe uma mensagem final de vitória ou derrota na área de instruções.
* @param {string} texto - A mensagem a ser exibida.
* @param {string} classeCss - 'win' ou 'lose' para estilização.
*/
function mostrarMensagem(texto, classeCss) { // classeCss = 'win' ou 'lose'
   instructionsEl.textContent = texto;
   instructionsEl.className = ''; // Limpa classes anteriores
   instructionsEl.classList.add('message', classeCss); // Adiciona classe base e específica (win/lose)
   instructionsEl.style.fontWeight = 'bold';
   instructionsEl.style.color = ''; // Deixa o CSS da classe definir a cor
}


// --- Event Listeners ---

// Listener do botão INICIAR JOGO (Tela de Login)
if (startGameButton) {
    startGameButton.addEventListener('click', startGame);
}

// Adiciona listener para tecla Enter no input de nome para iniciar o jogo (Tela de Login)
if (playerNameInput) {
    playerNameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') { // Código 13 foi depreciado, usar event.key
            event.preventDefault(); // Previne comportamento padrão do Enter (ex: submit de form)
            startGame();
        }
    });
}

// Listener para teclas pressionadas DURANTE O JOGO
window.addEventListener('keydown', (event) => {
    // Só processa teclas se o jogo estiver ativo E a tela do jogo estiver visível
    if (!jogoAtivo || !gameScreenEl || gameScreenEl.style.display === 'none') {
        return;
    }
    const letraPressionada = event.key.toUpperCase();
    processarLetra(letraPressionada);
});

// Listener para o botão JOGAR NOVAMENTE (Dentro da Tela do Jogo)
if (restartButton) {
    restartButton.addEventListener('click', reiniciarJogo);
}

// --- Inicialização ---
// Nenhuma função de inicialização do jogo é chamada aqui.
// O jogo só começa quando 'startGame()' é chamado pelo evento do botão ou Enter na tela de login.
// A visibilidade inicial das telas é controlada pelo HTML/CSS.
console.log("Script carregado. Aguardando início do jogo pela tela de login.");