import pool from '../config/database.js'

export async function findAuditLogsByUserId(userId) {
  const { rows } = await pool.query(`
    SELECT log_id AS id, action AS event, COALESCE(details->>'actor', 'Vault owner') AS actor,
      created_at AS timestamp
    FROM legacy_vault.audit_log
    WHERE user_id = $1
    ORDER BY created_at DESC
  `, [userId])
  return rows
}
