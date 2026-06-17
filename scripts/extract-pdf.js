const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')

const PDF_PATH = path.join(__dirname, '../../AlphabetA.pdf')
const OUTPUT_PATH = path.join(__dirname, 'words-raw.json')

// Parses one text block from the dictionary into a word entry
function parseEntry(raw) {
  // Strip superscript numbers at start e.g. "1abila", "2abila"
  const cleaned = raw.replace(/^\d+/, '').trim()

  // Match: word  pos  definition(s)
  const posMatch = cleaned.match(/^(\S+)\s+(n|vt|vi|adv|adj|pron|interj|affix|vn|vr|proper n|Swa n)\s+(.+)/s)
  if (!posMatch) return null

  const [, dholuo, pos, rest] = posMatch
  const lines = rest.trim().split(/\n\s*\d+\.\s+/).map((l) => l.replace(/^\d+\.\s+/, '').trim())

  // Extract example sentences (bold-ish: lines where a capitalized Dholuo sentence appears)
  const examples = []
  const meanings = lines.map((line) => {
    // Example: "Ia kanye? Where did you come from?" — Dholuo sentence followed by English
    const exMatch = line.match(/([A-Z][a-záéíóú''\s\w]+[.?!])\s+([A-Z].+[.?!])/)
    if (exMatch) {
      examples.push({ dholuo: exMatch[1].trim(), english: exMatch[2].trim() })
    }
    // Strip See references and regional markers for clean definition
    return line
      .replace(/\{[^}]+\}/g, '')
      .replace(/See\s+\w+/g, '')
      .replace(/Syn\.\s+\w+/g, '')
      .replace(/\[pl:[^\]]+\]/g, '')
      .trim()
  }).filter(Boolean)

  // Extract plural [pl: ...]
  const pluralMatch = rest.match(/\[pl[.:]\s*([^\]]+)\]/)
  const plural = pluralMatch ? pluralMatch[1].trim() : null

  // Extract regional markers {CN}, {SN}, {Nyando}, etc.
  const regional = [...rest.matchAll(/\{([^}]+)\}/g)].map((m) => m[1].trim())

  // Extract See references for related words
  const related = [...rest.matchAll(/See\s+(\w+)/g)].map((m) => m[1])

  // Extract synonyms
  const synonyms = [...rest.matchAll(/Syn\.\s+(\w+)/g)].map((m) => m[1])

  // Simple English extraction — first line before any examples
  const english = meanings[0]
    ? meanings[0].split(/[,;]/).map((s) => s.replace(/\(.*?\)/g, '').trim()).filter(Boolean)
    : []

  return {
    dholuo: dholuo.replace(/[',]/g, "'").trim(),
    english,
    part_of_speech: pos,
    meanings: meanings.map((text) => ({ text, notes: null })),
    examples: examples.length ? examples : null,
    regional: regional.length ? regional : null,
    plural,
    synonyms: synonyms.length ? synonyms : null,
    related: related.length ? related : null,
    category: null,
    difficulty: 'beginner',
    audio_url: null,
    cultural_note: null,
  }
}

async function main() {
  const buffer = fs.readFileSync(PDF_PATH)
  const data = await pdfParse(buffer)

  const text = data.text
  const lines = text.split('\n').filter((l) => l.trim())

  console.log(`Extracted ${lines.length} lines from PDF`)
  console.log(`Total pages: ${data.numpages}`)

  // Save raw text for inspection
  fs.writeFileSync(path.join(__dirname, 'raw-text.txt'), text)
  console.log('Raw text saved to scripts/raw-text.txt')

  // Basic split on headword pattern: line starting with a bold word
  // Each entry starts at a line that matches: optional-number + word + pos
  const entryPattern = /^\d*([a-z][a-z'''\-]+)\s+(n|vt|vi|adv|adj|pron|interj|affix|vn|vr)\s+/
  const words = []
  let current = ''

  for (const line of lines) {
    if (entryPattern.test(line) && current) {
      const entry = parseEntry(current)
      if (entry) words.push(entry)
      current = line
    } else {
      current += ' ' + line
    }
  }
  if (current) {
    const entry = parseEntry(current)
    if (entry) words.push(entry)
  }

  console.log(`Parsed ${words.length} word entries`)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(words, null, 2))
  console.log(`Saved to ${OUTPUT_PATH}`)
}

main().catch(console.error)
