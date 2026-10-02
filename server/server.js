import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'
import pool from './config/database.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 4000

async function initDb() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'models', 'schema.sql'), 'utf8')
    await pool.query(schema)
    console.log('Database schema ready.')
  } catch (err) {
    console.error('Schema init error:', err.message)
  }
}

initDb().then(() => {
  app.listen(port, () => console.log(`Legacy Vault API listening on port ${port}`))
})
