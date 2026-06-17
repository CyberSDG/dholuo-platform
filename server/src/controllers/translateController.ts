import { Request, Response } from 'express'

const GOOGLE_TRANSLATE_URL = 'https://translation.googleapis.com/language/translate/v2'

export const translate = async (req: Request, res: Response) => {
  const { text, source = 'en', target = 'luo' } = req.body

  if (!text) {
    res.status(400).json({ error: 'text is required' })
    return
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    res.status(503).json({ error: 'Translation service not configured' })
    return
  }

  const response = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source, target, format: 'text' }),
  })

  if (!response.ok) {
    res.status(502).json({ error: 'Translation service error' })
    return
  }

  const data = await response.json() as {
    data: { translations: { translatedText: string }[] }
  }

  res.json({
    original: text,
    translated: data.data.translations[0].translatedText,
    source,
    target,
  })
}
