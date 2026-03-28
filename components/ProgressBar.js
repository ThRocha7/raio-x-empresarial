/**
 * @param {number} percent  - 0 a 100, controla o tamanho do preenchimento.
 * @param {number} answered - Mantido para uso futuro (ex: tooltip).
 * @param {number} total    - Idem.
 */
export default function ProgressBar({ percent, answered, total }) {
  return (
    // Linha de 2px colada no topo — sem fundo chamativo, quase invisível
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-stone-100">
      {/* Preenchimento dourado avança suavemente conforme as respostas */}
      <div
        className="h-full bg-brand-navy transition-all duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
