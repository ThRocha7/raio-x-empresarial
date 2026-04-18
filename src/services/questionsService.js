import { api } from "@/config/client/api";

export async function fetchQuestions() {
  try {
    const { data: questions } = await api.get("quiz/questions");

    // Garantir que retornamos um array válido
    if (questions && Array.isArray(questions)) {
      return questions;
    }

    return Array.isArray(questions) ? questions : LOCAL_QUESTIONS;
  } catch (err) {
    console.warn("API unavailable. Using local fallback.", err);
    return LOCAL_QUESTIONS;
  }
}
