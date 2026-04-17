import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import ProgressBar from "../../components/ProgressBar";
import QuizSection from "../../components/QuizSection";
import { QUESTIONS, getScoreLevel } from "../../data/questions";
import { registerUser, notifyUser } from "../../services/userService";
import { constants } from "@/config/constants";
import { formatPhone } from "@/utils/formaters";
import { scrollToTop } from "@/utils/dom";
import { fetchQuestions } from "../../services/questionsService";

export default function Home() {
  // ── Estado de navegação ──────────────────────────────────
  const [step, setStep] = useState(constants.STEPS.HOME);

  // ── Estado das perguntas ─────────────────────────────────
  const [questions, setQuestions] = useState(QUESTIONS);

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

  const [userId, setUserId] = useState(null);

  // ── Estado do questionário ───────────────────────────────
  const [answers, setAnswers] = useState({});

  const topRef = useRef(null);

  // ── Helpers de progresso ─────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;
  const allAnswered = answeredCount === questions.length;

  // ── Pontuação ────────────────────────────────────────────
  const totalScore = questions.length
    ? (Object.values(answers).reduce((acc, val) => acc + Number(val || 0), 0) *
        100) /
      questions.length
    : 0;
  const scoreLevel = getScoreLevel(totalScore);

  // ── Navegação para o topo ao trocar de seção ─────────────

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Handlers ─────────────────────────────────────────────

  /** Atualiza campos do formulário de coleta */
  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  useEffect(() => {
    function handleUnload() {
      if (step !== constants.STEPS.QUIZ || allAnswered) return;

      // sendBeacon garante o envio mesmo com a página fechando
      navigator.sendBeacon(
        "/api/v1/abandoned",
        JSON.stringify({
          lead: { id: userId, ...formData },
          answeredCount,
          answers,
          abandonedAt: new Date().toISOString(),
        }),
      );
    }

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [userId, formData, answers, answeredCount]);

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
      const registeredUser = await registerUser(formData);
      const id = registeredUser.id;

      setUserId(id);
      setStep(constants.STEPS.QUIZ);
      scrollToTop(topRef);
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      setStep(constants.STEPS.QUIZ);
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
   */
  async function handleShowResult() {
    const payload = {
      lead: {
        id: userId,
      },
      answers: answers,
      result: {
        totalScore: totalScore,
        label: scoreLevel.label,
        description: scoreLevel.description,
      },
      submittedAt: new Date().toISOString(),
    };

    try {
      await notifyUser(payload);
      setStep(constants.STEPS.RESULT);
      scrollToTop(topRef);
    } catch (err) {
      console.error("Erro ao gerar diagnóstico:", err);
      alert("Não foi possível gerar o diagnóstico. Tente novamente.");
    }
  }

  // ── WhatsApp CTA link ────────────────────────────────────
  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de fazer o Raio-X Empresarial e recebi o diagnóstico: *${scoreLevel.label}*. Gostaria de saber mais sobre como melhorar os resultados da ${formData.company || "minha empresa"}.`,
  );

  const whatsappLink = `https://wa.me/5516994311448?text=${whatsappMessage}`;

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <>
      <Head>
        <title>Raio-X Empresarial</title>
      </Head>

      {/* Barra de progresso — visível apenas durante o questionário */}
      {step === constants.STEPS.QUIZ && (
        <ProgressBar
          percent={progressPercent}
          answered={answeredCount}
          total={questions.length}
        />
      )}

      {/* Ponto de ancoragem para scroll ao topo */}
      <div ref={topRef} />

      {/* ── 1. HOME ─────────────────────────────────────────── */}
      {step === constants.STEPS.HOME && (
        <section className="min-h-screen flex flex-col items-center justify-center px-5 py-10 md:py-16 max-w-2xl mx-auto">
          {/* Ícone / logo decorativo */}
          <div className="mb-8 animate-fade-in">
            <img
              src="/logo-no-text.svg"
              alt="logo"
              className="w-24 h-24 md:w-36 md:h-36"
            />
          </div>

          {/* Título principal */}
          <h1
            className="font-display text-4xl md:text-6xl text-white text-center leading-tight mb-4 md:mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            Raio-X <span className="text-gold-gradient">Empresarial</span>
          </h1>

          {/* Tag superior */}
          <p
            className="font-body text-xs tracking-[0.25em] uppercase text-brand-gold mb-4 animate-fade-in"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            Diagnóstico Empresarial
          </p>

          {/* Linha decorativa */}
          <div
            className="gold-divider animate-fade-in"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          />

          {/* Subtítulo */}
          <p
            className="font-body text-white/60 text-center text-base md:text-lg leading-relaxed max-w-md mb-4 animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            Bem-vindo. O{" "}
            <strong className="text-white">Raio-X Empresarial</strong> é uma
            avaliação rápida que identifica os principais pontos críticos da sua
            gestão — entregando um diagnóstico personalizado do estágio atual da
            sua empresa.
          </p>

          {/* ── CTA principal — */}
          <button
            onClick={async () => {
              setIsSubmitting(true);
              const loaded = await fetchQuestions();

              // Ordena por type antes de salvar
              const sorted = [...loaded].sort((a, b) =>
                (a.type || "").localeCompare(b.type || ""),
              );
              setQuestions(sorted);

              setStep(constants.STEPS.COLLECT);
              setIsSubmitting(false);
              scrollToTop(topRef);
            }}
            disabled={isSubmitting}
            className="btn-primary text-base px-12 py-5 animate-fade-up disabled:opacity-60"
            style={{ animationDelay: "0.6s", opacity: 0 }}
          >
            {isSubmitting ? "Carregando..." : "Começar agora"}
          </button>

          {/* Bloco explicativo "Como funciona" */}
          <div
            id="como-funciona"
            className="mt-20 w-full animate-fade-up border-t border-white/10 pt-12"
            style={{ animationDelay: "0.7s", opacity: 0 }}
          >
            <h2 className="font-display text-2xl text-white mb-1">
              Como funciona
            </h2>
            <div className="w-8 h-px bg-brand-gold mb-5" />
            <p className="font-body text-white/50 text-sm leading-relaxed mb-6">
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
                  desc: "Responda as perguntas de múltipla escolha sobre a gestão da sua empresa. Sem respostas certas ou erradas.",
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
                    <p className="font-body text-white text-sm font-medium mb-0.5">
                      {item.title}
                    </p>
                    <p className="font-body text-white/50 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Duração */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
              <span className="text-brand-gold">⏱</span>
              <p className="font-body text-sm text-white/45">
                Duração estimada:{" "}
                <strong className="text-white font-medium">
                  menos de 5 minutos
                </strong>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. COLETA DE DADOS ──────────────────────────────── */}
      {step === constants.STEPS.COLLECT && (
        <section className="min-h-screen flex flex-col items-center justify-center px-5 py-12 md:py-20 max-w-2xl mx-auto">
          {/* Cabeçalho */}
          <div className="w-full mb-10">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-brand-gold mb-2">
              Etapa 1 de 2
            </p>
            <h2 className="font-display text-2xl md:text-4xl text-white mb-1">
              Suas informações
            </h2>
            <div className="w-8 h-px bg-brand-gold mb-3" />
            <p className="font-body text-white/50 text-sm">
              Preencha os dados abaixo para que possamos personalizar seu
              diagnóstico.
            </p>
          </div>

          {/* Formulário */}
          <div className="w-full space-y-5">
            {/* Nome */}
            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-brand-gold/70 mb-2">
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
              <label className="block font-body text-xs uppercase tracking-widest text-brand-gold/70 mb-2">
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
              <label className="block font-body text-xs uppercase tracking-widest text-brand-gold/70 mb-2">
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
              <label className="block font-body text-xs uppercase tracking-widest text-brand-gold/70 mb-2">
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
              <label className="block font-body text-xs uppercase tracking-widest text-brand-gold/70 mb-2">
                Seu cargo
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                className={`form-input appearance-none ${formErrors.role ? "border-red-400" : ""} ${!formData.role ? "text-stone-400" : "text-white"}`}
              >
                <option value="" disabled>
                  Selecione seu cargo...
                </option>
                {constants.ROLES.map((role) => (
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
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    name="lgpdConsent"
                    checked={formData.lgpdConsent}
                    onChange={handleFormChange}
                    className="sr-only"
                    id="lgpd-checkbox"
                  />
                  <div
                    className={`
                      w-5 h-5 rounded-sm border transition-all duration-200 flex items-center justify-center pointer-events-none
                      ${
                        formData.lgpdConsent
                          ? "bg-brand-gold border-brand-gold"
                          : "bg-white/5 border-white/20 group-hover:border-brand-gold/50"
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
                <p className="font-body text-xs text-white/45 leading-relaxed">
                  Autorizo o contato via WhatsApp e e-mail informados acima para
                  receber meu diagnóstico e comunicações relacionadas. Seus
                  dados são tratados conforme a{" "}
                  <strong className="text-white font-medium">
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
            onClick={() => setStep(constants.STEPS.HOME)}
            className="mt-4 font-body text-sm text-white/35 hover:text-white/70 transition-colors duration-200"
          >
            ← Voltar ao início
          </button>
        </section>
      )}

      {/* ── 3. QUESTIONÁRIO ─────────────────────────────────── */}
      {step === constants.STEPS.QUIZ && (
        <QuizSection
          questions={questions}
          answers={answers}
          allAnswered={allAnswered}
          formData={formData}
          handleAnswer={handleAnswer}
          handleShowResult={handleShowResult}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}

      {/* ── 4. RESULTADO ────────────────────────────────────── */}
      {step === constants.STEPS.RESULT && (
        <section className="min-h-screen flex flex-col items-center justify-center px-5 py-12 md:py-20 max-w-2xl mx-auto">
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

          {/* Descrição do diagnóstico */}
          <div
            className="w-full bg-brand-navy-mid border border-white/10 rounded-sm p-6 mb-8 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <h3 className="font-body text-lg text-white font-medium mb-3">
              O que isso significa?
            </h3>
            {mounted ? (
              <p
                className="font-body text-white/60 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: scoreLevel.description.replace(/\n/g, "<br/>"),
                }}
              />
            ) : (
              <p className="font-body text-white/60 text-sm leading-relaxed">
                {scoreLevel.description
                  .replace(/<[^>]*>/g, "")
                  .replace(/\n/g, " ")}
              </p>
            )}
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
            className="font-body text-xs text-white/35 text-center animate-fade-in"
            style={{ animationDelay: "0.45s" }}
          >
            Seus dados estão protegidos conforme a LGPD. Não fazemos spam.
          </p>

          {/* Rodapé */}
          <div
            className="mt-16 w-full border-t border-white/10 pt-6 text-center animate-fade-in"
            style={{ animationDelay: "0.55s" }}
          >
            <p className="font-body text-xs text-white/25">
              Raio-X Empresarial © {new Date().getFullYear()} — Diagnóstico
              confidencial
            </p>
          </div>
        </section>
      )}
    </>
  );
}
