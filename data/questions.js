// data/questions.js
// ============================================================
// Banco de perguntas do Raio-X Empresarial.
// Cada pergunta tem: id, texto, e array de opções com valor (peso).
// O valor de cada opção é usado para calcular a pontuação final.
// ============================================================

export const QUESTIONS = [
  {
    id: 1,
    text: "Como você avalia a clareza dos processos internos da sua empresa?",
    description: "Pense em rotinas, responsabilidades e fluxos de trabalho.",
    options: [
      { label: "Temos processos bem documentados e seguidos por todos", value: 4 },
      { label: "Existem processos, mas nem sempre são seguidos", value: 3 },
      { label: "Os processos são informais e dependem das pessoas-chave", value: 2 },
      { label: "Não temos processos definidos — cada um faz do seu jeito", value: 1 },
    ],
  },
  {
    id: 2,
    text: "Sua empresa possui metas e indicadores de desempenho claros?",
    description: "Considere OKRs, KPIs, metas mensais ou qualquer métrica acompanhada regularmente.",
    options: [
      { label: "Sim, acompanhamos métricas semanalmente com o time", value: 4 },
      { label: "Temos metas, mas raramente revisamos os resultados", value: 3 },
      { label: "As metas existem só na cabeça dos líderes", value: 2 },
      { label: "Não trabalhamos com metas ou indicadores", value: 1 },
    ],
  },
  {
    id: 3,
    text: "Como é a gestão financeira do seu negócio?",
    description: "Fluxo de caixa, projeções, controle de custos e lucratividade.",
    options: [
      { label: "Temos controle detalhado e tomamos decisões baseadas em dados", value: 4 },
      { label: "Acompanhamos o básico, mas sem muito rigor", value: 3 },
      { label: "A gestão financeira é reativa — só olhamos quando há problema", value: 2 },
      { label: "Não temos controle financeiro estruturado", value: 1 },
    ],
  },
];

// ── Thresholds de pontuação ──────────────────────────────────
// A pontuação máxima é QUESTIONS.length * 4
// Estes limiares definem os 4 níveis de maturidade empresarial.
export const SCORE_LEVELS = [
  {
    // Pontuação: 75%–100%
    min: 9,
    label: "Empresa em Expansão",
    emoji: "🚀",
    color: "#22c55e", // verde
    description:
      "Sua empresa demonstra maturidade de gestão acima da média. Você já tem fundações sólidas — o próximo passo é escalar com consistência e estratégia.",
    cta: "Quero escalar minha empresa",
  },
  {
    // Pontuação: 50%–74%
    min: 7,
    label: "Empresa em Desenvolvimento",
    emoji: "📈",
    color: "#C9A84C", // dourado
    description:
      "Você está no caminho certo, mas existem gaps que podem estar limitando seu crescimento. Uma mentoria focada pode acelerar sua evolução.",
    cta: "Quero evoluir minha gestão",
  },
  {
    // Pontuação: 25%–49%
    min: 4,
    label: "Empresa em Reestruturação",
    emoji: "🔧",
    color: "#f97316", // laranja
    description:
      "Sua empresa possui potencial, mas enfrenta desafios estruturais que podem estar travando os resultados. Agir agora pode mudar o jogo.",
    cta: "Quero reestruturar minha empresa",
  },
  {
    // Pontuação: 0%–24%
    min: 0,
    label: "Empresa em Alerta",
    emoji: "⚠️",
    color: "#ef4444", // vermelho
    description:
      "Há pontos críticos que precisam de atenção urgente. Cada dia sem ação representa oportunidade perdida e risco crescente.",
    cta: "Quero resolver isso agora",
  },
];

/**
 * Retorna o nível correspondente à pontuação total.
 * @param {number} score - Soma dos valores das respostas selecionadas.
 * @returns {object} - Objeto do SCORE_LEVELS correspondente.
 */
export function getScoreLevel(score) {
  return SCORE_LEVELS.find((level) => score >= level.min) || SCORE_LEVELS[SCORE_LEVELS.length - 1];
}
