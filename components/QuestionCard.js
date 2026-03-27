/**
 * @param {object}      question     - Objeto da pergunta (id, text, description, options).
 * @param {number}      index        - Índice 0-based da pergunta.
 * @param {number|null} selected     - Valor da opção atualmente selecionada, ou null.
 * @param {function}    onAnswer     - Callback(questionId, optionValue) — chamado ao clicar.
 * @param {boolean}     isLast       - Se é a última pergunta.
 * @param {boolean}     isFocused    - Se é a próxima a ser respondida (em foco).
 */
export default function QuestionCard({
  question,
  index,
  selected,
  onAnswer,
  isLast,
  isFocused,
}) {
  const isAnswered = selected !== null;

  // Opacidade: foco ou já respondida = 100%; ainda não chegou a vez = 30%
  const opacity = isFocused || isAnswered ? 1 : 0.3;

  function handleSelect(optionValue) {
    const isFirstAnswer = !isAnswered;

    // Registra (ou troca) a resposta — sem bloqueio
    onAnswer(question.id, optionValue);

    // Scroll automático apenas na PRIMEIRA resposta desta pergunta
    // (nas trocas subsequentes, não rola — evita salto inesperado)
    if (isFirstAnswer) {
      setTimeout(() => {
        const next = document.getElementById(`question-${index + 1}`);
        if (next) {
          next.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (isLast) {
          document
            .getElementById("result-section")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 450);
    }
  }

  return (
    <div
      id={`question-${index}`}
      className="transition-all duration-500 py-10 border-b border-stone-100 last:border-0"
      style={{ opacity }}
    >
      {/* Número + enunciado */}
      <div className="flex items-start gap-4 mb-7">
        {/* Bolinha numerada */}
        <span
          className={`
            mt-1 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
            font-display text-base font-semibold transition-all duration-300
            ${
              isFocused
                ? "bg-brand-gold text-white"
                : isAnswered
                  ? "bg-stone-100 text-brand-gold"
                  : "bg-stone-100 text-stone-400"
            }
          `}
        >
          {index + 1}
        </span>

        <div>
          {/* Texto principal da pergunta — fonte maior */}
          <h3 className="font-body text-lg text-stone-800 font-medium leading-snug mb-2">
            {question.text}
          </h3>
          {/* Instrução auxiliar */}
          {question.description && (
            <p className="font-body text-base text-stone-400 leading-relaxed">
              {question.description}
            </p>
          )}
        </div>
      </div>

      {/* Opções de resposta */}
      <div className="space-y-3 pl-12">
        {question.options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full text-left px-5 py-4 rounded-sm border transition-all duration-200
                font-body text-base leading-relaxed cursor-pointer
                ${
                  isSelected
                    ? "border-brand-gold text-stone-800"
                    : "border-stone-200 text-stone-600 hover:border-brand-gold/60 hover:text-stone-800 hover:bg-brand-gold/5"
                }
              `}
              style={
                isSelected ? { backgroundColor: "rgba(201,168,76,0.07)" } : {}
              }
            >
              <span className="flex items-center gap-3">
                {/* Marcador radio */}
                <span
                  className={`
                    w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center
                    transition-all duration-200
                    ${isSelected ? "border-brand-gold bg-brand-gold" : "border-stone-300"}
                  `}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
