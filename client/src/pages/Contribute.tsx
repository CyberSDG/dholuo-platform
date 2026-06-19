import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Search } from 'lucide-react'
import { wordsApi } from '../api'
import type { Word } from '../types'

type ContribType = 'new_word' | 'correction' | 'example'

export default function Contribute() {
  const [searchParams] = useSearchParams()

  const [type, setType] = useState<ContribType>(
    (searchParams.get('type') as ContribType) || 'new_word'
  )
  const [contributor, setContributor] = useState('')

  // Word search (for correction / example)
  const [wordQuery, setWordQuery] = useState(searchParams.get('dholuo') || '')
  const [wordId, setWordId] = useState(searchParams.get('word_id') || '')
  const [wordResults, setWordResults] = useState<Word[]>([])
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [searching, setSearching] = useState(false)

  // New word fields
  const [dholuo, setDholuo] = useState('')
  const [english, setEnglish] = useState('')

  // Correction fields
  const [correctedDholuo, setCorrectedDholuo] = useState('')
  const [correctedEnglish, setCorrectedEnglish] = useState('')
  const [correctionNote, setCorrectionNote] = useState('')

  // Example fields
  const [exampleDholuo, setExampleDholuo] = useState('')
  const [exampleEnglish, setExampleEnglish] = useState('')

  // Cultural note (all types)
  const [culturalNote, setCulturalNote] = useState('')

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // If arriving from a word detail page, pre-load that word
  useEffect(() => {
    const preloadId = searchParams.get('word_id')
    const preloadDholuo = searchParams.get('dholuo')
    if (preloadId && preloadDholuo) {
      wordsApi.getWord(preloadId).then((r) => {
        setSelectedWord(r.data)
        setWordId(preloadId)
        setWordQuery(preloadDholuo)
      }).catch(() => {})
    }
  }, [])

  const searchWords = async (q: string) => {
    if (!q.trim()) { setWordResults([]); return }
    setSearching(true)
    try {
      const res = await wordsApi.search({ q, limit: 6 })
      setWordResults(res.data.data)
    } finally {
      setSearching(false)
    }
  }

  const selectWord = (w: Word) => {
    setSelectedWord(w)
    setWordId(w.id)
    setWordQuery(w.dholuo)
    setWordResults([])
  }

  const buildPayload = () => {
    if (type === 'new_word') {
      return { dholuo, english, culturalNote }
    }
    if (type === 'correction') {
      return {
        word_id: wordId,
        original_dholuo: selectedWord?.dholuo,
        original_english: selectedWord?.english,
        corrected_dholuo: correctedDholuo,
        corrected_english: correctedEnglish,
        note: correctionNote,
      }
    }
    return {
      word_id: wordId,
      dholuo_word: selectedWord?.dholuo,
      example_dholuo: exampleDholuo,
      example_english: exampleEnglish,
      culturalNote,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if ((type === 'correction' || type === 'example') && !wordId) {
      setError('Please select a word first.')
      return
    }

    try {
      await wordsApi.contribute({
        contributor: contributor || 'anonymous',
        type,
        word_id: wordId || undefined,
        payload: buildPayload(),
      })
      setSubmitted(true)
    } catch {
      setError('Submission failed, please try again.')
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setWordQuery('')
    setWordId('')
    setSelectedWord(null)
    setDholuo('')
    setEnglish('')
    setCorrectedDholuo('')
    setCorrectedEnglish('')
    setCorrectionNote('')
    setExampleDholuo('')
    setExampleEnglish('')
    setCulturalNote('')
    setError('')
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank you for contributing</h2>
        <p className="text-gray-500 mb-6">Your submission has been received and will be reviewed before being applied.</p>
        <button onClick={resetForm} className="bg-green-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-800 transition">
          Submit Another
        </button>
      </div>
    )
  }

  const needsWordSearch = type === 'correction' || type === 'example'

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Contribute</h1>
      <p className="text-gray-500 mb-8">
        Help preserve Dholuo by adding words, fixing translations, or sharing example sentences.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        {/* Type selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What are you contributing?</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { value: 'new_word', label: 'New Word' },
              { value: 'correction', label: 'Fix a Translation' },
              { value: 'example', label: 'Add Example' },
            ] as { value: ContribType; label: string }[]).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setType(value); setSelectedWord(null); setWordId(''); setWordQuery('') }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  type === value ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600 hover:border-green-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Your name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Your name (optional)</label>
          <input
            type="text"
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
            placeholder="Anonymous"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Word search — for correction and example types */}
        {needsWordSearch && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {type === 'correction' ? 'Which word needs fixing? *' : 'Which word are you adding an example for? *'}
            </label>

            {selectedWord ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div>
                  <span className="font-semibold text-green-800">{selectedWord.dholuo}</span>
                  <span className="text-green-600 text-sm ml-2">— {selectedWord.english.join(', ')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedWord(null); setWordId(''); setWordQuery('') }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-2 focus-within:ring-2 focus-within:ring-green-500">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={wordQuery}
                    onChange={(e) => { setWordQuery(e.target.value); searchWords(e.target.value) }}
                    placeholder="Search for a Dholuo or English word..."
                    className="flex-1 text-sm focus:outline-none"
                  />
                  {searching && <span className="text-xs text-gray-400">Searching...</span>}
                </div>
                {wordResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-10 mt-1 overflow-hidden">
                    {wordResults.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => selectWord(w)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-50 last:border-0"
                      >
                        <span className="font-medium text-gray-800">{w.dholuo}</span>
                        <span className="text-gray-500 text-sm ml-2">— {w.english.join(', ')}</span>
                        {w.part_of_speech && <span className="text-gray-400 text-xs ml-2 italic">{w.part_of_speech}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* NEW WORD fields */}
        {type === 'new_word' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Dholuo word *</label>
              <input
                required
                type="text"
                value={dholuo}
                onChange={(e) => setDholuo(e.target.value)}
                placeholder="e.g. chiemo"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">English meaning *</label>
              <input
                required
                type="text"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="e.g. food"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cultural note (optional)</label>
              <textarea
                value={culturalNote}
                onChange={(e) => setCulturalNote(e.target.value)}
                placeholder="Any cultural context, usage notes, or proverbs..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </>
        )}

        {/* CORRECTION fields */}
        {type === 'correction' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Corrected Dholuo word</label>
              <input
                type="text"
                value={correctedDholuo}
                onChange={(e) => setCorrectedDholuo(e.target.value)}
                placeholder={selectedWord ? `Currently: ${selectedWord.dholuo}` : 'The correct Dholuo word'}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Corrected English meaning</label>
              <input
                type="text"
                value={correctedEnglish}
                onChange={(e) => setCorrectedEnglish(e.target.value)}
                placeholder={selectedWord ? `Currently: ${selectedWord.english.join(', ')}` : 'The correct English meaning'}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Why is this wrong? *</label>
              <textarea
                required
                value={correctionNote}
                onChange={(e) => setCorrectionNote(e.target.value)}
                placeholder="Explain what is incorrect and what the right answer is..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </>
        )}

        {/* EXAMPLE fields */}
        {type === 'example' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Example sentence (Dholuo) *</label>
              <input
                required
                type="text"
                value={exampleDholuo}
                onChange={(e) => setExampleDholuo(e.target.value)}
                placeholder="e.g. Chiemo obed maber."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Example sentence (English) *</label>
              <input
                required
                type="text"
                value={exampleEnglish}
                onChange={(e) => setExampleEnglish(e.target.value)}
                placeholder="e.g. May the food be good."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cultural note (optional)</label>
              <textarea
                value={culturalNote}
                onChange={(e) => setCulturalNote(e.target.value)}
                placeholder="Any context about when this phrase is used..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-green-700 text-white font-semibold py-3 rounded-full hover:bg-green-800 transition">
          Submit Contribution
        </button>
      </form>
    </div>
  )
}
