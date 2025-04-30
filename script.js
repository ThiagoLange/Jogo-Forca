// --- Elementos do DOM ---
const wordDisplayEl = document.getElementById('word-display');
const wrongLettersListEl = document.getElementById('wrong-letters-list');
const instructionsEl = document.getElementById('instructions');
// Adicione aqui outros elementos se precisar (ex: tentativas, mensagens)
// const attemptsLeftEl = document.getElementById('attempts-left');
// const messageEl = document.getElementById('message');

// --- Estado do Jogo ---
// Lista de palavras possíveis (adicione mais!)
const palavras = ["JAVASCRIPT", "PROGRAMADOR", "DESAFIO", "COMPUTADOR", "ALGORITMO", "INTERFACE", "DESIGN", "HTML", "CSS", "APLICATIVO", "DIVERTIDO", "APRENDIZAGEM",
                  "EXERCICIO", "DESENVOLVIMENTO", "TECNOLOGIA", "INOVACAO", "SISTEMA", "FUNCIONALIDADE", "USUARIO", "INTERATIVO", "DINAMICO", "PROJETO", "CONECTIVIDADE", 
                  "PLATAFORMA", "RECURSO", "APLICACAO", "INTERFACE", "DESIGNER", "PROGRAMACAO", "SCRIPT", "DEBUGGING", "COMPILADOR", "EXECUCAO", "VARIAVEL", "FUNCAO",
                  "OBJETO", "CLASSE", "HERANCA"];

// Escolhe uma palavra aleatória da lista
let palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];

let letrasCorretas = []; // Array para guardar as letras corretas adivinhadas
let letrasErradas = [];  // Array para guardar as letras erradas
let jogoAtivo = true;   // Flag para controlar se o jogo ainda está rodando

// --- Funções ---

/**
 * Atualiza a exibição da palavra na tela, mostrando letras corretas
 * e underscores para as letras não adivinhadas.
 */
function exibirPalavra() {
    wordDisplayEl.innerHTML = ''; // Limpa a exibição anterior
    palavraSecreta.split('').forEach(letra => {
        // Cria um span para cada letra/underscore para estilização individual
        const spanLetra = document.createElement('span');
        spanLetra.classList.add('letter'); // Adiciona a classe CSS .letter

        if (letrasCorretas.includes(letra)) {
            spanLetra.textContent = letra; // Mostra a letra correta
        } else {
            spanLetra.textContent = '_'; // Mostra underscore
        }
        wordDisplayEl.appendChild(spanLetra);
    });

    // Verifica condição de vitória
    verificarVitoria();
}

/**
 * Atualiza a lista de letras erradas exibida na tela.
 */
function exibirLetrasErradas() {
    wrongLettersListEl.textContent = letrasErradas.join(', '); // Junta as letras com vírgula
    // (Opcional) Atualizar a exibição de tentativas restantes aqui
    // attemptsLeftEl.textContent = `Tentativas restantes: ${MAX_TENTATIVAS - letrasErradas.length}`;

    // (Opcional) Atualizar o desenho da forca aqui

    // Verifica condição de derrota
    verificarDerrota();
}

/**
 * Processa a letra digitada pelo usuário.
 * @param {string} letra - A letra digitada (já convertida para maiúscula).
 */
function processarLetra(letra) {
    // 1. Verifica se é uma letra válida (A-Z)
    if (!letra.match(/^[A-Z]$/)) {
        console.warn(`Input inválido: "${letra}". Esperando uma letra de A-Z.`);
        return; // Ignora se não for uma letra
    }

    // 2. Verifica se a letra já foi tentada (correta ou errada)
    if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) {
        // (Opcional) Mostrar uma mensagem que a letra já foi tentada
        console.log(`Letra "${letra}" já tentada.`);
        mostrarMensagemTemporaria(`Letra "${letra}" já foi tentada!`);
        return;
    }

    // 3. Verifica se a letra está na palavra secreta
    if (palavraSecreta.includes(letra)) {
        letrasCorretas.push(letra); // Adiciona às corretas
        exibirPalavra(); // Atualiza a exibição da palavra
    } else {
        letrasErradas.push(letra); // Adiciona às erradas
        exibirLetrasErradas(); // Atualiza a exibição das erradas
    }
}

/**
 * Verifica se o jogador ganhou o jogo.
 */
function verificarVitoria() {
    // Ganha se todas as letras da palavra secreta estão no array de letrasCorretas
    const palavraRevelada = palavraSecreta.split('').every(letra => letrasCorretas.includes(letra));

    if (palavraRevelada && jogoAtivo) {
        mostrarMensagem("Parabéns! Você venceu!", "win");
        jogoAtivo = false; // Termina o jogo
    }
}

/**
 * Verifica se o jogador perdeu o jogo (implementação básica).
 * Você precisará definir um número máximo de tentativas.
 */
function verificarDerrota() {
    const MAX_TENTATIVAS = 6; // Exemplo: Limite de 6 erros
    if (letrasErradas.length >= MAX_TENTATIVAS && jogoAtivo) {
        mostrarMensagem(`Você perdeu! A palavra era: ${palavraSecreta}`, "lose");
        jogoAtivo = false; // Termina o jogo
    }
}

/**
 * Exibe uma mensagem temporária na área de instruções.
 * @param {string} texto - A mensagem a ser exibida.
 * @param {number} duracaoMs - Quanto tempo a mensagem fica visível (em milissegundos).
 */
function mostrarMensagemTemporaria(texto, duracaoMs = 1500) {
    const originalText = instructionsEl.textContent;
    instructionsEl.textContent = texto;
    instructionsEl.style.color = '#e74c3c'; // Cor de aviso
    instructionsEl.style.fontWeight = 'bold';

    setTimeout(() => {
        instructionsEl.textContent = originalText;
        instructionsEl.style.color = ''; // Volta à cor original do CSS
        instructionsEl.style.fontWeight = '';
    }, duracaoMs);
}

/**
* Exibe uma mensagem final de vitória ou derrota.
* @param {string} texto - A mensagem a ser exibida.
* @param {string} classeCss - 'win' ou 'lose' para estilização.
*/
function mostrarMensagem(texto, classeCss) {
   // Reutiliza o elemento de instruções ou cria um novo elemento de mensagem
   instructionsEl.textContent = texto;
   instructionsEl.className = classeCss; // Aplica a classe win ou lose
   instructionsEl.style.fontWeight = 'bold';
}

// --- Event Listener ---

// Adiciona um ouvinte de eventos para capturar teclas pressionadas
window.addEventListener('keydown', (event) => {
    // Verifica se o jogo ainda está ativo
    if (!jogoAtivo) {
        console.log("Jogo terminado. Nenhuma letra será processada.");
        return; // Não faz nada se o jogo acabou
    }

    const letraPressionada = event.key.toUpperCase(); // Pega a tecla e converte para maiúscula
    console.log("Tecla pressionada:", event.key, "-> Processando como:", letraPressionada); // Para depuração

    processarLetra(letraPressionada); // Chama a função para processar a letra
});

// --- Inicialização do Jogo ---
console.log("Palavra Secreta:", palavraSecreta); // Para depuração inicial
exibirPalavra(); // Exibe a palavra com underscores no início
// exibirLetrasErradas(); // (Opcional) Exibe a área de letras erradas vazia