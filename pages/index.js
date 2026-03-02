// pages/index.js
// ============================================================
// Página principal do Raio-X Empresarial.
// Gerencia o estado global e renderiza as seções:
//   1. HOME          — apresentação e chamada para ação
//   2. COLETA        — formulário de dados do usuário
//   3. QUESTIONÁRIO  — perguntas de múltipla escolha
//   4. RESULTADO     — nota final e CTA de conversão
// ============================================================

import { useState, useRef } from "react";
import Head from "next/head";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import { QUESTIONS, getScoreLevel } from "../data/questions";
import { registerUser, notifyUser } from "../services/userService";

// ── Seções da jornada ──────────────────────────────────────
// Facilitam o controle de qual "tela" está sendo exibida.
const STEPS = {
  HOME: "home",
  COLLECT: "collect",
  QUIZ: "quiz",
  RESULT: "result",
};

// ── Cargos disponíveis na drop list ───────────────────────
const ROLES = [
  "Dono / Sócio",
  "CEO / Diretor Executivo",
  "Diretor Comercial",
  "Diretor de Operações",
  "Gerente Geral",
  "Gerente Comercial",
  "Gerente de Operações",
  "Coordenador",
  "Supervisor",
  "Outro cargo de liderança",
];

export default function Home() {
  // ── Estado de navegação ──────────────────────────────────
  const [step, setStep] = useState(STEPS.HOME);

  // ── Estado do formulário de coleta ──────────────────────
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    company: "",
    role: "",
    lgpdConsent: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Estado do questionário ───────────────────────────────
  // Mapeia questionId -> valor da opção selecionada
  const [answers, setAnswers] = useState({});

  // Ref para o topo da página (usado para scroll ao mudar de seção)
  const topRef = useRef(null);

  // ── Helpers de progresso ─────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / QUESTIONS.length) * 100;
  const allAnswered = answeredCount === QUESTIONS.length;

  // ── Pontuação ────────────────────────────────────────────
  const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
  const scoreLevel = getScoreLevel(totalScore);

  // ── Navegação para o topo ao trocar de seção ─────────────
  function scrollToTop() {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  // ── Handlers ─────────────────────────────────────────────

  /** Atualiza campos do formulário de coleta */
  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpa o erro do campo ao digitar
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  /** Aplica máscara de telefone (XX) XXXXX-XXXX */
  function formatPhone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function handlePhoneChange(e) {
    setFormData((prev) => ({ ...prev, whatsapp: formatPhone(e.target.value) }));
    if (formErrors.whatsapp) {
      setFormErrors((prev) => ({ ...prev, whatsapp: "" }));
    }
  }

  /** Valida o formulário de coleta e avança se válido */
  async function handleCollectSubmit() {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Informe seu nome.";
    if (!formData.whatsapp || formData.whatsapp.replace(/\D/g, "").length < 10)
      errors.whatsapp = "Informe um WhatsApp válido.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Informe um e-mail válido.";
    if (!formData.company.trim()) errors.company = "Informe o nome da empresa.";
    if (!formData.role) errors.role = "Selecione seu cargo.";
    if (!formData.lgpdConsent)
      errors.lgpdConsent = "Você precisa aceitar para continuar.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser(formData);
      setStep(STEPS.QUIZ);
      scrollToTop();
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      setStep(STEPS.QUIZ);
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Registra a resposta de uma pergunta */
  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  /**
   * Exibe a tela de resultado e envia o payload completo para o backend.
   * Este é o ponto principal de integração — contém tudo: lead + respostas + resultado.
   */
  async function handleShowResult() {
    const payload = {
      lead: {
        name: formData.name,
        whatsapp: formData.whatsapp,
        company: formData.company,
      },
      answers: answers,
      result: {
        totalScore: totalScore, // soma dos valores escolhidos
        maxScore: QUESTIONS.length * 4, // pontuação máxima possível
        label: scoreLevel.label, // ex: "Empresa em Desenvolvimento"
        emoji: scoreLevel.emoji,
      },
      submittedAt: new Date().toISOString(),
    };

    try {
      await notifyUser(payload);
      setStep(STEPS.RESULT);
      scrollToTop();
    } catch (err) {
      console.error("Erro ao gerar diagnóstico:", err);
      alert("Não foi possível gerar o diagnóstico. Tente novamente.");
    }
    // finally {
    //   setIsSubmitting(false);
    // }
  }

  // ── WhatsApp CTA link ────────────────────────────────────
  // Ao clicar no botão de resultado, abre o WhatsApp com mensagem pré-preenchida.
  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de fazer o Raio-X Empresarial e recebi o diagnóstico: *${scoreLevel.label}*. Gostaria de saber mais sobre como melhorar os resultados da ${formData.company || "minha empresa"}.`,
  );
  // ⚠️ Substitua pelo número do WhatsApp comercial real (formato: 5511999999999)
  const whatsappLink = `https://wa.me/5511999999999?text=${whatsappMessage}`;

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <>
      <Head>
        <title>Raio-X Empresarial — Diagnóstico Gratuito</title>
      </Head>

      {/* Barra de progresso — visível apenas durante o questionário */}
      {step === STEPS.QUIZ && (
        <ProgressBar
          percent={progressPercent}
          answered={answeredCount}
          total={QUESTIONS.length}
        />
      )}

      {/* Ponto de ancoragem para scroll ao topo */}
      <div ref={topRef} />

      {/* ── 1. HOME ─────────────────────────────────────────── */}
      {step === STEPS.HOME && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 max-w-2xl mx-auto">
          {/* Ícone / logo decorativo */}
          <div className="mb-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-2xl">
              🔍
            </div>
          </div>

          {/* Tag superior */}
          <p
            className="font-body text-xs tracking-[0.25em] uppercase text-brand-gold mb-4 animate-fade-in"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            Diagnóstico Empresarial Gratuito
          </p>

          {/* Título principal */}
          <h1
            className="font-display text-5xl md:text-6xl text-stone-800 text-center leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            Raio-X <span className="text-gold-gradient">Empresarial</span>
          </h1>

          {/* Linha decorativa */}
          <div
            className="gold-divider animate-fade-in"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          />

          {/* Subtítulo */}
          <p
            className="font-body text-stone-500 text-center text-lg leading-relaxed max-w-md mb-4 animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            Bem-vindo. O{" "}
            <strong className="text-stone-800">Raio-X Empresarial</strong> é uma
            avaliação rápida que identifica os principais pontos críticos da sua
            gestão — entregando um diagnóstico personalizado do estágio atual da
            sua empresa.
          </p>

          {/* Link "saiba mais" */}
          <p
            className="font-body text-base text-stone-400 text-center mb-10 animate-fade-up"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            Quer entender melhor como funciona o Raio-X Empresarial?{" "}
            <a
              href="#como-funciona"
              className="text-brand-gold border-gold-animated hover:text-brand-gold-light transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("como-funciona")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Clique aqui!
            </a>
          </p>

          {/* CTA principal */}
          <button
            onClick={() => {
              setStep(STEPS.COLLECT);
              scrollToTop();
            }}
            className="btn-primary text-base px-12 py-5 animate-fade-up"
            style={{ animationDelay: "0.6s", opacity: 0 }}
          >
            Começar agora
          </button>

          {/* Bloco explicativo "Como funciona" */}
          <div
            id="como-funciona"
            className="mt-20 w-full animate-fade-up border-t border-stone-100 pt-12"
            style={{ animationDelay: "0.7s", opacity: 0 }}
          >
            <h2 className="font-display text-2xl text-stone-800 mb-1">
              Como funciona
            </h2>
            <div className="w-8 h-px bg-brand-gold mb-5" />
            <p className="font-body text-stone-400 text-sm leading-relaxed mb-6">
              O Raio-X Empresarial funciona em três etapas simples:
            </p>

            {/* Passos */}
            <div className="space-y-5">
              {[
                {
                  num: "01",
                  title: "Seus dados",
                  desc: "Preencha rapidamente suas informações de contato. Isso nos permite enviar seu resultado personalizado.",
                },
                {
                  num: "02",
                  title: "Responda o diagnóstico",
                  desc: "Responda 3 perguntas de múltipla escolha sobre a gestão da sua empresa. Sem respostas certas ou erradas.",
                },
                {
                  num: "03",
                  title: "Receba seu diagnóstico",
                  desc: "Ao final, você recebe uma avaliação clara do estágio da sua empresa e os próximos passos recomendados.",
                },
              ].map((item) => (
                <div key={item.num} className="flex gap-4">
                  <span className="font-display text-brand-gold text-lg font-semibold w-8 flex-shrink-0">
                    {item.num}
                  </span>
                  <div>
                    <p className="font-body text-stone-800 text-sm font-medium mb-0.5">
                      {item.title}
                    </p>
                    <p className="font-body text-stone-400 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Duração */}
            <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-2">
              <span className="text-brand-gold">⏱</span>
              <p className="font-body text-sm text-stone-400">
                Duração estimada:{" "}
                <strong className="text-stone-700">menos de 3 minutos</strong>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. COLETA DE DADOS ──────────────────────────────── */}
      {step === STEPS.COLLECT && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 max-w-2xl mx-auto">
          {/* Cabeçalho */}
          <div className="w-full mb-10">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-gold mb-3">
              Etapa 1 de 2
            </p>
            <h2 className="font-display text-4xl text-stone-800 mb-1">
              Suas informações
            </h2>
            <div className="w-8 h-px bg-brand-gold mb-4" />
            <p className="font-body text-stone-400 text-sm">
              Preencha os dados abaixo para que possamos personalizar seu
              diagnóstico.
            </p>
          </div>

          {/* Formulário */}
          <div className="w-full space-y-5">
            {/* Nome */}
            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-stone-400 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                placeholder="Como você se chama?"
                value={formData.name}
                onChange={handleFormChange}
                className={`form-input ${formErrors.name ? "border-red-400" : ""}`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-400 font-body">
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-stone-400 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={handlePhoneChange}
                className={`form-input ${formErrors.whatsapp ? "border-red-400" : ""}`}
              />
              {formErrors.whatsapp && (
                <p className="mt-1 text-xs text-red-400 font-body">
                  {formErrors.whatsapp}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-stone-400 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com.br"
                value={formData.email}
                onChange={handleFormChange}
                className={`form-input ${formErrors.email ? "border-red-400" : ""}`}
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-400 font-body">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Nome da empresa */}
            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-stone-400 mb-2">
                Nome da empresa
              </label>
              <input
                type="text"
                name="company"
                placeholder="Qual é o nome do seu negócio?"
                value={formData.company}
                onChange={handleFormChange}
                className={`form-input ${formErrors.company ? "border-red-400" : ""}`}
              />
              {formErrors.company && (
                <p className="mt-1 text-xs text-red-400 font-body">
                  {formErrors.company}
                </p>
              )}
            </div>

            {/* Cargo — drop list */}
            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-stone-400 mb-2">
                Seu cargo
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className={`form-input appearance-none ${formErrors.role ? "border-red-400" : ""} ${!formData.role ? "text-stone-400" : "text-stone-800"}`}
              >
                <option value="" disabled>
                  Selecione seu cargo...
                </option>
                {ROLES.map((role) => (
                  <option
                    key={role}
                    value={role}
                    className="bg-white text-stone-800"
                  >
                    {role}
                  </option>
                ))}
              </select>
              {formErrors.role && (
                <p className="mt-1 text-xs text-red-400 font-body">
                  {formErrors.role}
                </p>
              )}
            </div>

            {/* Checkbox LGPD */}
            <div
              className={`pt-2 ${formErrors.lgpdConsent ? "border border-red-400/30 rounded-sm p-3" : ""}`}
            >
              <label className="flex items-start gap-3 cursor-pointer group">
                {/* Checkbox nativo visível mas estilizado */}
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    name="lgpdConsent"
                    checked={formData.lgpdConsent}
                    onChange={handleFormChange}
                    className="sr-only"
                    id="lgpd-checkbox"
                  />
                  {/* Visual do checkbox — clicável via label pai */}
                  <div
                    className={`
                      w-5 h-5 rounded-sm border transition-all duration-200 flex items-center justify-center pointer-events-none
                      ${
                        formData.lgpdConsent
                          ? "bg-brand-gold border-brand-gold"
                          : "bg-white border-stone-300 group-hover:border-brand-gold/50"
                      }
                    `}
                  >
                    {formData.lgpdConsent && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="font-body text-xs text-stone-500 leading-relaxed">
                  Autorizo o contato via WhatsApp e e-mail informados acima para
                  receber meu diagnóstico e comunicações relacionadas. Seus
                  dados são tratados conforme a{" "}
                  <strong className="text-stone-700">
                    Lei Geral de Proteção de Dados (LGPD)
                  </strong>{" "}
                  e não serão compartilhados com terceiros.
                </p>
              </label>
              {formErrors.lgpdConsent && (
                <p className="mt-2 text-xs text-red-400 font-body ml-8">
                  {formErrors.lgpdConsent}
                </p>
              )}
            </div>
          </div>

          {/* Botão continuar */}
          <button
            onClick={handleCollectSubmit}
            disabled={isSubmitting}
            className="btn-primary w-full mt-8 disabled:opacity-50"
          >
            {isSubmitting ? "Aguarde..." : "Continuar para o diagnóstico →"}
          </button>

          {/* Voltar */}
          <button
            onClick={() => setStep(STEPS.HOME)}
            className="mt-4 font-body text-sm text-stone-400 hover:text-stone-700 transition-colors duration-200"
          >
            ← Voltar ao início
          </button>
        </section>
      )}

      {/* ── 3. QUESTIONÁRIO ─────────────────────────────────── */}
      {step === STEPS.QUIZ && (
        <section className="min-h-screen px-6 py-24 max-w-2xl mx-auto">
          {/* Cabeçalho da seção */}
          <div className="mb-12">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-gold mb-3">
              Etapa 2 de 2 — Diagnóstico
            </p>
            <h2 className="font-display text-4xl text-stone-800 mb-1">
              Raio-X da sua empresa
            </h2>
            <div className="w-8 h-px bg-brand-gold mb-4" />
            <p className="font-body text-stone-400 text-base">
              Responda com honestidade — não há respostas certas ou erradas.{" "}
              <span className="text-stone-700">
                {formData.company || "Sua empresa"}
              </span>{" "}
              merece um diagnóstico fiel.
            </p>
          </div>

          <div>
            {QUESTIONS.map((question, index) => {
              // Lógica de foco:
              // - Se há perguntas sem resposta: foco na primeira delas
              // - Se todas foram respondidas: todas ficam com opacidade total (allAnswered)
              //   para que o usuário possa revisar e trocar antes de confirmar
              const firstUnanswered = QUESTIONS.findIndex(
                (q) => answers[q.id] === undefined,
              );
              const isFocused = allAnswered || index === firstUnanswered;

              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  selected={answers[question.id] ?? null}
                  onAnswer={handleAnswer}
                  isLast={index === QUESTIONS.length - 1}
                  isFocused={isFocused}
                />
              );
            })}
          </div>

          {/* Botão de confirmação final — aparece após todas as perguntas respondidas.
               IMPORTANTE: só aqui as respostas são processadas e enviadas ao backend.
               Antes disso o usuário pode trocar qualquer resposta livremente. */}
          <div
            id="result-section"
            className={`mt-12 transition-all duration-500 ${
              allAnswered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="py-10 border-t border-stone-100">
              <p className="font-display text-2xl text-stone-800 mb-2">
                Tudo pronto!
              </p>
              <p className="font-body text-base text-stone-400 mb-2">
                Revise suas respostas acima se quiser — você ainda pode
                alterá-las.
              </p>
              <p className="font-body text-sm text-stone-300 mb-8">
                Quando estiver satisfeito, confirme para gerar seu diagnóstico.
              </p>
              <button onClick={handleShowResult} className="btn-primary">
                Confirmar e ver diagnóstico →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. RESULTADO ────────────────────────────────────── */}
      {step === STEPS.RESULT && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 max-w-2xl mx-auto">
          {/* Emoji do nível */}
          <div className="text-5xl mb-6 animate-fade-in">
            {scoreLevel.emoji}
          </div>

          {/* Tag — diagnóstico */}
          <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-gold mb-3 animate-fade-in">
            Diagnóstico de {formData.company || "sua empresa"}
          </p>

          {/* Título do nível */}
          <h2
            className="font-display text-3xl md:text-4xl text-center font-semibold mb-2 animate-fade-up"
            style={{ color: scoreLevel.color }}
          >
            {scoreLevel.label}
          </h2>

          <div className="gold-divider animate-fade-in" />

          {/* Pontuação visual */}
          <div
            className="w-full bg-white border border-stone-100 shadow-sm rounded-sm p-6 mb-6 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-xs text-stone-400 uppercase tracking-widest">
                Pontuação
              </span>
              <span className="font-display text-brand-gold text-xl font-semibold">
                {totalScore} / {QUESTIONS.length * 4}
              </span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(totalScore / (QUESTIONS.length * 4)) * 100}%`,
                  backgroundColor: scoreLevel.color,
                }}
              />
            </div>
          </div>

          {/* Descrição do diagnóstico */}
          <div
            className="w-full bg-white border border-stone-100 shadow-sm rounded-sm p-6 mb-8 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <h3 className="font-display text-lg text-stone-800 mb-3">
              O que isso significa?
            </h3>
            <p className="font-body text-stone-500 text-sm leading-relaxed">
              {scoreLevel.description}
            </p>
          </div>

          {/* CTA principal — WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center block mb-4 animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            📲 {scoreLevel.cta}
          </a>

          {/* Aviso privacidade */}
          <p
            className="font-body text-xs text-stone-400 text-center animate-fade-in"
            style={{ animationDelay: "0.45s" }}
          >
            Seus dados estão protegidos conforme a LGPD. Não fazemos spam.
          </p>

          {/* Rodapé */}
          <div
            className="mt-16 w-full border-t border-stone-100 pt-6 text-center animate-fade-in"
            style={{ animationDelay: "0.55s" }}
          >
            <p className="font-body text-xs text-stone-300">
              Raio-X Empresarial © {new Date().getFullYear()} — Diagnóstico
              confidencial
            </p>
          </div>
        </section>
      )}
    </>
  );
}
