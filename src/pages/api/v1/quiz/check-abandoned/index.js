import { findAbandonedInProgress } from "@/server/repositories/quizRepository";
import { markUserAbandoned } from "@/server/repositories/userRepository";
import { externalApi } from "@/config/server/api";

/**
 * Endpoint chamado por um cron job a cada ~5 minutos.
 * Detecta usuários inativos há mais de 15min e notifica.
 *
 * Proteja com um secret para não ser chamado por qualquer um:
 *   Authorization: Bearer <CRON_SECRET>
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const abandoned = await findAbandonedInProgress(15);

    if (abandoned.length === 0) {
      return res.status(200).json({ notified: 0 });
    }

    const results = await Promise.allSettled(
      abandoned.map(async (user) => {
        // Marca como abandonado no banco
        await markUserAbandoned({
          id: user.client_id,
          abandonedAt: new Date().toISOString(),
          answeredCount: user.answers ? Object.keys(user.answers).length : 0,
        });

        // Notifica serviço externo
        await externalApi.post("/", {
          process: "notifyAbandoned",
          lead: {
            id: user.client_id,
            name: user.name,
            phoneNumber: user.phone_number,
            email: user.email,
            company: user.company_name,
            role: user.company_role,
          },
          answeredCount: user.answers ? Object.keys(user.answers).length : 0,
          abandonedAt: user.updated_at,
        });
      }),
    );

    const notified = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`check-abandoned: ${notified} notificados, ${failed} falhas`);
    return res.status(200).json({ notified, failed });
  } catch (err) {
    console.error("check-abandoned error:", err.message);
    return res.status(500).json({ error: "Erro interno." });
  }
}
