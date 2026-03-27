export const QUESTIONS = [
  {
    id: 1,
    text: "Como você avalia a clareza dos processos internos da sua empresa?",
    description: "Pense em rotinas, responsabilidades e fluxos de trabalho.",
    options: [
      {
        label: "Temos processos bem documentados e seguidos por todos",
        value: 4,
      },
      { label: "Existem processos, mas nem sempre são seguidos", value: 3 },
      {
        label: "Os processos são informais e dependem das pessoas-chave",
        value: 2,
      },
      {
        label: "Não temos processos definidos — cada um faz do seu jeito",
        value: 1,
      },
    ],
  },
  {
    id: 2,
    text: "Sua empresa possui metas e indicadores de desempenho claros?",
    description:
      "Considere OKRs, KPIs, metas mensais ou qualquer métrica acompanhada regularmente.",
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
    description:
      "Fluxo de caixa, projeções, controle de custos e lucratividade.",
    options: [
      {
        label: "Temos controle detalhado e tomamos decisões baseadas em dados",
        value: 4,
      },
      { label: "Acompanhamos o básico, mas sem muito rigor", value: 3 },
      {
        label: "A gestão financeira é reativa — só olhamos quando há problema",
        value: 2,
      },
      { label: "Não temos controle financeiro estruturado", value: 1 },
    ],
  },
];

export const SCORE_LEVELS = [
  {
    min: 60,
    label: "Empresa em Expansão",
    emoji: "🚀",
    color: "#22c55e",
    description:
      "Você pode estar perdendo <strong> 2% do faturamento!</strong> %Sua empresa está em um nível elevado de maturidade operacional. O foco agora é escala, previsibilidade e excelência! <br/><br/>Com base no seu nível atual, existe um potencial claro de recuperação de margem. O próximo passo é estruturar um plano para capturar esse valor de forma consistente. <br/><br/>A boa notícia é que essa margem já existe. Não depende de vender mais, e sim de ajustar o que já acontece hoje dentro da sua empresa. <br/><br/>Se você quiser, eu posso te mostrar exatamente onde começar e quais ações priorizar para já capturar esses ganhos nas próximas semanas!",
    cta: "Quero escalar minha empresa",
  },
  {
    min: 30,
    label: "Empresa em Desenvolvimento",
    emoji: "📈",
    color: "#C9A84C",
    description:
      "Você está perdendo entre <strong> 2% a 5% do faturamento!</strong> Sua empresa já possui estrutura, mas ainda perde eficiência por falta de integração e disciplina na execução! <br/><br/>Com base no seu nível atual, existe um potencial claro de recuperação de margem. O próximo passo é estruturar um plano para capturar esse valor de forma consistente. <br/><br/>A boa notícia é que essa margem já existe. Não depende de vender mais, e sim de ajustar o que já acontece hoje dentro da sua empresa. <br/><br/>Se você quiser, eu posso te mostrar exatamente onde começar e quais ações priorizar para já capturar esses ganhos nas próximas semanas!",
    cta: "Quero evoluir minha gestão",
  },
  {
    min: 0,
    label: "Empresa em Alerta",
    emoji: "⚠️",
    color: "#ef4444",
    description:
      "Você está perdendo entre <strong>5% a 12% do faturamento!</strong> Sua empresa ainda opera de forma reativa, existe um grande potencial de ganho rápido apenas organizando processos e criando padrões mínimos! <br/><br/>Com base no seu nível atual, existe um potencial claro de recuperação de margem. O próximo passo é estruturar um plano para capturar esse valor de forma consistente. <br/><br/>A boa notícia é que essa margem já existe. Não depende de vender mais, e sim de ajustar o que já acontece hoje dentro da sua empresa. <br/><br/>Se você quiser, eu posso te mostrar exatamente onde começar e quais ações priorizar para já capturar esses ganhos nas próximas semanas!",
    cta: "Quero resolver isso agora",
  },
];

export function getScoreLevel(score, lengthQuestions) {
  const percent = (score * 100) / lengthQuestions;

  return (
    SCORE_LEVELS.find((level) => percent >= level.min) ||
    SCORE_LEVELS[SCORE_LEVELS.length - 1]
  );
}
