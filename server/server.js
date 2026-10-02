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
    // Split on semicolons and run each statement individually
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    for (const stmt of statements) {
      try {
        await pool.query(stmt)
      } catch (err) {
        console.error('Schema statement error (continuing):', err.message, '\nStatement:', stmt.slice(0, 80))
      }
    }
    console.log('Database schema ready.')
  } catch (err) {
    console.error('Schema init error:', err.message)
  }
}

initDb().then(() => {
  app.listen(port, () => console.log(`Legacy Vault API listening on port ${port}`))
})
