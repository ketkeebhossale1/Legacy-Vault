import pool from '../config/database.js'

export async function findActivityByUserId(userId) {
  const { rows } = await pool.query(`
    -- Nominee / Executor added (active rows)
    SELECT
      nominee_id::text                                           AS id,
      CASE
        WHEN is_executor THEN 'Executor added: ' || first_name || ' ' || last_name
        ELSE 'Nominee added: ' || first_name || ' ' || last_name
      END                                                        AS event,
      CASE WHEN is_executor THEN 'executor_add' ELSE 'nominee_add' END AS type,
      first_name || ' ' || last_name                            AS name,
      email                                                      AS detail,
      created_at                                                 AS timestamp
    FROM legacy_vault.nominee
    WHERE user_id = $1 AND is_active = TRUE

    UNION ALL

    -- Nominee / Executor updated (inactive rows = superseded versions)
    SELECT
      nominee_id::text                                           AS id,
      CASE
        WHEN is_executor THEN 'Executor updated: ' || first_name || ' ' || last_name
        ELSE 'Nominee updated: ' || first_name || ' ' || last_name
      END                                                        AS event,
      CASE WHEN is_executor THEN 'executor_update' ELSE 'nominee_update' END AS type,
      first_name || ' ' || last_name                            AS name,
      email                                                      AS detail,
      updated_at                                                 AS timestamp
    FROM legacy_vault.nominee
    WHERE user_id = $1 AND is_active = FALSE AND updated_at IS NOT NULL

    UNION ALL

    -- Digital will events
    SELECT
      user_id::text                                              AS id,
      CASE WHEN saved THEN 'Digital will saved' ELSE 'Digital will updated' END AS event,
      CASE WHEN saved THEN 'will_saved' ELSE 'will_updated' END AS type,
      'Digital Will'                                             AS name,
      CASE WHEN array_length(shared_with, 1) > 0
        THEN 'Shared with ' || array_to_string(shared_with, ', ')
        ELSE NULL
      END                                                        AS detail,
      updated_at                                                 AS timestamp
    FROM legacy_vault.digital_will
    WHERE user_id = $1

    UNION ALL

    -- Will shared with advocate
    SELECT
      advocate_id::text                                          AS id,
      'Will shared with advocate'                                AS event,
      'advocate_share'                                           AS type,
      email                                                      AS name,
      email                                                      AS detail,
      shared_at                                                  AS timestamp
    FROM legacy_vault.advocate
    WHERE user_id = $1

    ORDER BY timestamp DESC
  `, [userId])
  return rows
}
