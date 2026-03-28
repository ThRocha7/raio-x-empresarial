export default function QuestionCard({
  question,
  index,
  selected,
  onAnswer,
  isLast,
  isFocused,
}) {
  const isAnswered = selected !== null;
  const opacity = isFocused || isAnswered ? 1 : 0.3;

  function handleSelect(optionValue) {
    const isFirstAnswer = !isAnswered;
    onAnswer(question.id, optionValue);
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
      className="transition-all duration-500 py-6 border-b border-stone-100 last:border-0"
      style={{ opacity }}
    >
      {/* Número + enunciado */}
      <div className="flex items-start gap-3 mb-4">
        {/* Bolinha numerada — azul quando em foco */}
        <span
          className={`
            mt-0.5 w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
            font-display text-sm font-semibold transition-all duration-300
            ${
              isFocused
                ? "bg-brand-navy text-white"
                : isAnswered
                  ? "bg-brand-navy/10 text-brand-navy"
                  : "bg-stone-100 text-stone-400"
            }
          `}
        >
          {index + 1}
        </span>

        <div>
          {/* Título em fonte serifada — Playfair Display */}
          <h3 className="font-display text-lg md:text-lg text-stone-800 font-medium leading-snug mb-1">
            {question.text}
          </h3>
          {question.description && (
            <p className="font-body text-sm text-stone-400 leading-relaxed">
              {question.description}
            </p>
          )}
        </div>
      </div>

      {/* Opções — compactas para caber na tela */}
      <div className="space-y-2 pl-10">
        {question.options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full text-left px-4 py-2.5 rounded-sm border transition-all duration-200
                font-body text-sm leading-snug cursor-pointer
                ${
                  isSelected
                    ? "border-brand-navy text-stone-800"
                    : "border-stone-200 text-stone-600 hover:border-brand-navy/50 hover:text-brand-navy hover:bg-brand-navy/5"
                }
              `}
              style={
                isSelected ? { backgroundColor: "rgba(14,33,64,0.05)" } : {}
              }
            >
              <span className="flex items-center gap-2.5">
                {/* Radio visual — azul quando selecionado */}
                <span
                  className={`
                    w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center
                    transition-all duration-200
                    ${isSelected ? "border-brand-navy bg-brand-navy" : "border-stone-300"}
                  `}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
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
