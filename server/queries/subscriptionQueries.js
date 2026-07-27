import pool from '../config/database.js'

export async function upgradePlan(userId, plan, expiresAt) {
  const { rows } = await pool.query(`
    UPDATE legacy_vault.users
    SET plan = $1, plan_expires_at = $2
    WHERE user_id = $3
    RETURNING user_id AS id, name, email, role, plan, plan_expires_at AS "planExpiresAt"
  `, [plan, expiresAt, userId])
  return rows[0] || null
}

export async function getUserPlan(userId) {
  const { rows } = await pool.query(`
    SELECT plan, plan_expires_at AS "planExpiresAt"
    FROM legacy_vault.users
    WHERE user_id = $1 AND is_active = TRUE
  `, [userId])
  return rows[0] || null
}

// Returns existing row if session already claimed, null if fresh
export async function findPaymentSession(sessionId) {
  const { rows } = await pool.query(`
    SELECT session_id AS "sessionId", user_id AS "userId", plan, used_at AS "usedAt"
    FROM legacy_vault.payment_sessions
    WHERE session_id = $1
  `, [sessionId])
  return rows[0] || null
}

// Claim a session — fails silently if already claimed (unique PK)
export async function claimPaymentSession(sessionId, userId, plan) {
  const { rows } = await pool.query(`
    INSERT INTO legacy_vault.payment_sessions (session_id, user_id, plan)
    VALUES ($1, $2, $3)
    ON CONFLICT (session_id) DO NOTHING
    RETURNING session_id AS "sessionId"
  `, [sessionId, userId, plan])
  // rows[0] exists only if the INSERT succeeded (i.e. not a duplicate)
  return rows[0] || null
}
