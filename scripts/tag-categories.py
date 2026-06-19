#!/usr/bin/env python3
"""
Auto-tag words with categories based on English word mapping.
Updates words-parsed.json in place.
"""

import json
import re

INPUT_FILE = 'words-parsed.json'

# Category rules: list of (pattern, categories)
# Patterns are matched against the English word
RULES = [
    # Greetings & social
    (r'\b(greet|hello|goodbye|welcome|farewell|salut|morning|evening|afternoon|night|peace|thanks|thank|sorry|please|excuse|pardon)\b', ['greetings']),

    # Family & relationships
    (r'\b(mother|father|parent|child|son|daughter|brother|sister|uncle|aunt|grandmother|grandfather|grandchild|cousin|husband|wife|spouse|widow|widower|orphan|family|relative|kin|clan|tribe)\b', ['family']),

    # Animals
    (r'\b(animal|dog|cat|cow|bull|ox|goat|sheep|pig|chicken|hen|rooster|fish|bird|snake|lion|elephant|hippo|crocodile|monkey|zebra|buffalo|donkey|horse|camel|rabbit|rat|mouse|frog|lizard|eagle|vulture|hawk|ant|bee|fly|mosquito|worm|spider|crab|cricket)\b', ['animals']),

    # Food & drink
    (r'\b(food|eat|drink|cook|meal|breakfast|lunch|dinner|supper|hunger|thirst|water|milk|meat|fish|vegetable|fruit|grain|maize|sorghum|millet|bean|rice|bread|salt|sugar|oil|fat|soup|stew|porridge|ugali|beer|wine|juice)\b', ['food']),

    # Body
    (r'\b(body|head|hair|eye|ear|nose|mouth|tooth|teeth|tongue|neck|shoulder|arm|hand|finger|chest|stomach|back|leg|foot|feet|knee|heart|blood|bone|skin|face|cheek|forehead|chin|lip|thumb|nail|brain|liver|lung|kidney)\b', ['body']),

    # Nature & environment
    (r'\b(nature|tree|plant|grass|flower|leaf|root|branch|forest|bush|river|lake|sea|ocean|mountain|hill|valley|rock|stone|soil|sand|rain|wind|sun|moon|star|cloud|sky|fire|water|flood|drought|season|earth|land|ground|cave|island)\b', ['nature']),

    # Time
    (r'\b(time|day|night|morning|evening|noon|midnight|hour|minute|second|week|month|year|today|yesterday|tomorrow|past|future|present|now|soon|late|early|always|never|sometimes|daily|nightly|century|decade|moment|instant)\b', ['time']),

    # Numbers & quantity
    (r'\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|first|second|third|half|quarter|count|number|many|few|all|none|some|more|less|enough|zero)\b', ['numbers']),

    # Emotions & feelings
    (r'\b(love|hate|fear|anger|happy|sad|joy|sorrow|grief|pain|comfort|lonely|jealous|envy|shame|pride|hope|despair|peace|worry|anxious|brave|coward|kind|cruel|gentle|fierce|emotion|feel|feeling|mood|heart|soul|spirit)\b', ['emotions']),

    # Actions & movement
    (r'\b(walk|run|jump|sit|stand|sleep|wake|eat|drink|speak|talk|listen|see|look|hear|smell|touch|hold|carry|give|take|bring|send|throw|catch|fight|help|work|play|sing|dance|cry|laugh|think|know|remember|forget|learn|teach|read|write|build|break|cut|cook|clean|wash|sweep|dig|plant|harvest|buy|sell|pay|borrow|lend)\b', ['actions']),

    # Places & location
    (r'\b(place|home|house|village|town|city|market|school|church|hospital|road|path|bridge|door|window|room|field|farm|garden|well|cemetery|palace|prison|court|border|country|region|area|location|here|there|near|far|inside|outside|above|below)\b', ['places']),

    # Religion & spirituality
    (r'\b(god|spirit|prayer|pray|worship|church|bible|faith|believe|sin|blessing|curse|ancestor|ritual|sacrifice|holy|sacred|devil|angel|heaven|hell|soul|afterlife|funeral|burial|ceremony|baptism|communion|sabbath|adventist|christian|muslim|traditional)\b', ['religion']),

    # Clothing & appearance
    (r'\b(cloth|dress|shirt|trouser|skirt|shoe|hat|coat|wear|clothe|fabric|thread|needle|sew|naked|beauty|ugly|colour|color|red|blue|green|yellow|black|white|brown|tall|short|fat|thin|old|young|clean|dirty)\b', ['appearance']),

    # Health & illness
    (r'\b(health|sick|ill|disease|medicine|doctor|nurse|hospital|pain|hurt|wound|bleed|fever|cough|headache|malaria|death|die|dead|birth|born|pregnant|heal|cure|treatment|drug|herb)\b', ['health']),

    # Weather
    (r'\b(weather|rain|sun|wind|storm|thunder|lightning|cloud|fog|cold|hot|warm|cool|dry|wet|flood|drought|season|harmattan)\b', ['nature', 'weather']),

    # Tools & objects
    (r'\b(tool|knife|spear|arrow|bow|axe|hoe|plow|net|rope|basket|pot|pan|cup|plate|chair|table|bed|mat|blanket|bag|box|key|lock|wheel|boat|canoe|bicycle|car)\b', ['tools']),

    # Communication
    (r'\b(speak|talk|say|tell|ask|answer|word|language|letter|message|story|song|name|call|shout|whisper|news|rumour|lie|truth|promise|secret|argue|agree|disagree)\b', ['communication']),
]

def get_categories(english_word: str) -> list:
    word_lower = english_word.lower()
    cats = set()
    for pattern, categories in RULES:
        if re.search(pattern, word_lower, re.IGNORECASE):
            cats.update(categories)
    return sorted(cats)

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        words = json.load(f)

    tagged = 0
    untagged = 0

    for word in words:
        english = ' '.join(word.get('english', []))
        cats = get_categories(english)
        word['category'] = cats
        if cats:
            tagged += 1
        else:
            untagged += 1

    with open(INPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"Tagged:   {tagged}")
    print(f"Untagged: {untagged}")
    print(f"Total:    {len(words)}")

    # Show category distribution
    from collections import Counter
    all_cats = []
    for w in words:
        all_cats.extend(w['category'])
    print("\nCategory counts:")
    for cat, count in sorted(Counter(all_cats).items(), key=lambda x: -x[1]):
        print(f"  {cat:20s} {count}")

if __name__ == '__main__':
    main()
