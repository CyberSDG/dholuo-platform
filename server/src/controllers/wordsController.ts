import { Request, Response } from 'express'
import { query } from '../db'

export const searchWords = async (req: Request, res: Response) => {
  const { q, category, difficulty, limit = 20, offset = 0 } = req.query

  let sql = `SELECT * FROM words WHERE 1=1`
  const params: unknown[] = []
  let i = 1

  if (q) {
    sql += ` AND (dholuo ILIKE $${i} OR EXISTS (SELECT 1 FROM unnest(english) AS e WHERE e ILIKE $${i + 1}))`
    params.push(`%${q}%`, `%${q}%`)
    i += 2
  }

  if (category) {
    sql += ` AND $${i} = ANY(category)`
    params.push(category)
    i++
  }

  if (difficulty) {
    sql += ` AND difficulty = $${i}`
    params.push(difficulty)
    i++
  }

  sql += ` ORDER BY dholuo ASC LIMIT $${i} OFFSET $${i + 1}`
  params.push(Number(limit), Number(offset))

  const result = await query(sql, params)
  res.json({ data: result.rows, total: result.rowCount })
}

export const getWord = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await query(`SELECT * FROM words WHERE id = $1`, [id])

  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Word not found' })
    return
  }

  res.json(result.rows[0])
}

export const getCategories = async (_req: Request, res: Response) => {
  const result = await query(
    `SELECT DISTINCT unnest(category) AS category FROM words ORDER BY category`
  )
  res.json(result.rows.map((r) => r.category))
}

export const getRandomWords = async (req: Request, res: Response) => {
  const { limit = 10, category } = req.query
  let sql = `SELECT * FROM words`
  const params: unknown[] = []

  if (category) {
    sql += ` WHERE $1 = ANY(category)`
    params.push(category)
  }

  sql += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`
  params.push(Number(limit))

  const result = await query(sql, params)
  res.json(result.rows)
}

export const submitContribution = async (req: Request, res: Response) => {
  const { word_id, contributor, type, payload } = req.body

  if (!type || !payload) {
    res.status(400).json({ error: 'type and payload are required' })
    return
  }

  const result = await query(
    `INSERT INTO contributions (word_id, contributor, type, payload)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [word_id || null, contributor || 'anonymous', type, JSON.stringify(payload)]
  )

  res.status(201).json(result.rows[0])
}
