# Dholuo.learn

> A modern, open-source platform for learning Dholuo — built by the community, for the community.

Dholuo (also called Luo) is the language of the Luo people of Kenya and East Africa. It carries centuries of culture, identity, and oral tradition. Yet many young Luo people today — especially those growing up in cities or in the diaspora — are losing fluency, not because they don't care, but because there has never been a modern, accessible way to learn it.

**Dholuo.learn** is changing that.

---

## Features

- **Dictionary** — Search thousands of Dholuo words with English meanings, example sentences, part of speech, regional variants, and cultural context
- **Flashcard Practice** — Spaced-repetition drills that adapt to what you know
- **Structured Lessons** — Beginner to advanced content grouped by topic: greetings, numbers, family, food, daily life
- **Live Translator** — English ↔ Dholuo translation powered by Google Translate
- **AI Conversation Partner** — Practice real Dholuo conversation with an AI that teaches as you go
- **Community Contributions** — Anyone can submit a missing word, fix a translation, or add an example sentence

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Translation | Google Cloud Translation API |
| Deployment | Railway (backend + DB) + Vercel (frontend) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Python 3.10+ (for PDF data extraction only)

### 1. Clone the repository

```bash
git clone https://github.com/CyberSDG/dholuo-platform.git
cd dholuo-platform
```

### 2. Install dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install:all
```

Or install separately:

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Set up the database

Create a PostgreSQL database:

```bash
createdb dholuo_platform
```

Run the schema:

```bash
psql dholuo_platform < server/src/db/schema.sql
```

### 4. Configure environment variables

**Server** — copy and fill in `server/.env`:

```bash
cp server/.env.example server/.env
```

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/dholuo_platform
JWT_SECRET=your_long_random_secret_here
CLIENT_URL=http://localhost:5173
GOOGLE_TRANSLATE_API_KEY=your_google_api_key  # optional for translation feature
```

**Client** — copy `client/.env.example`:

```bash
cp client/.env.example client/.env
```

### 5. Seed the dictionary data

```bash
npm run seed
```

This loads the extracted Dholuo dictionary entries into your database.

### 6. Run the development servers

In two separate terminals:

```bash
# Terminal 1 — backend (runs on :4000)
cd server && npm run dev

# Terminal 2 — frontend (runs on :5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
dholuo-platform/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── api/               # API client (axios)
│       ├── components/        # Shared UI components
│       ├── pages/             # Route-level pages
│       └── types/             # TypeScript types
├── server/                    # Express backend
│   └── src/
│       ├── controllers/       # Route handlers
│       ├── db/                # PostgreSQL connection + schema
│       ├── middleware/        # Auth, error handling
│       └── routes/            # API route definitions
└── scripts/                   # Data pipeline
    ├── ocr-pdf.py             # OCR extraction from dictionary PDFs
    └── seed-db.js             # Database seeder
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/words/search?q=&category=` | Search words |
| `GET` | `/api/words/random?limit=10` | Random words for practice |
| `GET` | `/api/words/categories` | All word categories |
| `GET` | `/api/words/:id` | Single word detail |
| `POST` | `/api/words/contribute` | Submit a word contribution |
| `POST` | `/api/translate` | Translate text |
| `POST` | `/api/auth/register` | Register |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Current user |

---

## Dictionary Data

The word data comes from a digitized Dholuo-English dictionary processed through OCR. The raw extracted data lives in `scripts/words-raw.json`.

To re-extract from a PDF:

```bash
# Requires: pip install pytesseract pdf2image Pillow
# Requires: brew install tesseract poppler
npm run extract
```

We are actively working to expand the dictionary. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add words.

---

## Deployment

### Backend (Railway)

1. Create a new Railway project
2. Add a PostgreSQL database service
3. Deploy the `server/` directory
4. Set environment variables in Railway dashboard
5. Run the schema and seed via Railway's shell

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set root directory to `client/`
3. Set `VITE_API_URL` to your Railway backend URL
4. Deploy

---

## Contributing

We welcome contributions of all kinds — code, words, translations, and cultural knowledge.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

---

## Roadmap

- [x] Dictionary search
- [x] Flashcard practice
- [x] Community contributions
- [x] English ↔ Dholuo translator
- [ ] Structured lessons (beginner → advanced)
- [ ] AI conversation partner
- [ ] Audio pronunciation for every word
- [ ] User progress tracking
- [ ] Mobile app (Flutter)
- [ ] Dholuo keyboard / input tool
- [ ] English → Dholuo dictionary (reverse lookup)

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE).

---

## A note on the language

Dholuo has regional variations across Nyanza — South Nyanza (SN), Central Nyanza (CN), Nyando, Ugenya, and North Nyanza (N Nyanza). Where a word belongs to a specific region, it is marked accordingly. We aim to represent the full breadth of the language rather than a single standardized form.

If something is wrong, missing, or could be better — please contribute. This dictionary belongs to the community.
