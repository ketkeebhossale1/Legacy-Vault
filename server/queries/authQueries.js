import pool from '../config/database.js'

export async function findActiveUserByEmail(email, role) {
  const { rows } = await pool.query(`
    SELECT user_id AS id, name, email, password_hash AS "passwordHash", role
    FROM legacy_vault.users WHERE LOWER(email) = LOWER($1) AND is_active = TRUE
      AND ($2::text IS NULL OR role = $2)
  `, [email, role || null])
  return rows[0] || null
}

export async function createUser({ name, email, passwordHash }) {
  const { rows } = await pool.query(`
    INSERT INTO legacy_vault.users (name, email, password_hash, role, is_active)
    VALUES ($1, $2, $3, 'testator', TRUE)
    RETURNING user_id AS id, name, email, role
  `, [name, email, passwordHash])
  return rows[0]
}
