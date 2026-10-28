const perguntas = [
    {
        pergunta: "1. Qual é um possível sinal de alerta do câncer de mama?",
        alternativas: [
            "Caroço na mama",
            "Dor de cabeça ocasional",
            "Unhas compridas",
            "Sede depois de fazer exercícios"
        ],
        correta: 0,
        explicacao:
            "Um caroço pode ter várias causas, mas deve ser avaliado por um profissional."
    },
    {
        pergunta: "2. O câncer de próstata pode não apresentar sintomas no início?",
        alternativas: [
            "Não, sempre apresenta sintomas",
            "Sim, pode não apresentar sintomas",
            "Somente em adolescentes",
            "Nunca acontece"
        ],
        correta: 1,
        explicacao:
            "Nas fases iniciais, a doença pode não apresentar sintomas."
    },
    {
        pergunta: "3. Qual hábito contribui para a saúde geral?",
        alternativas: [
            "Fumar diariamente",
            "Evitar toda atividade física",
            "Manter uma alimentação equilibrada e praticar exercícios",
            "Dormir sempre muito pouco"
        ],
        correta: 2,
        explicacao:
            "Alimentação equilibrada e atividade física contribuem para a saúde."
    },
    {
        pergunta: "4. O que fazer ao perceber uma alteração suspeita na mama?",
        alternativas: [
            "Ignorar a alteração",
            "Esperar obrigatoriamente um ano",
            "Tomar medicamentos por conta própria",
            "Procurar uma unidade de saúde"
        ],
        correta: 3,
        explicacao:
            "Uma alteração suspeita precisa de avaliação profissional."
    },
    {
        pergunta: "5. Como decidir sobre exames para investigar o câncer de próstata?",
        alternativas: [
            "Fazer qualquer exame sem orientação",
            "Conversar com um profissional sobre benefícios e riscos",
            "Nunca procurar informações",
            "Decidir apenas com base em propagandas"
        ],
        correta: 1,
        explicacao:
            "A decisão deve considerar a situação individual e as orientações de saúde."
    }
];

let indiceAtual = 0;
let pontuacao = 0;
let respondida = false;

const elementoPergunta = document.getElementById("pergunta");
const elementoAlternativas = document.getElementById("alternativas");
const elementoFeedback = document.getElementById("feedback");
const botaoProximo = document.getElementById("proximo");
const elementoResultado = document.getElementById("resultado");
const botaoReiniciar = document.getElementById("reiniciar");
const elementoRecorde = document.getElementById("recorde");

function mostrarPergunta() {
    respondida = false;

    const atual = perguntas[indiceAtual];

    elementoPergunta.textContent = atual.pergunta;
    elementoAlternativas.replaceChildren();
    elementoFeedback.textContent = "";
    elementoResultado.textContent = "";

    botaoProximo.hidden = true;
    botaoReiniciar.hidden = true;

    atual.alternativas.forEach((alternativa, indice) => {
        const botao = document.createElement("button");

        botao.textContent = alternativa;

        botao.addEventListener("click", () => {
            verificarResposta(indice);
        });

        elementoAlternativas.appendChild(botao);
    });
}

function verificarResposta(indiceEscolhido) {
    if (respondida) {
        return;
    }

    respondida = true;

    const atual = perguntas[indiceAtual];
    const botoes = elementoAlternativas.querySelectorAll("button");

    botoes.forEach(botao => {
        botao.disabled = true;
    });

    if (indiceEscolhido === atual.correta) {
        pontuacao++;

        elementoFeedback.textContent =
            "Resposta correta! " + atual.explicacao;
    } else {
        elementoFeedback.textContent =
            "Resposta incorreta. " + atual.explicacao;
    }

    if (indiceAtual < perguntas.length - 1) {
        botaoProximo.hidden = false;
    } else {
        finalizarQuiz();
    }
}

function finalizarQuiz() {
    elementoPergunta.textContent = "Quiz finalizado!";

    elementoResultado.textContent =
        `Você acertou ${pontuacao} de ${perguntas.length} perguntas!`;

    elementoFeedback.textContent =
        pontuacao === perguntas.length
            ? "Excelente! Você acertou todas as perguntas."
            : pontuacao >= 3
                ? "Muito bem! Continue aprendendo sobre saúde."
                : "Continue estudando as informações das campanhas.";

    const resultado = {
        pontuacao: pontuacao,
        total: perguntas.length,
        data: new Date().toLocaleString("pt-BR")
    };

    try {
        localStorage.setItem(
            "saudeEmFocoUltimoResultado",
            JSON.stringify(resultado)
        );

        const recordeAnterior = Number(
            localStorage.getItem("saudeEmFocoRecorde") || 0
        );

        if (pontuacao > recordeAnterior) {
            localStorage.setItem(
                "saudeEmFocoRecorde",
                String(pontuacao)
            );
        }

        mostrarRecorde();
    } catch (erro) {
        elementoFeedback.textContent +=
            " Não foi possível salvar o resultado neste navegador.";
    }

    botaoProximo.hidden = true;
    botaoReiniciar.hidden = false;
}

function mostrarRecorde() {
    try {
        const recorde = Number(
            localStorage.getItem("saudeEmFocoRecorde") || 0
        );

        elementoRecorde.textContent =
            `Seu melhor resultado neste navegador: ${recorde} de ${perguntas.length}.`;
    } catch (erro) {
        elementoRecorde.textContent =
            "O histórico de resultados não está disponível.";
    }
}

botaoProximo.addEventListener("click", () => {
    if (indiceAtual < perguntas.length - 1) {
        indiceAtual++;
        mostrarPergunta();
    }
});

botaoReiniciar.addEventListener("click", () => {
    indiceAtual = 0;
    pontuacao = 0;
    mostrarPergunta();
});

mostrarPergunta();
mostrarRecorde();