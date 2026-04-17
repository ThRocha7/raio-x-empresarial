// components/QuizSection.js
// ============================================================
// Tela do questionário.
//
// Funcionalidades:
//   1. Botão sempre visível — desabilitado até tudo respondido
//   2. Clique antecipado dispara shake + tooltip de aviso
//   3. Botão flutuante "↑ Pergunta X" ao scrollar além da atual
// ============================================================

import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";

export default function QuizSection({
  questions,
  answers,
  allAnswered,
  formData,
  handleAnswer,
  handleShowResult,
  isSubmitting,
  setIsSubmitting,
}) {
  const [shaking, setShaking] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Índice da primeira pergunta sem resposta
  const firstUnansweredIndex = questions.findIndex(
    (q) => answers[q.id] === undefined,
  );

  // Detecta quando a pergunta atual sai da viewport (scroll acima dela)
  useEffect(() => {
    function onScroll() {
      if (allAnswered) {
        setShowScrollBtn(false);
        return;
      }
      const el = document.getElementById(`question-${firstUnansweredIndex}`);
      if (!el) return;
      setShowScrollBtn(el.getBoundingClientRect().bottom < 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [firstUnansweredIndex, allAnswered]);

  async function handleConfirmClick() {
    if (!allAnswered) {
      setShaking(true);
      setShowTooltip(true);
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleShowResult();
    } finally {
      setIsSubmitting(false);
    }
  }

  function scrollToCurrentQuestion() {
    const el = document.getElementById(`question-${firstUnansweredIndex}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section className="min-h-screen px-4 md:px-6 pt-14 pb-16 max-w-2xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6 md:mb-10">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-gold mb-2">
          Etapa 2 de 2 — Diagnóstico
        </p>
        <h2 className="font-display text-2xl md:text-4xl text-white mb-1">
          Raio-X da sua empresa
        </h2>
        <div className="w-8 h-px bg-brand-gold mb-3" />
        <p className="font-body text-base text-white/60">
          Responda com honestidade — não há respostas certas ou erradas.{" "}
          <span className="text-white font-medium">
            {formData.company || "Sua empresa"}
          </span>{" "}
          merece um diagnóstico fiel.
        </p>
      </div>

      {/* Lista de perguntas */}
      <div>
        {questions.map((question, index) => {
          const isFocused = allAnswered || index === firstUnansweredIndex;
          const showCategory =
            index === 0 || question.type !== questions[index - 1].type;

          return (
            <div key={question.id}>
              {showCategory && question.category && (
                <div className="mt-6 md:mt-10 mb-1">
                  <p className="font-display text-base tracking-[0.2em] text-brand-gold">
                    {question.category}
                  </p>
                </div>
              )}
              <QuestionCard
                question={question}
                index={index}
                selected={answers[question.id] ?? null}
                onAnswer={handleAnswer}
                isLast={index === questions.length - 1}
                isFocused={isFocused}
              />
            </div>
          );
        })}
      </div>

      {/* Botão de confirmação — sempre visível */}
      <div id="result-section" className="mt-12 border-t border-white/10 py-10">
        <p className="font-display text-2xl text-white mb-2">
          {allAnswered ? "Tudo pronto!" : "Quase lá..."}
        </p>
        <p className="font-body text-base text-white/50 mb-8">
          {allAnswered
            ? "Revise suas respostas acima se quiser — você ainda pode alterá-las."
            : `Falta${firstUnansweredIndex >= 0 ? ` a pergunta ${firstUnansweredIndex + 1}` : "m perguntas"} para completar o diagnóstico.`}
        </p>

        <div className="relative inline-block w-full">
          <button
            onClick={handleConfirmClick}
            className={`btn-primary w-full ${!allAnswered ? "btn-disabled" : ""} ${shaking ? "animate-shake" : ""} disabled:opacity-50`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Aguarde..." : "Confirmar e ver diagnóstico →"}
          </button>

          {/* Tooltip de aviso */}
          {showTooltip && (
            <div className="quiz-tooltip">
              ⚠ Responda todas as perguntas antes de continuar
              <div className="quiz-tooltip-arrow" />
            </div>
          )}
        </div>
      </div>

      {/* Botão flutuante — volta para a pergunta atual */}
      {showScrollBtn && (
        <button
          onClick={scrollToCurrentQuestion}
          className="btn-scroll-current animate-fade-up"
        >
          ↑ Pergunta {firstUnansweredIndex + 1}
        </button>
      )}
    </section>
  );
}
