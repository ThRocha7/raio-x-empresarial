import { getQuestions } from "../repositories/quizRepository";

export async function fetchQuestions() {
  const questions = await getQuestions();
  return questions;
}
