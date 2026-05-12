import { pool } from "@/config/server/db";

export async function insertUser(values) {
  const query = `
          INSERT INTO clients (
            name,
            phone_number,
            company_name,
            company_role,
            email
          )
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (phone_number)
          DO UPDATE SET
            name = EXCLUDED.name,
            company_name = EXCLUDED.company_name,
            company_role = EXCLUDED.company_role,
            email = EXCLUDED.email
          RETURNING *;
          `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Marca o usuário como tendo abandonado o quiz.
 * Requer as colunas quiz_status e abandoned_at na tabela clients.
 *
 * Migration necessária:
 *   ALTER TABLE clients
 *     ADD COLUMN IF NOT EXISTS quiz_status   TEXT    DEFAULT 'registered',
 *     ADD COLUMN IF NOT EXISTS abandoned_at  TIMESTAMPTZ,
 *     ADD COLUMN IF NOT EXISTS answered_count INT     DEFAULT 0;
 */
export async function markUserAbandoned({ id, abandonedAt, answeredCount }) {
  const query = `
    UPDATE clients
    SET
      quiz_status    = 'abandoned',
      abandoned_at   = $2,
      answered_count = $3
    WHERE id = $1
    RETURNING id, quiz_status, abandoned_at, answered_count;
  `;

  const result = await pool.query(query, [id, abandonedAt, answeredCount]);
  return result.rows[0] ?? null;
}
