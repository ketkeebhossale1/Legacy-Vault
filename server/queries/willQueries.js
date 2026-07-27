import pool from '../config/database.js'

export async function getWillByUserId(userId) {
  const { rows } = await pool.query(`
    SELECT
      text,
      saved,
      shared_with              AS "sharedWith",
      certificate_file         AS "certificateFile",
      certificate_uploaded_at  AS "certificateUploadedAt",
      updated_at               AS "updatedAt"
    FROM legacy_vault.digital_will
    WHERE user_id = $1
  `, [userId])
  return rows[0] || null
}

export async function upsertWill(userId, { text, saved, sharedWith }) {
  const { rows } = await pool.query(`
    INSERT INTO legacy_vault.digital_will (user_id, text, saved, shared_with, updated_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (user_id) DO UPDATE
      SET text        = EXCLUDED.text,
          saved       = EXCLUDED.saved,
          shared_with = EXCLUDED.shared_with,
          updated_at  = NOW()
    RETURNING
      text,
      saved,
      shared_with             AS "sharedWith",
      certificate_file        AS "certificateFile",
      certificate_uploaded_at AS "certificateUploadedAt",
      updated_at              AS "updatedAt"
  `, [userId, text, saved, sharedWith])
  return rows[0]
}

export async function saveCertificate(userId, filename) {
  const { rows } = await pool.query(`
    UPDATE legacy_vault.digital_will
    SET certificate_file        = $1,
        certificate_uploaded_at = NOW()
    WHERE user_id = $2
    RETURNING
      text,
      saved,
      shared_with             AS "sharedWith",
      certificate_file        AS "certificateFile",
      certificate_uploaded_at AS "certificateUploadedAt",
      updated_at              AS "updatedAt"
  `, [filename, userId])
  return rows[0] || null
}
