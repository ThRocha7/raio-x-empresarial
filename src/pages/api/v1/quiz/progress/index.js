import { upsertQuizProgress } from "@/server/repositories/quizRepository";
import { markUserInProgress } from "@/server/repositories/userRepository";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { clientId, answers } = req.body;

  if (!clientId || !answers) {
    return res
      .status(400)
      .json({ error: "clientId e answers são obrigatórios." });
  }

  try {
    const [progress] = await Promise.all([
      upsertQuizProgress({ clientId, answers }),
      markUserInProgress({ id: clientId }),
    ]);

    return res.status(200).json({ ok: true, updatedAt: progress.updated_at });
  } catch (err) {
    console.error("quiz/progress error:", err.message);
    return res.status(500).json({ error: "Erro ao salvar progresso." });
  }
}
