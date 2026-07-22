import pool from '../config/database.js'

export async function findAllAssets(testatorId) {
  const { rows } = await pool.query(`
    SELECT item_id AS id, asset_name AS name, COALESCE(asset_type, 'Uncategorized') AS category,
      NULL::text AS "nomineeName", COALESCE(disposition, 'view') AS "accessLevel", NULL::text AS "createdAt"
    FROM legacy_vault.assets a
    INNER JOIN legacy_vault.wills w ON a.will_id = w.will_id
    WHERE w.testator_id = $1
    ORDER BY asset_name ASC
  `, [testatorId])
  return rows
}

export async function findAssetById(id) {
  const { rows } = await pool.query(`
    SELECT id, name, category, nominee_name AS "nomineeName", access_level AS "accessLevel", created_at AS "createdAt"
    FROM digital_assets WHERE id = $1
  `, [id])
  return rows[0] || null
}

export async function insertAsset({ name, category, nomineeName = null, accessLevel = 'view' }) {
  const { rows } = await pool.query(`
    INSERT INTO digital_assets (name, category, nominee_name, access_level)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, category, nominee_name AS "nomineeName", access_level AS "accessLevel", created_at AS "createdAt"
  `, [name, category, nomineeName, accessLevel])
  return rows[0]
}

export async function updateAssetById(id, { name, category, nomineeName = null, accessLevel = 'view' }) {
  const { rows } = await pool.query(`
    UPDATE digital_assets SET name = $2, category = $3, nominee_name = $4, access_level = $5, updated_at = NOW()
    WHERE id = $1
    RETURNING id, name, category, nominee_name AS "nomineeName", access_level AS "accessLevel", created_at AS "createdAt"
  `, [id, name, category, nomineeName, accessLevel])
  return rows[0] || null
}

export async function deleteAssetById(id) {
  const { rowCount } = await pool.query('DELETE FROM digital_assets WHERE id = $1', [id])
  return rowCount > 0
}
