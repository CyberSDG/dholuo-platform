import json
import re
import sys
from pathlib import Path
from pdf2image import convert_from_path
import pytesseract

PDF_PATH = Path(__file__).parent.parent.parent / "AlphabetA.pdf"
OUT_RAW_TEXT = Path(__file__).parent / "ocr-raw-text.txt"
OUT_WORDS = Path(__file__).parent / "words-raw.json"

PART_OF_SPEECH = {
    'n', 'vt', 'vi', 'adv', 'adj', 'pron', 'interj', 'affix',
    'vn', 'vr', 'conj', 'prep', 'num'
}

def extract_text_from_pdf(pdf_path: Path) -> str:
    print(f"Converting PDF pages to images...")
    pages = convert_from_path(str(pdf_path), dpi=300)
    print(f"Running OCR on {len(pages)} pages...")
    full_text = ""
    for i, page in enumerate(pages):
        text = pytesseract.image_to_string(page, lang='eng', config='--psm 6')
        full_text += f"\n\n--- PAGE {i+1} ---\n\n{text}"
        print(f"  Page {i+1}/{len(pages)} done")
    return full_text

def parse_entries(text: str) -> list[dict]:
    words = []
    lines = text.split('\n')
    clean_lines = []

    for line in lines:
        line = line.strip()
        if not line or line.startswith('---') or line.startswith('DHOLUO') or line.startswith('DICTIONARY'):
            continue
        if re.match(r'^\d+$', line):
            continue
        clean_lines.append(line)

    full_text = ' '.join(clean_lines)

    # Pattern: headword (optional superscript num) followed by part of speech
    # e.g.  "abila n 1. small hut..."
    # e.g.  "1abila n 1. small hut..."
    pattern = re.compile(
        r'(?:^|\s)(\d*[a-z][a-z\'\-\.]+(?:,\s*[a-z][a-z\'\-]+)*)\s+'
        r'(n|vt|vi|adv|adj|pron|interj|vn|vr)\s+'
        r'(.+?)(?=(?:\s\d*[a-z][a-z\'\-\.]+\s+(?:n|vt|vi|adv|adj|pron|interj|vn|vr)\s)|$)',
        re.DOTALL
    )

    for match in pattern.finditer(full_text):
        raw_word = match.group(1).strip()
        pos = match.group(2).strip()
        definition = match.group(3).strip()

        # Clean superscript numbers off word
        dholuo = re.sub(r'^\d+', '', raw_word).strip()
        if len(dholuo) < 2:
            continue

        # Extract multiple definitions (numbered 1. 2. 3.)
        parts = re.split(r'\s+\d+\.\s+', definition)
        raw_meanings = [re.sub(r'^\d+\.\s*', '', p).strip() for p in parts if p.strip()]

        # Extract examples (capitalized Dholuo sentence + English sentence)
        examples = []
        for part in raw_meanings:
            ex = re.findall(r'([A-Z][a-z\'A-Z\s]+[.?!])\s+([A-Z][a-z\s\'\-]+[.?!])', part)
            for dex, een in ex:
                examples.append({'dholuo': dex.strip(), 'english': een.strip()})

        # Clean meanings
        meanings = []
        for m in raw_meanings:
            clean = re.sub(r'\{[^}]+\}', '', m)
            clean = re.sub(r'See\s+\w+', '', clean)
            clean = re.sub(r'Syn\.\s+\w+', '', clean)
            clean = re.sub(r'\[pl[.:]?\s*[^\]]+\]', '', clean)
            clean = re.sub(r'\s+', ' ', clean).strip()
            if clean:
                meanings.append({'text': clean, 'notes': None})

        # English = first meaning, split on commas
        english = []
        if meanings:
            english = [e.strip() for e in re.split(r'[,;]', meanings[0]['text']) if e.strip()]
            english = [re.sub(r'\(.*?\)', '', e).strip() for e in english if e.strip()]

        # Plural
        plural_match = re.search(r'\[pl[.:]?\s*([^\]]+)\]', definition)
        plural = plural_match.group(1).strip() if plural_match else None

        # Regional
        regional = re.findall(r'\{([^}]+)\}', definition)

        # Related (See ...)
        related = re.findall(r'See\s+(\w+)', definition)

        # Synonyms
        synonyms = re.findall(r'Syn\.\s+(\w+)', definition)

        words.append({
            'dholuo': dholuo,
            'english': [e for e in english if e][:5],
            'part_of_speech': pos,
            'meanings': meanings,
            'examples': examples if examples else None,
            'regional': regional if regional else None,
            'plural': plural,
            'synonyms': synonyms if synonyms else None,
            'related': related if related else None,
            'category': None,
            'difficulty': 'beginner',
            'audio_url': None,
            'cultural_note': None,
        })

    return words

def main():
    print(f"PDF: {PDF_PATH}")
    if not PDF_PATH.exists():
        print(f"ERROR: PDF not found at {PDF_PATH}")
        sys.exit(1)

    text = extract_text_from_pdf(PDF_PATH)
    OUT_RAW_TEXT.write_text(text, encoding='utf-8')
    print(f"Raw OCR text saved to {OUT_RAW_TEXT}")
    print(f"Raw text length: {len(text)} chars")

    words = parse_entries(text)
    print(f"Parsed {len(words)} word entries")

    OUT_WORDS.write_text(json.dumps(words, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"Words saved to {OUT_WORDS}")

    if words:
        print("\nSample entries:")
        for w in words[:5]:
            print(f"  {w['dholuo']} ({w['part_of_speech']}): {', '.join(w['english'][:2])}")

if __name__ == '__main__':
    main()
