import pg from 'pg'

const { Pool } = pg

// One pool is shared by query modules; credentials belong in server/.env.
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default pool
