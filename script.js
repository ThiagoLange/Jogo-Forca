// --- Elementos do DOM ---
const wordDisplayEl = document.getElementById('word-display');
const wrongLettersListEl = document.getElementById('wrong-letters-list');
const instructionsEl = document.getElementById('instructions');
const restartButton = document.getElementById('restart-button'); // SELECIONA O BOTÃO

// --- Estado do Jogo ---
const palavras = ["JAVASCRIPT", "PROGRAMADOR", "DESAFIO", "COMPUTADOR", "ALGORITMO", "INTERFACE", "FRONTEND", "BACKEND"];
let palavraSecreta; // Será definida no início e ao reiniciar
let letrasCorretas;
let letrasErradas;
let jogoAtivo;
let textoInstrucaoOriginal = instructionsEl.textContent; // Guarda o texto original

// --- Funções ---

/**
 * Atualiza a exibição da palavra na tela...
 */
function exibirPalavra() {
    wordDisplayEl.innerHTML = ''; // Limpa a exibição anterior
    palavraSecreta.split('').forEach(letra => {
        const spanLetra = document.createElement('span');
        spanLetra.classList.add('letter');

        if (letrasCorretas.includes(letra)) {
            spanLetra.textContent = letra;
        } else {
            spanLetra.textContent = '_';
        }
        wordDisplayEl.appendChild(spanLetra);
    });

    // Verifica condição de vitória APÓS atualizar a exibição
     if (jogoAtivo) { // Só verifica vitória se o jogo ainda está ativo
         verificarVitoria();
     }
}

/**
 * Atualiza a lista de letras erradas exibida na tela.
 */
function exibirLetrasErradas() {
    wrongLettersListEl.textContent = letrasErradas.join(', ');

    // Verifica condição de derrota APÓS atualizar a exibição
    if (jogoAtivo) { // Só verifica derrota se o jogo ainda está ativo
        verificarDerrota();
    }
}

/**
 * Processa a letra digitada pelo usuário...
 */
function processarLetra(letra) {
    // Só processa se o jogo estiver ativo
    if (!jogoAtivo) return;

    if (!letra.match(/^[A-Z]$/)) {
        // console.warn(`Input inválido: "${letra}". Esperando uma letra de A-Z.`);
        return; // Ignora silenciosamente ou mostra mensagem temporária
    }

    if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) {
        mostrarMensagemTemporaria(`Letra "${letra}" já foi tentada!`);
        return;
    }

    if (palavraSecreta.includes(letra)) {
        letrasCorretas.push(letra);
        exibirPalavra(); // Atualiza a palavra (que vai chamar verificarVitoria)
    } else {
        letrasErradas.push(letra);
        exibirLetrasErradas(); // Atualiza letras erradas (que vai chamar verificarDerrota)
    }
}

/**
 * Verifica se o jogador ganhou o jogo.
 */
function verificarVitoria() {
    // Ganha se todas as letras ÚNICAS da palavra secreta estão no array de letrasCorretas
    // Usar Set para pegar letras únicas e evitar problemas com letras repetidas na palavra
    const letrasUnicasPalavra = [...new Set(palavraSecreta.split(''))];
    const ganhou = letrasUnicasPalavra.every(letra => letrasCorretas.includes(letra));

    if (ganhou) {
        mostrarMensagem(`Parabéns! Você venceu! 🎉 A palavra era: ${palavraSecreta}`, "win");
        jogoAtivo = false;
    }
}

/**
 * Verifica se o jogador perdeu o jogo.
 */
function verificarDerrota() {
    const MAX_TENTATIVAS = 6;
    if (letrasErradas.length >= MAX_TENTATIVAS) {
        mostrarMensagem(`Você perdeu! 😢 A palavra era: ${palavraSecreta}`, "lose");
        jogoAtivo = false;
    }
}

/**
 * Exibe uma mensagem temporária na área de instruções.
 */
function mostrarMensagemTemporaria(texto, duracaoMs = 1500) {
    // Só mostra se o jogo estiver ativo e não houver mensagem final
    if (!jogoAtivo || instructionsEl.classList.contains('win') || instructionsEl.classList.contains('lose')) {
        return;
    }

    const originalText = textoInstrucaoOriginal; // Usa o texto original guardado
    instructionsEl.textContent = texto;
    instructionsEl.style.color = '#e74c3c';
    instructionsEl.style.fontWeight = 'bold';

    setTimeout(() => {
        // Só restaura se ainda for a mensagem temporária (evita sobrescrever msg final)
        if (instructionsEl.textContent === texto) {
            instructionsEl.textContent = originalText;
            instructionsEl.style.color = ''; // Volta à cor original do CSS
            instructionsEl.style.fontWeight = '';
        }
    }, duracaoMs);
}

/**
* Exibe uma mensagem final de vitória ou derrota.
*/
function mostrarMensagem(texto, classeCss) {
   instructionsEl.textContent = texto;
   // Remove classes anteriores e adiciona a nova
   instructionsEl.classList.remove('win', 'lose');
   instructionsEl.classList.add(classeCss);
   instructionsEl.style.fontWeight = 'bold'; // Mantém o negrito para mensagens finais
   instructionsEl.style.color = ''; // Deixa o CSS da classe definir a cor
}

/**
 * Reinicia o estado do jogo para uma nova partida.
 */
function reiniciarJogo() {
    console.log("Reiniciando o jogo..."); // Log para depuração

    // 1. Reseta as variáveis de estado
    letrasCorretas = [];
    letrasErradas = [];
    jogoAtivo = true;

    // 2. Escolhe uma nova palavra secreta
    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    console.log("Nova Palavra Secreta:", palavraSecreta); // Log para depuração

    // 3. Limpa as mensagens e restaura instruções originais
    instructionsEl.textContent = textoInstrucaoOriginal; // Volta o texto inicial
    instructionsEl.classList.remove('win', 'lose'); // Remove classes de vitória/derrota
    instructionsEl.style.fontWeight = ''; // Remove negrito se houver
    instructionsEl.style.color = ''; // Remove cor específica

    // 4. Atualiza a interface gráfica
    exibirPalavra(); // Mostra os underscores da nova palavra
    exibirLetrasErradas(); // Limpa a lista de letras erradas

    // (Opcional) Resetar o desenho da forca aqui, se implementado
}

// --- Event Listeners ---

// Listener para teclas pressionadas
window.addEventListener('keydown', (event) => {
    if (!jogoAtivo) {
        return; // Não faz nada se o jogo acabou
    }
    const letraPressionada = event.key.toUpperCase();
    processarLetra(letraPressionada);
});

// Listener para o botão de reiniciar
restartButton.addEventListener('click', reiniciarJogo); // CHAMA A FUNÇÃO DE REINÍCIO

// --- Inicialização do Jogo ---
reiniciarJogo(); // Chama reiniciarJogo para configurar o estado inicial na primeira vez