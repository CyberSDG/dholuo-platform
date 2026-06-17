import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../db'

const JWT_SECRET = process.env.JWT_SECRET!

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    res.status(400).json({ error: 'email, username and password are required' })
    return
  }

  const existing = await query(
    `SELECT id FROM users WHERE email = $1 OR username = $2`,
    [email, username]
  )
  if (existing.rowCount && existing.rowCount > 0) {
    res.status(409).json({ error: 'Email or username already taken' })
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  const result = await query(
    `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username`,
    [email, username, hashed]
  )

  const user = result.rows[0]
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

  res.status(201).json({ user, token })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' })
    return
  }

  const result = await query(`SELECT * FROM users WHERE email = $1`, [email])
  if (result.rowCount === 0) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const user = result.rows[0]
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
  const { password: _, ...safeUser } = user

  res.json({ user: safeUser, token })
}

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as Request & { userId: string }).userId
  const result = await query(
    `SELECT id, email, username, created_at FROM users WHERE id = $1`,
    [userId]
  )
  res.json(result.rows[0])
}
