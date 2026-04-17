import { fetchQuestions } from "@/server/services/quizService";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const questions = await fetchQuestions();
    return res.status(200).json(questions);
  } catch (err) {
    console.error(`Error: ${err}`);
    return res.status(500).json({ error: "Unable to fetch questions" });
  }
}
