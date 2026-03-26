import axios from "axios";
import { QUESTIONS as LOCAL_QUESTIONS } from "../data/questions";

const api = axios.create({ baseURL: "/api/v1" });

export async function fetchQuestions() {
  try {
    const response = await api.post("/questions");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.data;

    // Garantir que retornamos um array válido
    if (data?.questions && Array.isArray(data.questions)) {
      return data.questions;
    }

    return Array.isArray(data) ? data : LOCAL_QUESTIONS;
  } catch (err) {
    console.warn("API indisponível. Usando fallback local.", err);
    return LOCAL_QUESTIONS;
  }
}
