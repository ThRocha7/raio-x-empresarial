export default function QuestionCard({
  question,
  index,
  selected,
  onAnswer,
  isLast,
  isFocused,
}) {
  const isAnswered = selected !== null;
  const opacity = isFocused || isAnswered ? 1 : 0.35;

  function handleSelect(optionValue) {
    const isFirstAnswer = !isAnswered;
    onAnswer(question.id, optionValue);
    if (isFirstAnswer) {
      setTimeout(() => {
        const next = document.getElementById(`question-${index + 1}`);
        if (next) {
          const rect = next.getBoundingClientRect();
          const offset = 120; // 👈 ajuste esse valor
          window.scrollBy({ top: rect.top - offset, behavior: "smooth" });
        } else if (isLast) {
          const result = document.getElementById("result-section");
          if (result) {
            const rect = result.getBoundingClientRect();
            const offset = 120;
            window.scrollBy({ top: rect.top - offset, behavior: "smooth" });
          }
        }
      }, 250);
    }
  }

  return (
    <div
      id={`question-${index}`}
      className="transition-all duration-500 py-6 border-b border-white/10 last:border-0"
      style={{ opacity }}
    >
      {/* Número + enunciado */}
      <div className="flex items-start gap-3 mb-4">
        {/* Bolinha — dourada quando em foco */}
        <span
          className={`
            mt-0.5 w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
            font-display text-sm font-semibold transition-all duration-300 flex-shrink-0
            ${
              isFocused
                ? "bg-brand-gold text-brand-navy"
                : isAnswered
                  ? "bg-brand-gold/20 text-brand-gold"
                  : "bg-white/10 text-white/40"
            }
          `}
        >
          {index + 1}
        </span>

        <div>
          {/* Título serifado — 16px */}
          <h3
            className="font-display text-white font-medium leading-snug mb-1"
            style={{ fontSize: "16px" }}
          >
            {question.text}
          </h3>
          {question.description && (
            <p
              className="font-body text-white/45 leading-relaxed"
              style={{ fontSize: "14px" }}
            >
              {question.description}
            </p>
          )}
        </div>
      </div>

      {/* Opções */}
      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full text-left px-4 py-2.5 rounded-sm border transition-all duration-200
                font-body leading-snug cursor-pointer
                ${
                  isSelected
                    ? "border-brand-gold text-white"
                    : "border-white/15 text-white/65 hover:border-brand-gold/50 hover:text-white hover:bg-brand-gold/5"
                }
              `}
              style={{
                fontSize: "15px",
                ...(isSelected
                  ? { backgroundColor: "rgba(201,168,76,0.08)" }
                  : {}),
              }}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`
                    w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center
                    transition-all duration-200
                    ${isSelected ? "border-brand-gold bg-brand-gold" : "border-white/30"}
                  `}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-navy" />
                  )}
                </span>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <p
          className="mt-2 pl-10 text-brand-gold/50 font-body"
          style={{ fontSize: "12px" }}
        >
          ✓ Selecionado — você pode trocar antes de confirmar
        </p>
      )}
    </div>
  );
}
