import { pool } from "@/config/db";

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
