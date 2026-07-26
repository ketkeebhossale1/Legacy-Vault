import pool from '../config/database.js'

export async function findActiveUserByEmail(email, role) {
  const { rows } = await pool.query(`
    SELECT user_id AS id, name, email, password_hash AS "passwordHash", role,
      COALESCE(plan, 'free') AS plan, plan_expires_at AS "planExpiresAt"
    FROM legacy_vault.users WHERE LOWER(email) = LOWER($1) AND is_active = TRUE
      AND ($2::text IS NULL OR role = $2)
  `, [email, role || null])
  return rows[0] || null
}

export async function createUser({ name, email, passwordHash }) {
  const { rows } = await pool.query(`
    INSERT INTO legacy_vault.users (name, email, password_hash, role, is_active)
    VALUES ($1, $2, $3, 'testator', TRUE)
    RETURNING user_id AS id, name, email, role,
      COALESCE(plan, 'free') AS plan,
      plan_expires_at AS "planExpiresAt"
  `, [name, email, passwordHash])
  return rows[0]
}

export async function findUserById(userId) {
  const { rows } = await pool.query(`
    SELECT user_id AS id, name, email, phone, role
    FROM legacy_vault.users WHERE user_id = $1 AND is_active = TRUE
  `, [userId])
  return rows[0] || null
}

export async function storeResetToken(email, token, expiresAt) {
  const { rows } = await pool.query(`
    UPDATE legacy_vault.users
    SET reset_token = $1, reset_token_expires = $2
    WHERE LOWER(email) = LOWER($3) AND is_active = TRUE
    RETURNING user_id AS id, email
  `, [token, expiresAt, email])
  return rows[0] || null
}

export async function findUserByResetToken(token) {
  const { rows } = await pool.query(`
    SELECT user_id AS id, email
    FROM legacy_vault.users
    WHERE reset_token = $1
      AND reset_token_expires > NOW()
      AND is_active = TRUE
  `, [token])
  return rows[0] || null
}

export async function updatePasswordAndClearToken(userId, passwordHash) {
  await pool.query(`
    UPDATE legacy_vault.users
    SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
    WHERE user_id = $2
  `, [passwordHash, userId])
}
