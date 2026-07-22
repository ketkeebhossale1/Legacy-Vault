import pool from '../config/database.js'

export async function getAllActiveNominees() {
  const { rows } = await pool.query(`
    SELECT
      nominee_id       AS id,
      first_name       AS "firstName",
      last_name        AS "lastName",
      email,
      address,
      asset_name       AS "assetName",
      asset_percentage AS "assetPercentage",
      is_active        AS "isActive",
      created_at       AS "createdAt"
    FROM legacy_vault.nominee
    WHERE is_active = TRUE
    ORDER BY created_at ASC
  `)
  return rows
}

export async function createNominee({ firstName, lastName, email, address, assetName, assetPercentage }) {
  const { rows } = await pool.query(`
    INSERT INTO legacy_vault.nominee
      (first_name, last_name, email, address, asset_name, asset_percentage, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, TRUE)
    RETURNING
      nominee_id       AS id,
      first_name       AS "firstName",
      last_name        AS "lastName",
      email,
      address,
      asset_name       AS "assetName",
      asset_percentage AS "assetPercentage",
      is_active        AS "isActive",
      created_at       AS "createdAt"
  `, [firstName, lastName, email, address, assetName, assetPercentage])
  return rows[0]
}

/**
 * Edit strategy: deactivate the old row, insert a new one with merged data.
 * Returns the newly inserted row.
 */
export async function editNominee(nomineeId, fields) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Fetch current active row
    const { rows: existing } = await client.query(`
      SELECT first_name, last_name, email, address, asset_name, asset_percentage
      FROM legacy_vault.nominee
      WHERE nominee_id = $1 AND is_active = TRUE
    `, [nomineeId])

    if (existing.length === 0) {
      await client.query('ROLLBACK')
      return null
    }

    const old = existing[0]

    // Merge old values with incoming fields
    const firstName       = fields.firstName       ?? old.first_name
    const lastName        = fields.lastName        ?? old.last_name
    const email           = fields.email           ?? old.email
    const address         = fields.address         ?? old.address
    const assetName       = fields.assetName       ?? old.asset_name
    const assetPercentage = fields.assetPercentage ?? old.asset_percentage

    // Deactivate old row
    await client.query(`
      UPDATE legacy_vault.nominee
      SET is_active = FALSE, updated_at = NOW()
      WHERE nominee_id = $1
    `, [nomineeId])

    // Insert new active row
    const { rows: inserted } = await client.query(`
      INSERT INTO legacy_vault.nominee
        (first_name, last_name, email, address, asset_name, asset_percentage, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING
        nominee_id       AS id,
        first_name       AS "firstName",
        last_name        AS "lastName",
        email,
        address,
        asset_name       AS "assetName",
        asset_percentage AS "assetPercentage",
        is_active        AS "isActive",
        created_at       AS "createdAt"
    `, [firstName, lastName, email, address, assetName, assetPercentage])

    await client.query('COMMIT')
    return inserted[0]
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
