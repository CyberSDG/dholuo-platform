import { Request, Response } from 'express'
import { query } from '../db'

export const listContributions = async (req: Request, res: Response) => {
  const { status = 'pending' } = req.query
  const result = await query(
    `SELECT c.*, w.dholuo AS word_dholuo, w.english AS word_english
     FROM contributions c
     LEFT JOIN words w ON c.word_id = w.id
     WHERE c.status = $1
     ORDER BY c.created_at DESC`,
    [status]
  )
  res.json(result.rows)
}

export const approveContribution = async (req: Request, res: Response) => {
  const { id } = req.params
  const contrib = await query(`SELECT * FROM contributions WHERE id = $1`, [id])

  if (contrib.rowCount === 0) {
    res.status(404).json({ error: 'Contribution not found' })
    return
  }

  const c = contrib.rows[0]
  const payload = c.payload

  if (c.type === 'new_word') {
    const english = payload.english
      ? payload.english.split(',').map((s: string) => s.trim())
      : []

    await query(
      `INSERT INTO words (dholuo, english, cultural_note, difficulty)
       VALUES ($1, $2, $3, 'beginner')`,
      [payload.dholuo, english, payload.culturalNote || null]
    )
  } else if (c.type === 'correction') {
    if (!c.word_id) {
      res.status(400).json({ error: 'No word linked to this correction' })
      return
    }
    const updates: string[] = []
    const params: unknown[] = []
    let i = 1

    if (payload.corrected_dholuo) {
      updates.push(`dholuo = $${i++}`)
      params.push(payload.corrected_dholuo)
    }
    if (payload.corrected_english) {
      const english = payload.corrected_english.split(',').map((s: string) => s.trim())
      updates.push(`english = $${i++}`)
      params.push(english)
    }

    if (updates.length > 0) {
      params.push(c.word_id)
      await query(
        `UPDATE words SET ${updates.join(', ')} WHERE id = $${i}`,
        params
      )
    }
  } else if (c.type === 'example') {
    if (!c.word_id) {
      res.status(400).json({ error: 'No word linked to this example' })
      return
    }
    const newExample = {
      dholuo: payload.example_dholuo,
      english: payload.example_english,
    }
    await query(
      `UPDATE words
       SET examples = COALESCE(examples, '[]'::jsonb) || $1::jsonb
       WHERE id = $2`,
      [JSON.stringify([newExample]), c.word_id]
    )
  }

  await query(
    `UPDATE contributions SET status = 'approved' WHERE id = $1`,
    [id]
  )

  res.json({ message: 'Approved and applied' })
}

export const rejectContribution = async (req: Request, res: Response) => {
  const { id } = req.params
  await query(`UPDATE contributions SET status = 'rejected' WHERE id = $1`, [id])
  res.json({ message: 'Rejected' })
}

export const getStats = async (_req: Request, res: Response) => {
  const result = await query(`
    SELECT
      (SELECT COUNT(*) FROM words) AS total_words,
      (SELECT COUNT(*) FROM contributions WHERE status = 'pending') AS pending,
      (SELECT COUNT(*) FROM contributions WHERE status = 'approved') AS approved,
      (SELECT COUNT(*) FROM contributions WHERE status = 'rejected') AS rejected,
      (SELECT COUNT(*) FROM users) AS total_users
  `)
  res.json(result.rows[0])
}
