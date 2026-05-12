import { pool } from "@/config/server/db";

export async function getQuestions() {
  const query = `
    SELECT 
        id,
        text,
        options,
        category
    FROM 
        questions
    WHERE 
        activated = true
    ORDER BY 
        category;
    `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Salva ou atualiza o progresso do quiz na tabela answers.
 * Usa UPSERT por client_id — só existe uma linha por usuário.
 */
export async function upsertQuizProgress({ clientId, answers }) {
  const query = `
    INSERT INTO answers (client_id, answers, updated_at)
    VALUES ($1, $2, now())
    ON CONFLICT (client_id)
    DO UPDATE SET
      answers    = EXCLUDED.answers,
      updated_at = now()
    RETURNING id, client_id, updated_at;
  `;

  const result = await pool.query(query, [clientId, JSON.stringify(answers)]);
  return result.rows[0];
}

/**
 * Finaliza o registro com os dados do resultado.
 */
export async function completeQuizAnswer({
  clientId,
  answers,
  resultPoints,
  resultLabel,
  resultDescription,
}) {
  const query = `
    INSERT INTO answers (client_id, answers, result_points, result_label, result_description, updated_at)
    VALUES ($1, $2, $3, $4, $5, now())
    ON CONFLICT (client_id)
    DO UPDATE SET
      answers            = EXCLUDED.answers,
      result_points      = EXCLUDED.result_points,
      result_label       = EXCLUDED.result_label,
      result_description = EXCLUDED.result_description,
      updated_at         = now()
    RETURNING *;
  `;

  const result = await pool.query(query, [
    clientId,
    JSON.stringify(answers),
    resultPoints,
    resultLabel,
    resultDescription,
  ]);
  return result.rows[0];
}

/**
 * Busca usuários que estão com progresso salvo mas não completaram,
 * e ficaram inativos por mais de 15 minutos.
 * Usado pelo job de notificação de abandono.
 */
export async function findAbandonedInProgress(minutesThreshold = 15) {
  const query = `
    SELECT
      a.client_id,
      a.answers,
      a.updated_at,
      c.name,
      c.phone_number,
      c.email,
      c.company_name,
      c.company_role
    FROM answers a
    JOIN clients c ON c.id = a.client_id
    WHERE
      a.result_label IS NULL
      AND a.updated_at < now() - ($1 || ' minutes')::INTERVAL
      AND c.quiz_status = 'in_progress'
    ORDER BY a.updated_at ASC;
  `;

  const result = await pool.query(query, [minutesThreshold]);
  return result.rows;
}
