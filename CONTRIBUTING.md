# Contributing to Dholuo.learn

First — thank you. Every contribution to this project, whether it is a line of code, a missing word, or a cultural note, helps preserve something real. Dholuo is a living language, and this platform only becomes more accurate and more useful when people who know the language take part in building it.

---

## Ways to Contribute

You do not need to be a developer to contribute. There are several ways to help:

| Contribution type | Who it's for |
|------------------|-------------|
| Add a missing word | Anyone who knows Dholuo |
| Fix an incorrect translation | Native speakers and fluent learners |
| Add example sentences | Anyone who knows how a word is used |
| Add cultural notes or proverbs | Community members |
| Improve OCR/data quality | Developers and language enthusiasts |
| Build new features | Developers |
| Fix bugs | Developers |
| Improve documentation | Anyone |

---

## Adding Words (Non-Developer Path)

You do not need to write code to add words. Use the **Contribute** page on the platform itself:

1. Go to `/contribute` on the site
2. Fill in the Dholuo word, English meaning, and optionally an example sentence
3. Submit — your entry goes into the contributions queue for review

Alternatively, open a GitHub Issue with the label `vocabulary` and include:
- The Dholuo word
- Its English meaning
- Part of speech (noun, verb, adverb, adjective...)
- An example sentence if you know one
- Any regional notes (South Nyanza, Central Nyanza, Nyando, etc.)

---

## Developer Setup

### 1. Fork and clone

```bash
git clone https://github.com/CyberSDG/dholuo-platform.git
cd dholuo-platform
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Set up the database

```bash
createdb dholuo_platform
psql dholuo_platform < server/src/db/schema.sql
```

### 4. Configure environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in `server/.env` with your local database URL and a JWT secret.

### 5. Seed dictionary data

```bash
node scripts/seed-db.js
```

### 6. Run the development servers

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## Making a Pull Request

1. **Branch from `main`** — name your branch clearly:
   - `feature/lesson-page`
   - `fix/search-query-bug`
   - `data/add-b-dictionary`

2. **Keep PRs focused** — one feature or fix per PR. Small PRs are reviewed faster.

3. **Write clear commit messages** — explain what changed and why, not just what.

4. **Test your changes** — make sure both client and server TypeScript compile without errors:

   ```bash
   cd server && npx tsc --noEmit
   cd client && npx tsc --noEmit
   ```

5. **Open the PR** with:
   - A description of what you changed
   - Why it was needed
   - Screenshots for UI changes

---

## Code Standards

### TypeScript

- All new code must be in TypeScript — no plain `.js` files in `server/src/` or `client/src/`
- Avoid `any` — use proper types or `unknown`
- Keep types in `client/src/types/index.ts` for shared interfaces

### Backend

- New API routes go in `server/src/routes/`
- Business logic goes in `server/src/controllers/`
- All database queries go through `server/src/db/index.ts`
- Never expose raw database errors to the client in production

### Frontend

- Components go in `client/src/components/` (shared) or `client/src/pages/` (route-level)
- API calls go through `client/src/api/index.ts` — do not call `fetch` or `axios` directly from components
- Use Tailwind classes for styling — avoid inline styles

---

## Data Contributions (Dictionary Improvement)

The raw dictionary data lives in `scripts/words-raw.json`. If you want to improve the data quality directly:

1. Edit entries in `words-raw.json` — fix spellings, clean up garbled OCR text, add missing fields
2. Each entry follows this structure:

```json
{
  "dholuo": "chiemo",
  "english": ["food"],
  "part_of_speech": "noun",
  "meanings": [
    { "text": "food, meal", "notes": null }
  ],
  "examples": [
    { "dholuo": "Chiemo obed maber.", "english": "May the food be good." }
  ],
  "regional": null,
  "plural": "chiemo",
  "synonyms": [],
  "related": [],
  "category": ["food", "daily life"],
  "difficulty": "beginner",
  "audio_url": null,
  "cultural_note": null
}
```

3. Re-seed the database:

```bash
node scripts/seed-db.js
```

### Category tags

When adding or editing entries, use consistent category tags so words group properly for lessons:

```
greetings, numbers, family, body, food, animals, nature, weather,
time, places, verbs, emotions, culture, proverbs, clothing, tools
```

---

## Reporting Issues

Open a GitHub Issue and include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser / OS if it's a UI issue

Label issues appropriately: `bug`, `vocabulary`, `feature`, `documentation`, `data-quality`.

---

## A Note on Accuracy

Dholuo is not a language that was built for digital systems. Translating it accurately — especially capturing grammar, tone, and cultural meaning — requires human knowledge, not just algorithms. If you are a native speaker or a fluent learner and you see something wrong, please correct it. Your knowledge is the most valuable thing this project has.

Regional variants are real and valid. A word marked `{CN}` (Central Nyanza) or `{SN}` (South Nyanza) is not wrong — it is regionally specific. We aim to include all variants with proper labelling rather than standardizing to one dialect.

---

We are grateful for every contribution, large or small.
