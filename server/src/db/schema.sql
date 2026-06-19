-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core dictionary table
CREATE TABLE IF NOT EXISTS words (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dholuo        TEXT NOT NULL,
  english       TEXT[] NOT NULL,
  part_of_speech TEXT,                  -- noun, verb, adverb, adjective, pronoun, etc.
  meanings      JSONB,                  -- [{ "text": "...", "notes": "..." }]
  examples      JSONB,                  -- [{ "dholuo": "...", "english": "..." }]
  regional      TEXT[],                 -- e.g. ["CN", "SN", "Nyando", "Ugenya"]
  plural        TEXT,
  synonyms      TEXT[],
  related       TEXT[],                 -- cross-reference words
  category      TEXT[],                 -- ["animals", "food", "greetings", ...]
  difficulty    TEXT DEFAULT 'beginner',
  audio_url     TEXT,
  cultural_note TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast search
CREATE INDEX IF NOT EXISTS idx_words_dholuo ON words (dholuo);
CREATE INDEX IF NOT EXISTS idx_words_category ON words USING GIN (category);
CREATE INDEX IF NOT EXISTS idx_words_english ON words USING GIN (english);

-- Users table (for progress tracking)
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  username   TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,            -- bcrypt hashed
  role       TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress per word
CREATE TABLE IF NOT EXISTS progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  word_id       UUID REFERENCES words(id) ON DELETE CASCADE,
  correct_count INT DEFAULT 0,
  wrong_count   INT DEFAULT 0,
  last_seen     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- Community word contributions (open source contributions)
CREATE TABLE IF NOT EXISTS contributions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id     UUID REFERENCES words(id) ON DELETE SET NULL,
  contributor TEXT,
  type        TEXT NOT NULL,           -- "new_word", "correction", "example", "audio"
  payload     JSONB NOT NULL,
  status      TEXT DEFAULT 'pending',  -- "pending", "approved", "rejected"
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON words
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
