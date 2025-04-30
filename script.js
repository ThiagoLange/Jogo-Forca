// --- Elementos do DOM ---
const wordDisplayEl = document.getElementById('word-display');
const wrongLettersListEl = document.getElementById('wrong-letters-list');
const instructionsEl = document.getElementById('instructions');
const restartButton = document.getElementById('restart-button');
// SELECIONA AS PARTES DO CORPO DA FORCA
const bodyParts = document.querySelectorAll('.hangman-part'); // Pega TODOS os elementos com a classe

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

let palavraSecreta; // Será definida no início e ao reiniciar
let letrasCorretas;
let letrasErradas;
let jogoAtivo;
let textoInstrucaoOriginal = instructionsEl.textContent; // Guarda o texto original

// --- Funções ---

// (Função exibirPalavra permanece a mesma)
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

     if (jogoAtivo) {
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
    const erros = letrasErradas.length; // Número de erros é o tamanho do array

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
    if (jogoAtivo) {
        verificarDerrota();
    }
}

// (Função processarLetra permanece a mesma)
function processarLetra(letra) {
    if (!jogoAtivo) return;

    if (!letra.match(/^[A-Z]$/)) {
        return;
    }

    if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) {
        mostrarMensagemTemporaria(`Letra "${letra}" já foi tentada!`);
        return;
    }

    if (palavraSecreta.includes(letra)) {
        letrasCorretas.push(letra);
        exibirPalavra();
    } else {
        letrasErradas.push(letra);
        exibirLetrasErradas(); // Chama a função que agora também atualiza o desenho
    }
}

// (Função verificarVitoria permanece a mesma)
function verificarVitoria() {
    const letrasUnicasPalavra = [...new Set(palavraSecreta.split(''))];
    const ganhou = letrasUnicasPalavra.every(letra => letrasCorretas.includes(letra));

    if (ganhou) {
        mostrarMensagem(`Parabéns! Você venceu! 🎉 A palavra era: ${palavraSecreta}`, "win");
        jogoAtivo = false;
    }
}

/**
 * Verifica se o jogador perdeu o jogo (usando o número máximo de partes do corpo).
 */
function verificarDerrota() {
    // Perde quando o número de erros é igual ou maior que o número de partes do corpo
    if (letrasErradas.length >= bodyParts.length) {
        mostrarMensagem(`Você perdeu! 😢 A palavra era: ${palavraSecreta}`, "lose");
        jogoAtivo = false;
    }
}


// (Função mostrarMensagemTemporaria permanece a mesma)
function mostrarMensagemTemporaria(texto, duracaoMs = 1500) {
    if (!jogoAtivo || instructionsEl.classList.contains('win') || instructionsEl.classList.contains('lose')) {
        return;
    }
    const originalText = textoInstrucaoOriginal;
    instructionsEl.textContent = texto;
    instructionsEl.style.color = '#e74c3c';
    instructionsEl.style.fontWeight = 'bold';

    setTimeout(() => {
        if (instructionsEl.textContent === texto) {
            instructionsEl.textContent = originalText;
            instructionsEl.style.color = '';
            instructionsEl.style.fontWeight = '';
        }
    }, duracaoMs);
}

// (Função mostrarMensagem permanece a mesma)
function mostrarMensagem(texto, classeCss) {
   instructionsEl.textContent = texto;
   instructionsEl.classList.remove('win', 'lose');
   instructionsEl.classList.add(classeCss);
   instructionsEl.style.fontWeight = 'bold';
   instructionsEl.style.color = '';
}


/**
 * Reinicia o estado do jogo para uma nova partida.
 */
function reiniciarJogo() {
    console.log("Reiniciando o jogo...");

    // 1. Reseta as variáveis de estado
    letrasCorretas = [];
    letrasErradas = [];
    jogoAtivo = true;

    // 2. Escolhe uma nova palavra secreta
    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    console.log("Nova Palavra Secreta:", palavraSecreta);

    // 3. Limpa as mensagens e restaura instruções originais
    // Guarda o texto original *antes* de modificá-lo, se ainda não foi guardado
    if (!textoInstrucaoOriginal) {
        textoInstrucaoOriginal = instructionsEl.textContent;
    }
    instructionsEl.textContent = textoInstrucaoOriginal;
    instructionsEl.classList.remove('win', 'lose');
    instructionsEl.style.fontWeight = '';
    instructionsEl.style.color = '';

    // 4. Atualiza a interface gráfica
    exibirPalavra(); // Mostra os underscores da nova palavra
    // Chama exibirLetrasErradas para limpar a lista E resetar o desenho da forca
    exibirLetrasErradas();

    // 5. Garante que todas as partes da forca estão ocultas (redundante se exibirLetrasErradas já faz isso, mas seguro)
    // bodyParts.forEach(part => part.classList.remove('visible')); // Pode ser removido se confiar na chamada acima
}

// --- Event Listeners ---

window.addEventListener('keydown', (event) => {
    if (!jogoAtivo) {
        return;
    }
    const letraPressionada = event.key.toUpperCase();
    processarLetra(letraPressionada);
});

restartButton.addEventListener('click', reiniciarJogo);

// --- Inicialização do Jogo ---
reiniciarJogo(); // Chama reiniciarJogo para configurar o estado inicial