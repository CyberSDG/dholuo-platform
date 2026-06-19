const { Pool } = require('../server/node_modules/pg')
const fs = require('fs')
const path = require('path')
require('../server/node_modules/dotenv').config({ path: path.join(__dirname, '../server/.env') })

const words = JSON.parse(fs.readFileSync(path.join(__dirname, 'words-parsed.json'), 'utf-8'))

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function seed() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    let inserted = 0
    let skipped = 0

    for (const word of words) {
      if (!word.dholuo || !word.english?.length) { skipped++; continue }
      word.dholuo = word.dholuo.replace(/\.+$/, '').trim()

      await client.query(
        `INSERT INTO words (dholuo, english, part_of_speech, meanings, examples, regional, plural, synonyms, related, category, difficulty)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT DO NOTHING`,
        [
          word.dholuo,
          word.english,
          word.part_of_speech,
          word.meanings ? JSON.stringify(word.meanings) : null,
          word.examples ? JSON.stringify(word.examples) : null,
          word.regional,
          word.plural,
          word.synonyms,
          word.related,
          word.category,
          word.difficulty,
        ]
      )
      inserted++
    }

    await client.query('COMMIT')
    console.log(`Seeded: ${inserted} words, skipped: ${skipped}`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(console.error)
