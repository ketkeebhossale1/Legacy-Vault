import pool from '../config/database.js'

export async function upsertAdvocate(userId, email) {
  const { rows } = await pool.query(`
    INSERT INTO legacy_vault.advocate (user_id, email, shared_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id, email) DO UPDATE
      SET shared_at = NOW()
    RETURNING advocate_id AS "id", email, shared_at AS "sharedAt"
  `, [userId, email])
  return rows[0]
}

export async function getAdvocatesByUserId(userId) {
  const { rows } = await pool.query(`
    SELECT advocate_id AS "id", email, shared_at AS "sharedAt"
    FROM legacy_vault.advocate
    WHERE user_id = $1
    ORDER BY shared_at DESC
  `, [userId])
  return rows
}
