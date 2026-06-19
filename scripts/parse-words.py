#!/usr/bin/env python3
"""
Parse the Asenath Bole Odaga English-Dholuo dictionary.
Multiple entries can appear on the same line due to OCR column merging,
so we work on the full text with regex, not line-by-line.
"""

import re
import json

INPUT_FILE = 'words.txt'
OUTPUT_FILE = 'words-parsed.json'

POS_MAP = {
    'n': 'noun', 'vt': 'verb', 'vi': 'verb', 'v': 'verb',
    'vt & i': 'verb', 'vt&i': 'verb', 'vt & vi': 'verb',
    'adj': 'adjective', 'adv': 'adverb', 'prep': 'preposition',
    'conj': 'conjunction', 'pron': 'pronoun',
    'interj': 'interjection', 'excl': 'exclamation',
}

def normalize_pos(raw: str) -> str:
    key = raw.strip().lower().replace(' ', '').replace('&', '&')
    for k, v in POS_MAP.items():
        if key == k.replace(' ', ''):
            return v
    return raw.strip().lower()

def extract_primary_dholuo(definition: str) -> str:
    """First Dholuo word/phrase before comma, dash, semicolon, or period."""
    definition = definition.strip()
    primary = re.split(r'[,\-;]', definition)[0].strip().rstrip('.')
    primary = re.sub(r'\s+', ' ', primary).strip()
    # Remove leading quotes or special chars
    primary = primary.lstrip('"\'`')
    return primary

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse(path: str) -> list:
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        raw = f.read()

    # Replace newlines with spaces so entries on split lines are joined
    text = re.sub(r'\n+', ' ', raw)
    text = re.sub(r'\s+', ' ', text)

    # Pattern to find entry starts:
    # word or phrase (up to ~40 chars, allowing spaces, hyphens, apostrophes)
    # followed by a POS abbreviation in parentheses
    pos_pattern = r'(?:vt\s*&\s*(?:vi|i)|vi|vt|v|n|adj|adv|prep|conj|pron|interj|excl)'
    entry_re = re.compile(
        r'(?<!\w)([a-z][a-z0-9\'\-]{0,30}(?:\s[a-z][a-z0-9\'\-]{0,20}){0,3})'  # English word(s)
        r'\s+\((' + pos_pattern + r')[^)]{0,20}\)\s+',
        re.IGNORECASE
    )

    matches = list(entry_re.finditer(text))
    print(f"Found {len(matches)} entry starts")

    entries = []
    seen_english = set()

    for i, match in enumerate(matches):
        english_raw = match.group(1).strip().lower()
        pos_raw = match.group(2).strip()

        # If multi-word, check if preceding words look like Dholuo carry-over
        # Dholuo markers: ng', dh, ny, ch, words ending in 'o', 'e' that are short
        words = english_raw.split()
        if len(words) > 1:
            # Find last "clean" English word — walk backwards
            clean_idx = 0
            for j, w in enumerate(words):
                if not re.search(r"ng'|^dh|^ny|^ch[^a-z]|^gi$|^ma$|^ka$|^ne$", w):
                    clean_idx = j
            english_raw = ' '.join(words[clean_idx:])

        # Remove duplicate words e.g. "lady lady"
        words = english_raw.split()
        if len(words) == 2 and words[0] == words[1]:
            english_raw = words[0]

        # Definition runs from end of this match to start of next
        def_start = match.end()
        def_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        definition = clean_text(text[def_start:def_end])

        # Skip if English word looks like noise or Dholuo carry-over
        if not english_raw or len(english_raw) < 2:
            continue
        # Skip if starts with Dholuo function words
        if re.match(r'^(kaka|kata|gi|ne|ma|ka|ni|e |ok |aa |ee |ng\'|ch|dh|ny)', english_raw):
            continue
        # Skip if too many words (probably a Dholuo phrase carried over)
        if len(english_raw.split()) > 5:
            continue
        # Skip if English word contains digits or special chars (OCR noise)
        if re.search(r'[\d\(\)\[\]{}]', english_raw):
            continue
        # Skip if English word contains Dholuo-like patterns (apostrophe mid-word)
        if re.search(r"[a-z]'[a-z]", english_raw):
            continue
        # Skip duplicates (keep first occurrence)
        if english_raw in seen_english:
            continue
        seen_english.add(english_raw)

        primary_dholuo = extract_primary_dholuo(definition)
        if not primary_dholuo or len(primary_dholuo) < 2:
            continue
        # Clean up Dholuo: remove everything after colon (quote artifacts)
        primary_dholuo = primary_dholuo.split(':')[0].strip()
        # Remove parenthetical POS that leaked in e.g. "mach. (vt)"
        primary_dholuo = re.sub(r'\s*\(.*?\)\s*.*$', '', primary_dholuo).strip()
        if not primary_dholuo:
            continue

        entries.append({
            'english': [english_raw],
            'dholuo': primary_dholuo,
            'part_of_speech': normalize_pos(pos_raw),
            'meanings': [{'text': definition[:500]}],  # cap definition length
            'difficulty': 'intermediate',
            'category': [],
        })

    return entries

if __name__ == '__main__':
    print(f"Parsing {INPUT_FILE}...")
    entries = parse(INPUT_FILE)
    print(f"Clean entries: {len(entries)}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)

    print(f"Written to {OUTPUT_FILE}")

    print("\nSample entries:")
    samples = ['abandon', 'ability', 'abolish', 'water', 'love', 'fire', 'child']
    for e in entries:
        if e['english'][0] in samples:
            print(f"  {e['english'][0]} ({e['part_of_speech']}) → {e['dholuo']}")
