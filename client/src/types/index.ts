export interface Word {
  id: string
  dholuo: string
  english: string[]
  part_of_speech: string | null
  meanings: { text: string; notes: string | null }[] | null
  examples: { dholuo: string; english: string }[] | null
  regional: string[] | null
  plural: string | null
  synonyms: string[] | null
  related: string[] | null
  category: string[] | null
  difficulty: string
  audio_url: string | null
  cultural_note: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  username: string
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface TranslateResponse {
  original: string
  translated: string
  source: string
  target: string
}
