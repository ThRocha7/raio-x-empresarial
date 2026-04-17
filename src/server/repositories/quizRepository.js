import { pool } from "@/config/db";

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
