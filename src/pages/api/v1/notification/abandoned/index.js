import { externalApi } from "@/config/server/api";
import { markUserAbandoned } from "@/server/repositories/userRepository";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!req.body) return res.status(400).json({ error: "Invalid body." });

  const { lead, abandonedAt, answeredCount } = req.body;

  try {
    // 1. Persiste o status de abandono no banco (best-effort)
    if (lead?.id) {
      try {
        await markUserAbandoned({
          id: lead.id,
          abandonedAt: abandonedAt ?? new Date().toISOString(),
          answeredCount: answeredCount ?? 0,
        });
      } catch (dbErr) {
        // Não bloqueia o fluxo — o registro externo ainda deve ocorrer
        console.error("DB mark abandoned error:", dbErr.message);
      }
    }

    // 2. Notifica serviço externo
    const response = await externalApi.post("/", {
      ...req.body,
      process: "notifyAbandoned",
    });

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("API error:", err.response?.data ?? err.message);
    return res
      .status(err.response?.status || 500)
      .json({ error: "Internal error." });
  }
}
